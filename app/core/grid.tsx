import React, {
  useRef,
  useEffect,
  useState,
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
  Fragment,
} from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import {
  Item,
  RecycledItem,
  useGetEnhancedRecycledRows,
  useGridGetScrollToCellOffset,
  useGridMeasurer,
  useGridRecycler,
} from './grid.common';

export interface GridProps {
  focusedCell?: FocusedCell | null;
  selectedRows?: number[] | null;
  height: number;
  width: number;
  renderRow: (props: RenderRowProps) => React.ReactNode;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  /** To display header, also pass `renderHeader` and `renderHeaderCell` props */
  headerHeight?: number;
  /** To display header, also pass `headerHeight` and `renderHeaderCell` props */
  renderHeader?: (props: RenderHeaderProps) => React.ReactNode;
  /** To display header, also pass `headerHeight` and `renderHeader` props */
  renderHeaderCell?: (props: RenderHeaderCellProps) => React.ReactNode;
  rowHeight: number;
  rowCount: number;
  /** Length of the array determines number of columns. Array values correspond to their width. */
  columns: number[];
  fixedColumnCount: number;
  /** Used to manually set the starting scroll offset. The default value is {x: 0, y: 0} */
  contentOffset?: ContentOffset;
  /** (Web) Starting scroll offset has loaded */
  onContentOffsetLoaded?: () => void;
}

export interface RenderRowProps {
  row: number;
  selected: boolean;
  children: React.ReactNode;
}

export interface RenderHeaderProps {
  children: React.ReactNode;
}

export interface RenderCellProps {
  row: number;
  column: number;
  focused: boolean;
  editing: boolean;
  selected: boolean;
}

export interface RenderHeaderCellProps {
  column: number;
}

export interface Cell {
  row: number;
  column: number;
}

export interface FocusedCell extends Cell {
  editing: boolean;
}

export interface ContentOffset {
  x: number;
  y: number;
}

export interface ScrollToOffsetParams extends Partial<ContentOffset> {
  animated?: boolean;
}

export interface ScrollToCellParams extends Partial<Cell> {
  animated?: boolean;
}

export interface GridRef {
  scrollToOffset: (params: ScrollToOffsetParams) => void;
  scrollToCell: (params: ScrollToCellParams) => void;
}

/**
 * To display header, pass `headerHeight`, `renderHeader` and `renderHeaderCell` props
 */
export const Grid = memo(
  forwardRef<GridRef, GridProps>(function Grid(props, ref) {
    const {
      focusedCell,
      renderRow,
      selectedRows,
      columns,
      fixedColumnCount,
      rowCount,
      rowHeight,
      headerHeight,
      height,
      width,
      renderCell,
      renderHeaderCell,
      contentOffset,
    } = props;
    const verticalScrollViewRef = useRef<ScrollView>(null);
    const horizontalScrollViewRef = useRef<ScrollView>(null);
    const headerScrollViewRef = useRef<ScrollView>(null);
    const scrollYObservable = useRef(new Animated.Value(0)).current;
    const scrollXObservable = useRef(new Animated.Value(0)).current;
    const [scrollY, setScrollY] = useState(0);
    const [scrollX, setScrollX] = useState(0);

    const handleScrollToOffset = useCallback(
      (params: ScrollToOffsetParams) => {
        if (verticalScrollViewRef.current) {
          verticalScrollViewRef.current.scrollTo(params);
        }
        if (horizontalScrollViewRef.current) {
          horizontalScrollViewRef.current.scrollTo(params);
        }
      },
      [verticalScrollViewRef, horizontalScrollViewRef],
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

    const {
      contentHeight,
      contentWidth,
      leftPaneColumns,
      leftPaneContentWidth,
      rightPaneColumns,
      rows,
    } = useGridMeasurer({
      columns,
      fixedColumnCount,
      rowCount,
      rowHeight,
    });
    const { recycledRows, recycledColumns } = useGridRecycler({
      rows,
      columns: rightPaneColumns,
      scrollViewHeight: height,
      scrollViewWidth: width,
      scrollX,
      scrollY,
    });
    const enhancedRecycledRows = useGetEnhancedRecycledRows({
      recycledRows,
      focusedCell,
      selectedRows,
    });
    const getScrollToCellOffset = useGridGetScrollToCellOffset({
      rows,
      fixedColumnCount,
      columns: rightPaneColumns,
      scrollViewHeight: height,
      scrollViewWidth: width,
      scrollX,
      scrollY,
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          scrollToOffset: handleScrollToOffset,
          scrollToCell: (cell) =>
            handleScrollToOffset(getScrollToCellOffset(cell)),
        };
      },
      [handleScrollToOffset, getScrollToCellOffset],
    );

    return (
      <View style={[{ height }]}>
        <ScrollView
          bounces={false}
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
          <ScrollView
            bounces={false}
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
            contentContainerStyle={{ width: contentWidth }}
            scrollEventThrottle={16}
          >
            {headerHeight !== undefined && renderHeaderCell && (
              <HeaderContainer
                leftPaneContentWidth={leftPaneContentWidth}
                scrollXObservable={scrollXObservable}
                scrollYObservable={scrollYObservable}
                height={headerHeight}
                leftPaneColumns={leftPaneColumns}
                rightPaneColumns={rightPaneColumns}
                renderHeaderCell={renderHeaderCell}
              />
            )}
            {enhancedRecycledRows.map(
              ({ key, size, offset, num, selected, focusedCell }) => (
                <RowContainer
                  leftPaneContentWidth={leftPaneContentWidth}
                  scrollXObservable={scrollXObservable}
                  width={contentWidth}
                  leftPaneColumns={leftPaneColumns}
                  rightPaneColumns={recycledColumns}
                  renderCell={renderCell}
                  key={key}
                  y={offset}
                  row={num}
                  height={size}
                  renderRow={renderRow}
                  selected={selected}
                  focusedCell={focusedCell}
                />
              ),
            )}
          </ScrollView>
        </ScrollView>
      </View>
    );
  }),
);

