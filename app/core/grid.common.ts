import { useCallback, useMemo, useRef } from 'react';
import {
  differenceBy,
  intersectBy,
  isEmpty,
  maxBy,
  sum,
} from '../../lib/data_structures';
import { Cell, ContentOffset, FocusedCell } from './grid';

interface UseGridMeasurerProps {
  rowHeight: number;
  rowCount: number;
  columns: number[];
  fixedColumnCount: number;
}

interface GridMeasurerData {
  contentHeight: number;
  contentWidth: number;
  leftPaneColumns: Item[];
  leftPaneContentWidth: number;
  rightPaneColumns: Item[];
  rightPaneContentWidth: number;
  rows: Item[];
}

export function useGridMeasurer(props: UseGridMeasurerProps): GridMeasurerData {
  const { columns, fixedColumnCount, rowCount, rowHeight } = props;

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
  const leftPaneContentWidth = useMemo(() => sum(leftPaneColumnWidths), [
    leftPaneColumnWidths,
  ]);
  const rightPaneContentWidth = useMemo(() => sum(rightPaneColumnWidths), [
    rightPaneColumnWidths,
  ]);
  const contentHeight = rowCount * rowHeight;
  const contentWidth = leftPaneContentWidth + rightPaneContentWidth;

  const rows = useMemo(() => {
    const items: Item[] = [];
    for (let i = 0; i < rowCount; i++) {
      items.push({ num: i + 1, size: rowHeight, offset: i * rowHeight });
    }
    return items;
  }, [rowCount, rowHeight]);

  return {
    contentHeight,
    contentWidth,
    leftPaneColumns,
    leftPaneContentWidth,
    rightPaneColumns,
    rightPaneContentWidth,
    rows,
  };
}

export interface UseGridRecyclerProps {
  scrollViewHeight: number;
  scrollViewWidth: number;
  scrollX: number;
  scrollY: number;
  columns: Item[];
  rows: Item[];
}

interface GridRecyclerData {
  recycledRows: RecycledItem[];
  recycledColumns: RecycledItem[];
}

export function useGridRecycler(props: UseGridRecyclerProps): GridRecyclerData {
  const {
    columns,
    rows,
    scrollViewHeight,
    scrollViewWidth,
    scrollX,
    scrollY,
  } = props;

  const prevRecycledRowsRef = useRef<RecycledItem[]>([]);
  const prevRecycledColumnsRef = useRef<RecycledItem[]>([]);

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
    (): RecycledItem[] =>
      recycleItems({
        items: rows,
        prevItems: prevRecycledRowsRef.current,
        startIndex: rowStartIndex,
        endIndex: rowEndIndex,
      }),
    [rows, rowStartIndex, rowEndIndex],
  );

  const { startIndex: columnStartIndex, endIndex: columnEndIndex } = useMemo(
    () =>
      getIndex({
        items: columns,
        scrollOffset: scrollX,
        scrollViewSize: scrollViewWidth,
      }),
    [scrollX, scrollViewWidth, columns],
  );

  const recycledColumns = useMemo(
    (): RecycledItem[] =>
      recycleItems({
        items: columns,
        prevItems: prevRecycledColumnsRef.current,
        startIndex: columnStartIndex,
        endIndex: columnEndIndex,
      }),
    [columns, columnStartIndex, columnEndIndex],
  );

  prevRecycledRowsRef.current = recycledRows;
  prevRecycledColumnsRef.current = recycledColumns;

  return {
    recycledRows,
    recycledColumns,
  };
}

interface UseGetEnhancedRecycledRowsProps {
  focusedCell?: FocusedCell | null;
  selectedRows?: number[] | null;
  recycledRows: RecycledItem[];
}

export function useGetEnhancedRecycledRows(
  props: UseGetEnhancedRecycledRowsProps,
): RecycledRow[] {
  const { recycledRows, focusedCell, selectedRows } = props;

  const selectedRowsMap = useMemo(() => {
    const map: { [row: number]: boolean } = {};

    if (selectedRows === undefined || selectedRows === null) {
      return map;
    }

    for (let i = 0; i < selectedRows.length; i++) {
      const selectedRow = selectedRows[i];
      map[selectedRow] = true;
    }

    return map;
  }, [selectedRows]);

  return recycledRows.map((row) => ({
    key: row.key,
    size: row.size,
    offset: row.offset,
    num: row.num,
    selected: selectedRowsMap[row.num] || false,
    focusedCell: focusedCell?.row === row.num ? focusedCell : null,
  }));
}

interface UseGridGetScrollToCellOffsetProps {
  scrollViewHeight: number;
  scrollViewWidth: number;
  scrollX: number;
  scrollY: number;
  fixedColumnCount: number;
  columns: Item[];
  rows: Item[];
  padding?: number;
}

