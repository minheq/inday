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
  sum,
  intersectBy,
  differenceBy,
  maxBy,
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
  const prevRowsDataRef = useRef<RecycleItem[]>([]);
  const prevBodyRightPaneColumnsDataRef = useRef<RecycleItem[]>([]);

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
  const leftPaneColumns = useMemo(() => getItems(leftPaneColumnWidths), [
    leftPaneColumnWidths,
  ]);
  const rightPaneColumnWidths = useMemo(() => columns.slice(fixedColumnCount), [
    columns,
    fixedColumnCount,
  ]);
  const rightPaneColumns = useMemo(
    () => getItems(rightPaneColumnWidths, fixedColumnCount),
    [rightPaneColumnWidths, fixedColumnCount],
  );
  const rows = useMemo(() => {
    const items: Item[] = [];
    for (let i = 0; i < rowCount; i++) {
      items.push({ num: i + 1, size: rowHeight, offset: i * rowHeight });
    }
    return items;
  }, [rowCount, rowHeight]);
  const leftPaneContentWidth = sum(leftPaneColumnWidths);
  const rightPaneContentWidth = sum(rightPaneColumnWidths);
  const rightPaneScrollViewWidth = scrollViewWidth - leftPaneContentWidth;
  const contentHeight = rowCount * rowHeight;

  const { startIndex: rowStartIndex, endIndex: rowEndIndex } = useMemo(
    () =>
      getIndex({
        items: rows,
        scrollOffset: scrollY,
        scrollViewSize: scrollViewHeight,
      }),
    [rows, scrollY, scrollViewHeight],
  );

  const recycledRows = useMemo(
    () =>
      recycleItems({
        items: rows,
        prevItems: prevRowsDataRef.current,
        startIndex: rowStartIndex,
        endIndex: rowEndIndex,
      }),
    [rows, rowStartIndex, rowEndIndex],
  );

  const bodyLeftPaneColumns = useMemo(
    () =>
      recycleItems({
        items: leftPaneColumns,
        prevItems: [],
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
        items: rightPaneColumns,
        scrollOffset: scrollX,
        scrollViewSize: rightPaneScrollViewWidth,
      }),
    [scrollX, rightPaneScrollViewWidth, rightPaneColumns],
  );

  const bodyRightPaneColumns = useMemo(
    () =>
      recycleItems({
        items: rightPaneColumns,
        prevItems: prevBodyRightPaneColumnsDataRef.current,
        startIndex: rightPaneStartIndex,
        endIndex: rightPaneEndIndex,
      }),
    [rightPaneColumns, rightPaneStartIndex, rightPaneEndIndex],
  );

  prevRowsDataRef.current = recycledRows;
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
            {recycledRows.map(({ key, size, offset, num }) => (
              <RowContainer
                columns={bodyLeftPaneColumns}
                renderCell={renderCell}
                key={key}
                y={offset}
                row={num}
                height={size}
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
              {recycledRows.map(({ key, size, offset, num }) => (
                <RowContainer
                  columns={bodyRightPaneColumns}
                  renderCell={renderCell}
                  key={key}
                  y={offset}
                  row={num}
                  height={size}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export function getItems(itemSizes: number[], offsetNum: number = 0) {
  const items: Item[] = [];

  for (let i = 0; i < itemSizes.length; i++) {
    const size = itemSizes[i];
    const prevColumn = items[i - 1];

    if (prevColumn === undefined) {
      items.push({ size, offset: 0, num: 1 + offsetNum });
    } else {
      items.push({
        size,
        offset: prevColumn.offset + prevColumn.size,
        num: i + 1 + offsetNum,
      });
    }
  }

  return items;
}

export interface RecycleItem extends Item {
  key: number;
}

interface RecycleItemsParams {
  items: Item[];
  prevItems: RecycleItem[];
  startIndex: number;
  endIndex: number;
}

export function recycleItems(params: RecycleItemsParams): RecycleItem[] {
  const { items, startIndex, endIndex, prevItems } = params;

  const currentItems = items.slice(startIndex, endIndex + 1);

  if (isEmpty(prevItems)) {
    return currentItems.map((col, index) => ({ ...col, key: index }));
  }

  const reusedColumns = intersectBy(prevItems, currentItems, 'num');
  const recycledColumns = differenceBy(prevItems, currentItems, 'num');
  const newColumns = differenceBy(currentItems, prevItems, 'num');

  const recycledKeys = recycledColumns.map((c) => c.key);
  if (recycledKeys.length < newColumns.length) {
    let maxKey = maxBy(prevItems, 'key') + 1;
    recycledKeys.push(maxKey++);
  }

  const nextColumns = reusedColumns
    .concat(newColumns.map((c, i) => ({ ...c, key: recycledKeys[i] })))
    .sort((a, b) => a.num - b.num);

  return nextColumns;
}

interface Item {
  size: number;
  offset: number;
  num: number;
}

interface GetIndexParams {
  items: Item[];
  scrollOffset: number;
  scrollViewSize: number;
}

export function getIndex(params: GetIndexParams) {
  const { items, scrollOffset, scrollViewSize } = params;

  let startIndex = 0;
  let endIndex = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.offset > scrollOffset) {
      startIndex = i - 1;
      break;
    }
  }

  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];

    if (item.offset + item.size >= scrollOffset + scrollViewSize) {
      endIndex = i;
      break;
    }
  }

  // Scrollview is larger than occupied items
  if (endIndex === 0) {
    endIndex = items.length - 1;
  }

  return { startIndex, endIndex };
}

interface RowContainerProps {
  height: number;
  y: number;
  row: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  columns: RecycleItem[];
}

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const { height, y, row, columns, renderCell } = props;

  return (
    <View style={[{ height, top: y }, styles.row]}>
      {columns.map((columnData) => {
        const { key, size: width, num: column, offset } = columnData;

        return (
          <View key={key} style={[{ left: offset, width }, styles.cell]}>
            {renderCell({ row, column })}
          </View>
        );
      })}
    </View>
  );
});

interface HeaderContainerProps {
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  columns: Item[];
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const { columns, renderHeaderCell } = props;

  return (
    <View style={[styles.header]}>
      {columns.map((columnData) => {
        const { size: width, num: column } = columnData;

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