interface RowContainerProps {
  height: number;
  width: number;
  y: number;
  row: number;
  leftPaneContentWidth: number;
  renderRow: (props: RenderRowProps) => React.ReactNode;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  leftPaneColumns: Item[];
  rightPaneColumns: RecycledItem[];
  selected: boolean;
  scrollXObservable: Animated.Value;
  focusedCell: FocusedCell | null;
}

const RowContainer = memo(function RowContainer(props: RowContainerProps) {
  const {
    width,
    height,
    y,
    row,
    scrollXObservable,
    leftPaneContentWidth,
    leftPaneColumns,
    rightPaneColumns,
    focusedCell,
    selected,
    renderCell,
    renderRow,
  } = props;

  const children = (
    <Fragment>
      <Animated.View
        style={[styles.leftPaneWrapper, { left: scrollXObservable }]}
      >
        {leftPaneColumns.map((columnData) => {
          const { size, num: column, offset } = columnData;
          const focused = !!(focusedCell?.column === column);
          const editing = !!(focused && focusedCell?.editing);

          return (
            <CellContainer
              key={column}
              width={size}
              row={row}
              height={height}
              column={column}
              x={offset}
              focused={focused}
              editing={editing}
              selected={selected}
              renderCell={renderCell}
            />
          );
        })}
      </Animated.View>
      <View style={[styles.rightPaneWrapper, { left: leftPaneContentWidth }]}>
        {rightPaneColumns.map((columnData) => {
          const { key, size, num: column, offset } = columnData;
          const focused = !!(focusedCell?.column === column);
          const editing = !!(focused && focusedCell?.editing);

          return (
            <CellContainer
              key={key}
              width={size}
              row={row}
              height={height}
              column={column}
              x={offset}
              focused={focused}
              editing={editing}
              selected={selected}
              renderCell={renderCell}
            />
          );
        })}
      </View>
    </Fragment>
  );

  return (
    <View
      style={[
        { height, width, top: y },
        styles.row,
        selected && styles.selected,
      ]}
    >
      {renderRow({ row, selected, children })}
    </View>
  );
});

interface CellContainerProps {
  x: number;
  width: number;
  height: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  column: number;
  row: number;
  focused: boolean;
  editing: boolean;
  selected: boolean;
}

const CellContainer = memo(function CellContainer(props: CellContainerProps) {
  const {
    x,
    row,
    column,
    width,
    height,
    focused,
    editing,
    selected,
    renderCell,
  } = props;

  return (
    <View
      style={[
        { left: x, width, height },
        styles.cell,
        focused && styles.selected,
      ]}
    >
      {renderCell({ row, column, focused, editing, selected })}
    </View>
  );
});

interface HeaderContainerProps {
  height: number;
  leftPaneContentWidth: number;
  renderHeaderCell: (props: RenderHeaderCellProps) => React.ReactNode;
  leftPaneColumns: Item[];
  rightPaneColumns: Item[];
  scrollYObservable: Animated.Value;
  scrollXObservable: Animated.Value;
}

const HeaderContainer = memo(function HeaderContainer(
  props: HeaderContainerProps,
) {
  const {
    height,
    leftPaneContentWidth,
    leftPaneColumns,
    rightPaneColumns,
    renderHeaderCell,
    scrollYObservable,
    scrollXObservable,
  } = props;

  return (
    <Animated.View style={[styles.header, { height, top: scrollYObservable }]}>
      <Animated.View
        style={[styles.leftPaneWrapper, { left: scrollXObservable }]}
      >
        {leftPaneColumns.map((columnData) => {
          const { size: width, num: column } = columnData;

          return (
            <View key={column} style={[{ width }]}>
              {renderHeaderCell({ column })}
            </View>
          );
        })}
      </Animated.View>
      <View style={[styles.rightPaneWrapper, { left: leftPaneContentWidth }]}>
        {rightPaneColumns.map((columnData) => {
          const { size: width, num: column } = columnData;

          return (
            <View key={column} style={[{ width }]}>
              {renderHeaderCell({ column })}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPaneWrapper: {
    flexDirection: 'row',
    position: 'absolute',
  },
  rightPaneWrapper: {
    flexDirection: 'row',
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    position: 'absolute',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
  },
  cell: {
    position: 'absolute',
  },
  selected: {
    zIndex: 1,
  },
});
