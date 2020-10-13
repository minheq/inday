import React, {
  useRef,
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { Animated, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { isEmpty, RecycleQueue, sum } from '../../lib/data_structures';

export interface RenderCellProps {
  row: number;
  column: number;
}

export interface GridProps {
  scrollViewHeight: number;
  scrollViewWidth: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  rowHeight: number;
  rowCount: number;
  /** Length of the array determines number of columns. Array values correspond to their width. */
  columns: number[];
  frozenColumnCount: number;
  overscanColumnCount?: number;
  /** Used to manually set the starting scroll offset. The default value is {x: 0, y: 0} */
  contentOffset?: ContentOffset;
  /** (Web) Starting scroll offset has loaded */
  onContentOffsetLoaded?: () => void;
}

interface ContentOffset {
  x: number;
  y: number;
}

interface ScrollToParams extends Partial<ContentOffset> {
  animated?: boolean;
}

interface GridRef {
  scrollTo: (params: ScrollToParams) => void;
}

export const Grid = forwardRef<GridRef, GridProps>(function Grid(props, ref) {
  const {
    columns,
    frozenColumnCount,
    rowCount,
    rowHeight,
    scrollViewHeight,
    scrollViewWidth,
    renderCell,
    contentOffset = { x: 0, y: 0 },
    overscanColumnCount = 2,
    onContentOffsetLoaded,
  } = props;
  const verticalScrollViewRef = useRef<ScrollView>(null);
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const scrollYObservable = useRef(new Animated.Value(0)).current;
  const scrollXObservable = useRef(new Animated.Value(0)).current;
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const prevRowsDataRef = useRef<RowData[]>([]);
  const contentHeight = rowCount * rowHeight;

  const handleScrollTo = useCallback(
    (params: ScrollToParams) => {
      if (verticalScrollViewRef.current) {
        verticalScrollViewRef.current.scrollTo(params);
      }
      if (horizontalScrollViewRef.current) {
        horizontalScrollViewRef.current.scrollTo(params);
      }
    },
    [verticalScrollViewRef, horizontalScrollViewRef],
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollTo: handleScrollTo,
      };
    },
    [handleScrollTo],
  );

  // Set up scroll listeners
  useEffect(() => {
    const scrollYListenerID = scrollYObservable.addListener((state) => {
      setScrollY(state.value);
    });
    const scrollXListenerID = scrollXObservable.addListener((state) => {
      setScrollX(state.value);
    });

    return () => {
      scrollYObservable.removeListener(scrollYListenerID);
      scrollXObservable.removeListener(scrollXListenerID);
    };
  }, [scrollYObservable, scrollXObservable]);

  useEffect(() => {
    if (Platform.OS === 'web' && contentOffset) {
      handleScrollTo({
        y: contentOffset.y,
        x: contentOffset.x,
        animated: false,
      });

      if (onContentOffsetLoaded) {
        onContentOffsetLoaded();
      }
    }
  }, [onContentOffsetLoaded, handleScrollTo, contentOffset]);

  const frozenAreaColumns = columns.slice(0, frozenColumnCount);
  const scrollAreaColumns = columns.slice(frozenColumnCount);
  const frozenAreaWidth = sum(frozenAreaColumns);
  const scrollAreaWidth = sum(scrollAreaColumns);

  const rowsData = getRowsData({
    scrollY,
    scrollViewHeight,
    prevRowsData: prevRowsDataRef.current,
    rowHeight,
    rowCount,
  });
  const frozenAreaColumnsData = getColumnsData({
    scrollX,
    scrollViewWidth: frozenAreaWidth,
    columns: frozenAreaColumns,
    overscan: overscanColumnCount,
  });
  const scrollAreaColumnsData = getColumnsData({
    scrollX,
    scrollViewWidth: scrollViewWidth - frozenAreaWidth,
    columns: scrollAreaColumns,
    overscan: overscanColumnCount,
  });

  prevRowsDataRef.current = rowsData;

  return (
    <View style={[{ height: scrollViewHeight }]}>
      <ScrollView
        ref={verticalScrollViewRef}
        contentOffset={contentOffset}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollYObservable,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        contentContainerStyle={{ height: contentHeight }}
        scrollEventThrottle={16}
      >
        <View style={styles.wrapper}>
          <View style={[{ width: frozenAreaWidth }]}>
            {rowsData.map(({ key, y, row }) => (
              <RowContainer
                frozen={true}
                frozenColumnCount={frozenColumnCount}
                columns={columns}
                renderCell={renderCell}
                key={key}
                y={y}
                row={row}
                height={rowHeight}
                startColumnIndex={frozenAreaColumnsData.startIndex}
                endColumnIndex={frozenAreaColumnsData.endIndex}
              />
            ))}
          </View>
          <View style={styles.scrollAreaWrapper}>
            <ScrollView
              ref={horizontalScrollViewRef}
              contentOffset={contentOffset}
              horizontal
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: scrollXObservable,
                      },
                    },
                  },
                ],
                { useNativeDriver: false },
              )}
              contentContainerStyle={{ height: scrollAreaWidth }}
              scrollEventThrottle={16}
            >
              {rowsData.map(({ key, y, row }) => (
                <RowContainer
                  frozen={false}
                  frozenColumnCount={frozenColumnCount}
                  columns={columns}
                  renderCell={renderCell}
                  key={key}
                  y={y}
                  row={row}
                  height={rowHeight}
                  startColumnIndex={scrollAreaColumnsData.startIndex}
                  endColumnIndex={scrollAreaColumnsData.endIndex}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export interface RowData {
  row: number;
  key: number;
  y: number;
}

interface GetRowsDataParams {
  scrollViewHeight: number;
  rowHeight: number;
  scrollY: number;
  rowCount: number;
  prevRowsData: RowData[];
}

/**
 * Applies algorithm to recycle items by reusing keys and apply only changes to the
 * scroll position of the nodes that are meant to be immediately visible.
 *
 * For example, given a list where there are 30 items, but only 5 are visible in the view.
 *
 * The algorithm will yield visible items (1-5) but will also "prefetch" items that is 2x the visible nodes
 * which is 5-15.
 *
 * Illustrated:
 * [
 *  // visible nodes
 *  1,
 *  ...
 *  5,
 *
 *  // not visible nodes, but "overscan" -- exists in the DOM
 *  6,
 *  ...
 *  15,
 *
 *  // not in the DOM
 *  16
 *  ...
 *  30
 * ]
 *
 * When user scrolls down where the first visible item is 10, the algorithm will yield following shape:
 *
 * [
 *  // not in the DOM
 *  1,
 *  ...
 *  4,
 *
 *  // "overscan" -- exists in the DOM
 *  5,
 *  ...
 *  9,
 *
 *  // visible nodes
 *  10,
 *  ...
 *  14,
 *
 *  // "overscan" -- exists in the DOM
 *  15,
 *  ...
 *  19,
 *
 *  // not in the DOM
 *  20
 *  ...
 *  30
 * ]
 *
 * When user scrolls to the bottom of the list
 *
 * [
 *  // not in the DOM
 *  1,
 *  ...
 *  15,
 *
 *  // "overscan" -- exists in the DOM
 *  16,
 *  ...
 *  25,
 *
 *  // visible nodes
 *  26
 *  ...
 *  30
 * ]
 *
 * See tests for the implementation of the scenario
 */
export function getRowsData(params: GetRowsDataParams): RowData[] {
  const {
    prevRowsData,
    scrollViewHeight,
    scrollY,
    rowHeight,
    rowCount,
  } = params;

  // size is the number of visible rows
  const size = Math.floor(scrollViewHeight / rowHeight);
  // overscan the same number of items that are above and below the currently visible items
  const overscanSize = size * 2;
  // totalSize is the number of visible rows plus overscan rows (here equal to the size)
  const totalSize = size + overscanSize;

  const queue = new RecycleQueue(
    totalSize,
    prevRowsData.map((i) => i.row),
  );

  if (isEmpty(prevRowsData)) {
    for (let i = 0; i < totalSize; i++) {
      queue.enqueue();
    }
  } else {
    // first row that is visible
    const visibleStartRow = Math.floor(scrollY / rowHeight) + 1; // row index + 1 = row number
    // first row in the overscan above visible rows
    const overscanStartRow = visibleStartRow - size;

    const prevStartRow = Math.min(...prevRowsData.map((i) => i.row));

    const diff = overscanStartRow - prevStartRow;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        if (queue.front() >= rowCount) {
          break;
        }
        queue.enqueue();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        if (queue.rear() === 1) {
          break;
        }
        queue.dequeue();
      }
    }
  }

  const items = queue.items.map((row, key) => {
    return {
      key,
      row,
      y: (row - 1) * rowHeight,
    };
  });

  return items;
}

interface ColumnData {
  x: number;
  key: number;
  column: number;
  width: number;
}

interface GetColumnsDataParams {
  columns: number[];
  scrollX: number;
  scrollViewWidth: number;
  overscan?: number;
}

export function getColumnsData(params: GetColumnsDataParams) {
  const { scrollX, columns, scrollViewWidth, overscan = 0 } = params;

  let startIndex = 0;
  let currentStartWidth = 0;

  for (let i = 0; i < columns.length; i++) {
    const columnWidth = columns[i];

    if (currentStartWidth === scrollX) {
      startIndex = i;
      break;
    } else if (currentStartWidth > scrollX) {
      startIndex = i - 1;

      const prevColumnWidth = columns[i - 1];
      currentStartWidth -= prevColumnWidth;

      break;
    }

    currentStartWidth += columnWidth;
  }

  let endIndex = 0;
  let currentEndWidth = currentStartWidth;

  for (let i = startIndex; i < columns.length + 1; i++) {
    const columnWidth = columns[i];

    if (
      currentEndWidth >= scrollX + scrollViewWidth ||
      columnWidth === undefined
    ) {
      endIndex = i - 1;
      break;
    }

    currentEndWidth += columnWidth;
  }

  startIndex = Math.max(startIndex - overscan, 0);
  endIndex = Math.min(endIndex + overscan, columns.length - 1);

  return { startIndex, endIndex };
}

interface RowPropsContainer {
  height: number;
  y: number;
  row: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  columns: number[];
  frozen: boolean;
  frozenColumnCount: number;
  startColumnIndex: number;
  endColumnIndex: number;
}

const RowContainer = memo(function RowContainer(props: RowPropsContainer) {
  const {
    frozen,
    frozenColumnCount,
    height,
    y,
    row,
    columns: allColumns,
    startColumnIndex,
    endColumnIndex,
    renderCell,
  } = props;

  let initialX = 0;
  const columns = frozen
    ? allColumns.slice(0, frozenColumnCount)
    : allColumns.slice(frozenColumnCount);

  for (let i = 0; i < startColumnIndex; i++) {
    initialX += columns[i];
  }

  const columnsData: ColumnData[] = [];
  let currentX = 0;

  for (let i = startColumnIndex; i <= endColumnIndex; i++) {
    const columnWidth = columns[i];
    const column = frozen ? i + 1 : i + 1 + frozenColumnCount;

    columnsData.push({
      key: column,
      column,
      width: columnWidth,
      x: initialX + currentX,
    });

    currentX += columnWidth;
  }

  return (
    <View style={[{ height, top: y }, styles.row]}>
      {columnsData.map((columnData) => {
        const { key, width, column, x } = columnData;

        return (
          <View key={key} style={[{ left: x, width }, styles.cell]}>
            {renderCell({ row, column })}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollAreaWrapper: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    position: 'absolute',
  },
  cell: {
    position: 'absolute',
  },
});
