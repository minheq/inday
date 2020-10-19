import React, {
  useRef,
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import { Animated, Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  isEmpty,
  RecycleQueue,
  sum,
  intersectBy,
  differenceBy,
} from '../../lib/data_structures';

export interface RenderCellProps {
  row: number;
  column: number;
}

export interface RenderHeaderCellProps {
  column: number;
}

export interface GridProps {
  scrollViewHeight: number;
  scrollViewWidth: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  renderHeaderCell?: (props: RenderHeaderCellProps) => React.ReactNode;
  rowHeight: number;
  headerHeight?: number;
  rowCount: number;
  /** Length of the array determines number of columns. Array values correspond to their width. */
  columns: number[];
  fixedColumnCount: number;
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

/**
 * TODO:
 * - Smooth header sync
 *   - Memoize calculations
 *   - Recycle cells
 * - Fix overscan 0
 * - Sections
 */
export const Grid = forwardRef<GridRef, GridProps>(function Grid(props, ref) {
  const {
    columns,
    fixedColumnCount,
    rowCount,
    rowHeight,
    headerHeight,
    scrollViewHeight,
    scrollViewWidth,
    renderCell,
    renderHeaderCell,
    contentOffset,
    onContentOffsetLoaded,
  } = props;
  const verticalScrollViewRef = useRef<ScrollView>(null);
  const horizontalScrollViewRef = useRef<ScrollView>(null);
  const headerScrollViewRef = useRef<ScrollView>(null);
  const scrollYObservable = useRef(new Animated.Value(0)).current;
  const scrollXObservable = useRef(new Animated.Value(0)).current;
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const prevRowsDataRef = useRef<RowData[]>([]);
  const prevBodyRightPaneColumnsDataRef = useRef<ColumnData[]>([]);

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

      if (headerScrollViewRef.current !== null) {
        headerScrollViewRef.current.scrollTo({
          x: state.value,
          animated: false,
        });
      }
    });

    return () => {
      scrollYObservable.removeListener(scrollYListenerID);
      scrollXObservable.removeListener(scrollXListenerID);
    };
  }, [scrollYObservable, scrollXObservable, headerScrollViewRef]);

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

  const leftPaneColumnWidths = useMemo(
    () => columns.slice(0, fixedColumnCount),
    [columns, fixedColumnCount],
  );
  const leftPaneColumns = useMemo(() => getColumns(leftPaneColumnWidths), [
    leftPaneColumnWidths,
  ]);
  const rightPaneColumnWidths = useMemo(() => columns.slice(fixedColumnCount), [
    columns,
    fixedColumnCount,
  ]);
  const rightPaneColumns = useMemo(
    () => getColumns(rightPaneColumnWidths, fixedColumnCount),
    [rightPaneColumnWidths, fixedColumnCount],
  );
  const leftPaneContentWidth = sum(leftPaneColumnWidths);
  const rightPaneContentWidth = sum(rightPaneColumnWidths);
  const rightPaneScrollViewWidth = scrollViewWidth - leftPaneContentWidth;
  const contentHeight = rowCount * rowHeight;

  const rowsData = getRowsData({
    scrollY,
    scrollViewHeight,
    prevRowsData: prevRowsDataRef.current,
    rowHeight,
    rowCount,
  });

  const bodyLeftPaneColumns = useMemo(
    () =>
      recycleItems({
        columns: leftPaneColumns,
        prevColumns: [],
        startIndex: 0,
        endIndex: fixedColumnCount - 1,
      }),
    [leftPaneColumns, fixedColumnCount],
  );

  const {
    startIndex: rightPaneStartIndex,
    endIndex: rightPaneEndIndex,
  } = useMemo(
    () =>
      getIndex({
        columns: rightPaneColumns,
        scrollX,
        scrollViewWidth: rightPaneScrollViewWidth,
      }),
    [scrollX, rightPaneScrollViewWidth, rightPaneColumns],
  );

  const bodyRightPaneColumns = useMemo(
    () =>
      recycleItems({
        columns: rightPaneColumns,
        prevColumns: prevBodyRightPaneColumnsDataRef.current,
        startIndex: rightPaneStartIndex,
        endIndex: rightPaneEndIndex,
      }),
    [rightPaneColumns, rightPaneStartIndex, rightPaneEndIndex],
  );

  prevRowsDataRef.current = rowsData;
  prevBodyRightPaneColumnsDataRef.current = bodyRightPaneColumns;

  return (
    <View style={[{ height: scrollViewHeight }]}>
      {headerHeight && renderHeaderCell && (
        <View style={[{ height: headerHeight }, styles.header]}>
          <HeaderContainer
            columns={leftPaneColumns}
            renderHeaderCell={renderHeaderCell}
          />
          <ScrollView
            horizontal
            ref={headerScrollViewRef}
            scrollEnabled={false}
          >
            <HeaderContainer
              columns={rightPaneColumns}
              renderHeaderCell={renderHeaderCell}
            />
          </ScrollView>
        </View>
      )}
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
          <View style={[{ width: leftPaneContentWidth }]}>
            {rowsData.map(({ key, y, row }) => (
              <RowContainer
                columns={bodyLeftPaneColumns}
                renderCell={renderCell}
                key={key}
                y={y}
                row={row}
                height={rowHeight}
              />
            ))}
          </View>
          <View style={styles.rightPaneWrapper}>
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
              contentContainerStyle={{ width: rightPaneContentWidth }}
              scrollEventThrottle={16}
            >
              {rowsData.map(({ key, y, row }) => (
                <RowContainer
                  columns={bodyRightPaneColumns}
                  renderCell={renderCell}
                  key={key}
                  y={y}
                  row={row}
                  height={rowHeight}
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

interface Column {
  column: number;
  width: number;
  x: number;
}

export function getColumns(columnWidths: number[], offsetColumn: number = 0) {
  const columns: Column[] = [];

  for (let i = 0; i < columnWidths.length; i++) {
    const columnWidth = columnWidths[i];
    const prevColumn = columns[i - 1];

    if (prevColumn === undefined) {
      columns.push({ width: columnWidth, x: 0, column: 1 + offsetColumn });
    } else {
      columns.push({
        width: columnWidth,
        x: prevColumn.x + prevColumn.width,
        column: i + 1 + offsetColumn,
      });
    }
  }

  return columns;
}

export interface ColumnData extends Column {
  key: number;
}

interface RecycleItemsParams {
  columns: Column[];
  prevColumns: ColumnData[];
  startIndex: number;
  endIndex: number;
}

export function recycleItems(params: RecycleItemsParams): ColumnData[] {
  const { columns, startIndex, endIndex, prevColumns } = params;

  let currentColumns = columns.slice(startIndex, endIndex + 1);

  if (isEmpty(prevColumns)) {
    return currentColumns.map((col, index) => ({ ...col, key: index }));
  }

  const reusedColumns = intersectBy(
    prevColumns,
    currentColumns,
    'column',
  ) as ColumnData[];
  const recycledColumns = differenceBy(
    prevColumns,
    currentColumns,
    'column',
  ) as ColumnData[];
  const newColumns = differenceBy(
    currentColumns,
    prevColumns,
    'column',
  ) as Column[];

  const recycledKeys = recycledColumns.map((c) => c.key);
  if (recycledKeys.length < newColumns.length) {
    let maxKey = Math.max(...prevColumns.map((c) => c.key)) + 1;
    recycledKeys.push(maxKey++);
  }

  return reusedColumns
    .concat(newColumns.map((c, i) => ({ ...c, key: recycledKeys[i] })))
    .sort((a, b) => a.column - b.column);
}

interface GetIndexParams {
  columns: Column[];
  scrollX: number;
  scrollViewWidth: number;
}

export function getIndex(params: GetIndexParams) {
  const { columns, scrollX, scrollViewWidth } = params;

  let startIndex = 0;
  let endIndex = 0;

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (column.x > scrollX) {
      startIndex = i - 1;
      break;
    }
  }

  for (let i = startIndex; i < columns.length; i++) {
    const column = columns[i];

    if (column.x + column.width >= scrollX + scrollViewWidth) {
      endIndex = i;
      break;
    }
  }

  // Scrollview is larger than occupied columns
  if (endIndex === 0) {
    endIndex = columns.length - 1;
  }

  return { startIndex, endIndex };
}

interface RowContainerProps {
  height: number;
  y: number;
  row: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  columns: ColumnData[];
}

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const { height, y, row, columns, renderCell } = props;

  return (
    <View style={[{ height, top: y }, styles.row]}>
      {columns.map((columnData) => {
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

interface HeaderContainerProps {
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  columns: Column[];
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const { columns, renderHeaderCell } = props;

  return (
    <View style={[styles.header]}>
      {columns.map((columnData) => {
        const { width, column } = columnData;

        return (
          <View key={column} style={[{ width }]}>
            {renderHeaderCell({ column })}
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
  rightPaneWrapper: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
  },
  cell: {
    position: 'absolute',
  },
});
