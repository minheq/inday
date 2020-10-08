import React, { useRef, useEffect, useState, memo } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

export interface RenderCellProps {
  row: number;
  column: number;
}

export interface GridProps {
  scrollViewHeight: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  rowHeight: number;
  rowsCount: number;
  /** Length of the array determines number of columns. Array values correspond to their width. */
  columns: number[];
  frozenColumns: number;
}

export function Grid(props: GridProps) {
  const {
    columns,
    frozenColumns,
    rowsCount,
    rowHeight,
    scrollViewHeight,
    renderCell,
  } = props;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollTop, setScrollTop] = useState(0);
  const contentHeight = rowsCount * rowHeight;

  useEffect(() => {
    const listenerID = scrollY.addListener((position) => {
      setScrollTop(position.value);
    });

    return () => {
      scrollY.removeListener(listenerID);
    };
  }, [scrollY]);

  const frozenColumnsWidth = columns
    .slice(0, frozenColumns)
    .reduce((val, column) => val + column, 0);

  const scrollableColumnsWidth = columns
    .slice(frozenColumns)
    .reduce((val, column) => val + column, 0);

  const frozenColumnsRows: React.ReactNode[] = [];
  const scrollableColumnsRows: React.ReactNode[] = [];

  const items = useRecycle({
    rowsCount,
    scrollTop,
    scrollViewHeight,
    rowHeight,
    overscan: 10,
  });

  items.forEach(({ row, rowKey, top }) => {
    const frozenColumnsCells: React.ReactNode[] = [];
    const scrollableColumnsCells: React.ReactNode[] = [];

    for (let column = 0; column < columns.length; column++) {
      const width = columns[column];

      if (column < frozenColumns) {
        const child = renderCell({ row, column });
        if (child !== null) {
          frozenColumnsCells.push(
            <Cell key={column} width={width}>
              {child}
            </Cell>,
          );
        }
      } else {
        const child = renderCell({ row, column });
        if (child !== null) {
          scrollableColumnsCells.push(
            <Cell key={column} width={width}>
              {child}
            </Cell>,
          );
        }
      }
    }

    frozenColumnsRows.push(
      <Row key={rowKey} top={top} height={rowHeight}>
        {frozenColumnsCells}
      </Row>,
    );
    scrollableColumnsRows.push(
      <Row key={rowKey} top={top} height={rowHeight}>
        {scrollableColumnsCells}
      </Row>,
    );
  });

  // console.log('render grid');

  return (
    <View style={{ height: scrollViewHeight }}>
      <ScrollView
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
            {frozenColumnsRows}
          </View>
          <View style={styles.scrollableCellsWrapper}>
            <Animated.ScrollView horizontal>
              <View
                style={[
                  styles.scrollableCellsContentWrapper,
                  { width: scrollableColumnsWidth },
                ]}
              >
                {scrollableColumnsRows}
              </View>
            </Animated.ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface Item {
  row: number;
  rowKey: number;
  top: number;
}

interface RecycleParams {
  rowHeight: number;
  rowsCount: number;
  scrollTop: number;
  scrollViewHeight: number;
  overscan: number;
}

function useRecycle(params: RecycleParams): Item[] {
  const {
    rowsCount,
    scrollTop,
    scrollViewHeight,
    rowHeight,
    overscan,
  } = params;

  const startIndex = Math.max(Math.floor(scrollTop / rowHeight) - overscan, 0);
  const endIndex = Math.min(
    rowsCount - 1, // don't render past the end of the list
    Math.floor((scrollTop + scrollViewHeight) / rowHeight) + overscan,
  );

  const items: Item[] = [];

  let rowKey = 0;

  for (let row = startIndex; row <= endIndex; row++) {
    items.push({
      row,
      rowKey,
      top: row * rowHeight,
    });

    rowKey++;
  }

  return items;
}

interface RowProps {
  height: number;
  top: number;
  children: React.ReactNode;
}

const Row = memo(function Row(props: RowProps) {
  const { height, top, children } = props;

  return <View style={[{ height, top }, styles.row]}>{children}</View>;
});

interface CellProps {
  width: number;
  children: React.ReactNode;
}

const Cell = memo(function Cell(props: CellProps) {
  const { width, children } = props;

  return <View style={[{ width }]}>{children}</View>;
});

const styles = StyleSheet.create({
  section: {
    zIndex: 10,
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
});