export function useGridGetScrollToCellOffset(
  props: UseGridGetScrollToCellOffsetProps,
): (cell: Partial<Cell>) => Partial<ContentOffset> {
  const {
    columns,
    rows,
    scrollViewHeight,
    scrollViewWidth,
    fixedColumnCount,
    scrollX,
    scrollY,
    padding = 40,
  } = props;

  const getScrollToRowOffset = useCallback(
    (row?: number) => {
      if (row === undefined) {
        return;
      }

      const offset = rows[row - 1].offset;
      const height = rows[row - 1].size;

      const above = scrollY >= offset;
      const below = offset + height >= scrollY + scrollViewHeight;

      if (above) {
        return Math.max(offset - padding, 0);
      } else if (below) {
        return offset + height - scrollViewHeight + padding;
      }
    },
    [rows, scrollY, scrollViewHeight, padding],
  );

  const getScrollToColumnOffset = useCallback(
    (column?: number) => {
      if (column === undefined) {
        return;
      }

      if (column <= fixedColumnCount) {
        return 0;
      }

      const offset = columns[column - 1 - fixedColumnCount].offset;
      const width = columns[column - 1 - fixedColumnCount].size;

      const left = scrollX >= offset;
      const right = offset + width >= scrollX + scrollViewWidth;

      if (left) {
        return Math.max(offset - padding, 0);
      } else if (right) {
        return offset + width - scrollViewWidth + padding;
      }
    },
    [scrollX, columns, fixedColumnCount, scrollViewWidth, padding],
  );

  const getScrollToCellOffset = useCallback(
    (cell: Partial<Cell>): Partial<ContentOffset> => {
      const { row, column } = cell;

      const y = getScrollToRowOffset(row);
      const x = getScrollToColumnOffset(column);

      return { y, x };
    },
    [getScrollToRowOffset, getScrollToColumnOffset],
  );

  return getScrollToCellOffset;
}

export interface Item {
  size: number;
  offset: number;
  num: number;
}

export interface RecycledItem extends Item {
  key: number;
}

export interface RecycledRow extends RecycledItem {
  focusedCell: FocusedCell | null;
  selected: boolean;
}

interface RecycleItemsParams {
  items: Item[];
  prevItems: RecycledItem[];
  startIndex: number;
  endIndex: number;
}

export function recycleItems(params: RecycleItemsParams): RecycledItem[] {
  const { items, startIndex, endIndex, prevItems } = params;

  const currentItems = items.slice(startIndex, endIndex + 1);

  if (isEmpty(prevItems)) {
    return currentItems.map((col, index) => ({ ...col, key: index }));
  }

  const reusedItems = intersectBy(prevItems, currentItems, 'num');
  const recycledItems = differenceBy(prevItems, currentItems, 'num');
  const newItems = differenceBy(currentItems, prevItems, 'num');

  const recycledKeys = recycledItems.map((c) => c.key);
  if (recycledKeys.length < newItems.length) {
    let maxKey = maxBy(prevItems, 'key');

    while (recycledKeys.length !== newItems.length) {
      recycledKeys.push(++maxKey);
    }
  }

  const nextItems = reusedItems
    .concat(newItems.map((c, i) => ({ ...c, key: recycledKeys[i] })))
    .sort((a, b) => a.num - b.num);

  return nextItems;
}

interface GetIndexParams {
  items: Item[];
  scrollOffset: number;
  scrollViewSize: number;
  overscan?: number;
}

export function getIndex(params: GetIndexParams) {
  const { items, scrollOffset, scrollViewSize, overscan = 0 } = params;

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

  startIndex = Math.max(startIndex - overscan, 0);
  endIndex = Math.min(endIndex + overscan, items.length - 1);

  return { startIndex, endIndex };
}

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

/**
 * Appendix A.
 *
 *      leftPane                       rightPane
 * -----------------------------------------------------------  <--------- scrollY
 *                  |            |              |             |       |
 * -----------------|-----------------------------------------|       |
 *                  |            |              |             |       |
 * -----------------|-----------------------------------------|       |
 *                  |            |              |             |       |
 * -----------------|-----------------------------------------|       |
 *                  |            |              |             | scrollViewHeight
 * -----------------|-----------------------------------------|       |
 *                  |            |              |             |       |
 * -----------------|-----------------------------------------|       |
 *                  |            |              |             |       |
 * ----------------------------------------------------------- <-------
 *                  ^                                         ^
 *                  |                                         |
 *                  |------------scrollViewWidth--------------|
 *                  |
 *           fixedColumnCount (1)
 *               scrollX
 */
