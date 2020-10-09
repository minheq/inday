import React, { useRef, useEffect, useState, memo } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { isEmpty } from '../../lib/data_structures';

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
  const queue = new RecycleQueue(size, rowHeight, prevItems);

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

  return queue.items;
}

export class RecycleQueue {
  items: Item[] = [];
  size: number;
  lastIndex: number = 0;
  rowHeight: number;

  constructor(size: number, rowHeight: number, items: Item[] = []) {
    this.size = size;
    this.rowHeight = rowHeight;
    this.items = items;

    if (isEmpty(items) === false) {
      let lastIndex = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.row > items[lastIndex].row) {
          lastIndex = i;
        }
      }

      this.lastIndex = lastIndex;
    }
  }

  enqueue() {
    if (isEmpty(this.items)) {
      this.items[0] = {
        key: 0,
        row: 1,
        top: 0,
      };
      this.lastIndex = 0;
      return;
    }

    const lastItem = this.items[this.lastIndex];
    const nextIndex = this.lastIndex + 1;
    const row = lastItem.row + 1;

    if (nextIndex > this.size - 1) {
      this.items[0] = {
        key: 0,
        row,
        top: (row - 1) * this.rowHeight,
      };
      this.lastIndex = 0;
    } else {
      this.items[nextIndex] = {
        key: nextIndex,
        row,
        top: (row - 1) * this.rowHeight,
      };
      this.lastIndex = nextIndex;
    }
  }

  dequeue() {
    if (isEmpty(this.items)) {
      throw new Error('Cannot dequeue from RecycleQueue because it is empty.');
    }

    const lastItem = this.items[this.lastIndex];

    this.items[this.lastIndex] = {
      key: lastItem.key,
      row: lastItem.row - this.size,
      top: (lastItem.row - this.size - 1) * this.rowHeight,
    };

    const prevIndex = this.lastIndex - 1;

    if (prevIndex < 0) {
      this.lastIndex = this.size - 1;
    } else {
      this.lastIndex = prevIndex;
    }
  }
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
