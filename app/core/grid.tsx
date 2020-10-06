import React, { useRef, useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

export interface GridProps {
  scrollViewHeight: number;
  renderCell: (row: number, column: number) => React.ReactElement | null;
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
    .reduce((val, col) => val + col, 0);

  const scrollableColumnsWidth = columns
    .slice(frozenColumns)
    .reduce((val, col) => val + col, 0);

  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(
    rowsCount - 1, // don't render past the end of the list
    Math.floor((scrollTop + scrollViewHeight) / rowHeight),
  );

  const frozenColumnsRows: React.ReactNode[] = [];
  const scrollableColumnsRows: React.ReactNode[] = [];

  for (let row = startIndex; row <= endIndex; row++) {
    const frozenColumnsCells: React.ReactNode[] = [];
    const scrollableColumnsCells: React.ReactNode[] = [];

    for (let col = 0; col < columns.length; col++) {
      const width = columns[col];

      if (col < frozenColumns) {
        const child = renderCell(row, col);
        if (child !== null) {
          frozenColumnsCells.push(
            <Cell key={`${row}-${col}`} width={width}>
              {child}
            </Cell>,
          );
        }
      } else {
        const child = renderCell(row, col);
        if (child !== null) {
          scrollableColumnsCells.push(
            <Cell key={`${row}-${col}`} width={width}>
              {child}
            </Cell>,
          );
        }
      }
    }

    frozenColumnsRows.push(
      <Row key={`${row}`} top={row * rowHeight} height={rowHeight}>
        {frozenColumnsCells}
      </Row>,
    );
    scrollableColumnsRows.push(
      <Row key={`${row}`} top={row * rowHeight} height={rowHeight}>
        {scrollableColumnsCells}
      </Row>,
    );
  }

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

interface RowProps {
  height: number;
  top: number;
  children: React.ReactNode;
}

function Row(props: RowProps) {
  const { height, top, children } = props;

  return <View style={[{ height, top }, styles.row]}>{children}</View>;
}

interface CellProps {
  width: number;
  children: React.ReactNode;
}

function Cell(props: CellProps) {
  const { width, children } = props;
  return <View style={[{ width }]}>{children}</View>;
}

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
