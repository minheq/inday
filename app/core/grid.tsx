import React, { useRef, useEffect, useState, memo } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { isEmpty, RecycleQueue } from '../../lib/data_structures';

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

const overscan = 0;

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

  const prevItemsRef = useRef<Item[]>([]);

  const items = getItems({
    scrollTop,
    scrollViewHeight,
    prevItems: prevItemsRef.current,
    rowHeight,
    rowsCount,
  });

  prevItemsRef.current = items;

  console.log('render grid');

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
            {items.map(({ key, top, row }) => (
              <Row
                columns={columns}
                frozen={true}
                frozenColumns={frozenColumns}
                renderCell={renderCell}
                key={key}
                top={top}
                row={row}
                height={rowHeight}
              />
            ))}
          </View>
          <View style={styles.scrollableCellsWrapper}>
            <Animated.ScrollView horizontal>
              <View
                style={[
                  styles.scrollableCellsContentWrapper,
                  { width: scrollableColumnsWidth },
                ]}
              >
                {items.map(({ key, top, row }) => (
                  <Row
                    columns={columns}
                    frozen={false}
                    frozenColumns={frozenColumns}
                    renderCell={renderCell}
                    key={key}
                    top={top}
                    row={row}
                    height={rowHeight}
                  />
                ))}
              </View>
            </Animated.ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export interface Item {
  row: number;
  key: number;
  top: number;
}

interface GetItemsParams {
  scrollViewHeight: number;
  rowHeight: number;
  rowsCount: number;
  scrollTop: number;
  prevItems: Item[];
}

export function getItems(params: GetItemsParams): Item[] {
  const {
    prevItems,
    scrollViewHeight,
    scrollTop,
    rowHeight,
    rowsCount,
  } = params;
  const startRow = Math.max(Math.floor(scrollTop / rowHeight) - overscan, 0);
  const endRow = Math.min(
    rowsCount - 1, // don't render past the end of the list
    Math.floor((scrollTop + scrollViewHeight) / rowHeight) + overscan,
  );

  const size = endRow - startRow + 15;
  const queue = new RecycleQueue(
    size,
    prevItems.map((i) => i.row),
  );

  if (isEmpty(prevItems)) {
    for (let row = startRow; row < endRow; row++) {
      queue.enqueue();
    }
  } else {
    const prevEndRow = Math.max(...prevItems.map((i) => i.row));
    const diff = endRow - prevEndRow;

    for (let i = 0; i < diff; i++) {
      queue.enqueue();
    }
  }

  return queue.items.map((row, key) => {
    return {
      key,
      row,
      top: row * rowHeight,
    };
  });
}

interface RowProps {
  frozen: boolean;
  height: number;
  frozenColumns: number;
  top: number;
  row: number;
  renderCell: (props: RenderCellProps) => React.ReactNode;
  columns: number[];
}

const Row = memo(function Row(props: RowProps) {
  const {
    frozen,
    frozenColumns,
    height,
    top,
    row,
    columns,
    renderCell,
  } = props;
  console.log('render row');

  return (
    <View style={[{ height, top }, styles.row]}>
      {(frozen
        ? columns.slice(0, frozenColumns)
        : columns.slice(frozenColumns)
      ).map((columnWidth, i) => {
        const column = frozen ? i : i + frozenColumns;

        return <Cell width={columnWidth}>{renderCell({ row, column })}</Cell>;
      })}
    </View>
  );
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
