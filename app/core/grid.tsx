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
import { isEmpty, RecycleQueue } from '../../lib/data_structures';

export interface RenderCellProps {
  row: number;
  column: number;
}

export interface GridProps {
  scrollViewHeight: number;
  scrollViewWidth: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  rowHeight: number;
  rowsCount: number;
  /** Length of the array determines number of columns. Array values correspond to their width. */
  columns: number[];
  frozenColumnsCount: number;
  /** Used to manually set the starting scroll offset. The default value is {x: 0, y: 0} */
  contentOffset?: ContentOffset;
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
    frozenColumnsCount,
    rowsCount,
    rowHeight,
    scrollViewHeight,
    scrollViewWidth,
    renderCell,
    contentOffset,
  } = props;
  const verticalScrollViewRef = useRef<ScrollView>(null);
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentOffsetLoaded, setContentOffsetLoaded] = useState(
    contentOffset === undefined,
  );
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const prevItemsRef = useRef<Item[]>([]);

  const contentHeight = rowsCount * rowHeight;
  const contentWidth = columns.reduce((v, c) => v + c, 0);

  const handleScrollTo = useCallback(
    (params: ScrollToParams) => {
      const { x, y, animated } = params;

      if (verticalScrollViewRef.current) {
        verticalScrollViewRef.current.scrollTo({ y, animated });
      }
      if (horizontalScrollViewRef.current) {
        horizontalScrollViewRef.current.scrollTo({ x, animated });
      }

      if (contentOffsetLoaded === false) {
        setContentOffsetLoaded(true);
      }
    },
    [contentOffsetLoaded, verticalScrollViewRef, horizontalScrollViewRef],
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
    const yScrollListenerID = scrollY.addListener((position) => {
      setScrollTop(position.value);
    });
    const xScrollListenerID = scrollX.addListener((position) => {
      setScrollLeft(position.value);
    });

    return () => {
      scrollY.removeListener(yScrollListenerID);
      scrollX.removeListener(xScrollListenerID);
    };
  }, [scrollY, scrollX]);

  useEffect(() => {
    if (Platform.OS === 'web' && contentOffset) {
      handleScrollTo({
        y: contentOffset.y,
        x: contentOffset.x,
        animated: false,
      });
    }
  }, [handleScrollTo, contentOffset]);

  const frozenColumns = columns.slice(0, frozenColumnsCount);
  const scrollableColumns = columns.slice(frozenColumnsCount);

  const frozenColumnsWidth = frozenColumns.reduce(
    (val, column) => val + column,
    0,
  );

  const scrollableColumnsWidth = scrollableColumns.reduce(
    (val, column) => val + column,
    0,
  );

  const items = getItems({
    scrollTop,
    scrollViewHeight,
    prevItems: prevItemsRef.current,
    rowHeight,
    rowsCount,
  });

  const frozenColumnsData = getColumnsData({
    scrollLeft,
    scrollViewWidth: frozenColumnsWidth,
    columns: frozenColumns,
    overscan: 2,
  });
  const scrollableColumnsData = getColumnsData({
    scrollLeft,
    scrollViewWidth: scrollViewWidth - frozenColumnsWidth,
    columns: scrollableColumns,
    overscan: 2,
  });

  prevItemsRef.current = items;

  return (
    <View
      style={[
        { height: scrollViewHeight },
        contentOffsetLoaded ? styles.visible : styles.invisible,
      ]}
    >
      <ScrollView
        ref={verticalScrollViewRef}
        contentOffset={contentOffset}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
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
          <View
            style={[styles.frozenCellsWrapper, { width: frozenColumnsWidth }]}
          >
            {items.map(({ key, top, row }) => (
              <RowContainer
                frozen={true}
                frozenColumnsCount={frozenColumnsCount}
                columns={columns}
                renderCell={renderCell}
                key={key}
                top={top}
                row={row}
                height={rowHeight}
                startColumnIndex={frozenColumnsData.startIndex}
                endColumnIndex={frozenColumnsData.endIndex}
              />
            ))}
          </View>
          <View style={styles.scrollableCellsWrapper}>
            <ScrollView
              ref={horizontalScrollViewRef}
              contentOffset={contentOffset}
              horizontal
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: scrollX,
                      },
                    },
                  },
                ],
                { useNativeDriver: false },
              )}
              contentContainerStyle={{ height: contentWidth }}
              scrollEventThrottle={16}
            >
              <View
                style={[
                  styles.scrollableCellsContentWrapper,
                  { width: scrollableColumnsWidth },
                ]}
              >
                {items.map(({ key, top, row }) => (
                  <RowContainer
                    frozen={false}
                    frozenColumnsCount={frozenColumnsCount}
                    columns={columns}
                    renderCell={renderCell}
                    key={key}
                    top={top}
                    row={row}
                    height={rowHeight}
                    startColumnIndex={scrollableColumnsData.startIndex}
                    endColumnIndex={scrollableColumnsData.endIndex}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export interface Item {
  row: number;
  key: number;
  top: number;
}

interface GetItemsParams {
  scrollViewHeight: number;
  rowHeight: number;
  scrollTop: number;
  rowsCount: number;
  prevItems: Item[];
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
export function getItems(params: GetItemsParams): Item[] {
  const {
    prevItems,
    scrollViewHeight,
    scrollTop,
    rowHeight,
    rowsCount,
  } = params;

  // size is the number of visible rows
  const size = Math.floor(scrollViewHeight / rowHeight);
  // prefetch the same number of items that are above and below the currently visible items
  const overscanSize = size * 2;
  // totalSize is the number of visible rows plus overscan rows (here equal to the size)
  const totalSize = size + overscanSize;

  const queue = new RecycleQueue(
    totalSize,
    prevItems.map((i) => i.row),
  );

  if (isEmpty(prevItems)) {
    for (let i = 0; i < totalSize; i++) {
      queue.enqueue();
    }
  } else {
    // first row that is visible
    const visibleStartRow = Math.floor(scrollTop / rowHeight) + 1; // row index + 1 = row number
    // first row in the overscan above visible rows
    const overscanStartRow = visibleStartRow - size;

    const prevStartRow = Math.min(...prevItems.map((i) => i.row));

    const diff = overscanStartRow - prevStartRow;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        if (queue.front() >= rowsCount) {
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
      top: (row - 1) * rowHeight,
    };
  });

  return items;
}

interface ColumnData {
  left: number;
  key: number;
  column: number;
  width: number;
}

interface GetColumnsDataParams {
  columns: number[];
  scrollLeft: number;
  scrollViewWidth: number;
  overscan?: number;
}

export function getColumnsData(params: GetColumnsDataParams) {
  const { scrollLeft, columns, scrollViewWidth, overscan = 0 } = params;

  let startIndex = 0;
  let currentStartWidth = 0;

  for (let i = 0; i < columns.length; i++) {
    const columnWidth = columns[i];

    if (currentStartWidth === scrollLeft) {
      startIndex = i;
      break;
    } else if (currentStartWidth > scrollLeft) {
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
      currentEndWidth >= scrollLeft + scrollViewWidth ||
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
  top: number;
  row: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  columns: number[];
  frozen: boolean;
  frozenColumnsCount: number;
  startColumnIndex: number;
  endColumnIndex: number;
}

const RowContainer = memo(function RowContainer(props: RowPropsContainer) {
  const {
    frozen,
    frozenColumnsCount,
    height,
    top,
    row,
    columns: allColumns,
    startColumnIndex,
    endColumnIndex,
    renderCell,
  } = props;

  let initialLeft = 0;
  const columns = frozen
    ? allColumns.slice(0, frozenColumnsCount)
    : allColumns.slice(frozenColumnsCount);

  for (let i = 0; i < startColumnIndex; i++) {
    initialLeft += columns[i];
  }

  const columnsData: ColumnData[] = [];
  let columnKey = 0;
  let addLeft = 0;

  for (let i = startColumnIndex; i <= endColumnIndex; i++) {
    const columnWidth = columns[i];
    columnsData.push({
      key: columnKey,
      column: frozen ? i + 1 : i + 1 + frozenColumnsCount,
      width: columnWidth,
      left: initialLeft + addLeft,
    });

    addLeft += columnWidth;
    columnKey++;
  }

  return (
    <View style={[{ height, top }, styles.row]}>
      {columnsData.map((columnData) => {
        const { key, width, column, left } = columnData;

        return (
          <View key={key} style={[{ left, width }, styles.cell]}>
            {renderCell({ row, column })}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    zIndex: 10,
  },
  invisible: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'pink',
  },
  frozenCellsWrapper: {},
  scrollableCellsWrapper: {
    flex: 1,
  },
  scrollableCellsContentWrapper: {},
  row: {
    flexDirection: 'row',
    position: 'absolute',
  },
  cell: {
    position: 'absolute',
  },
});
