import React, { useRef, useEffect, useState, memo } from 'react';
import {
  Animated,
  PointPropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
  /** Used to manually set the starting scroll offset. The default value is {x: 0, y: 0} */
  contentOffset?: PointPropType;
}

export function Grid(props: GridProps) {
  const {
    columns,
    frozenColumns,
    rowsCount,
    rowHeight,
    scrollViewHeight,
    renderCell,
    contentOffset = { x: 0, y: 0 },
  } = props;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollTop, setScrollTop] = useState(contentOffset.y);
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
  });

  prevItemsRef.current = items;

  return (
    <View style={{ height: scrollViewHeight }}>
      <ScrollView
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
            <Animated.ScrollView contentOffset={contentOffset} horizontal>
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
  scrollTop: number;
  prevItems: Item[];
}

export function getItems(params: GetItemsParams): Item[] {
  const { prevItems, scrollViewHeight, scrollTop, rowHeight } = params;
  // size is the number of visible rows
  const size = Math.floor(scrollViewHeight / rowHeight);
  // sizeWithOverscan is the number of visible rows plus extraneous rows (here equal to the size)
  const sizeWithOverscan = size * 3;

  const queue = new RecycleQueue(
    sizeWithOverscan,
    prevItems.map((i) => i.row),
  );

  if (isEmpty(prevItems)) {
    for (let i = 0; i < sizeWithOverscan; i++) {
      queue.enqueue();
    }
  } else {
    const startRow = Math.floor(scrollTop / rowHeight) - size / 3;
    const prevStartRow = Math.min(...prevItems.map((i) => i.row));

    if (startRow > 0) {
      const diff = startRow - prevStartRow + 1;

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          queue.enqueue();
        }
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          queue.dequeue();
        }
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

  // console.log(items);

  return items;
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
  // console.log('render row');

  return (
    <View style={[{ height, top }, styles.row]}>
      {(frozen
        ? columns.slice(0, frozenColumns)
        : columns.slice(frozenColumns)
      ).map((columnWidth, i) => {
        const column = frozen ? i : i + frozenColumns;

        return (
          <Cell key={column} width={columnWidth}>
            {renderCell({ row, column })}
          </Cell>
        );
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
