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
  const prevItemsRef = useRef<Item[]>([]);
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

  const items = getItems({
    scrollTop,
    scrollViewHeight,
    prevItems: prevItemsRef.current,
    rowHeight,
    rowsCount,
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
 * TODO: Handle resizing
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
