import { useCallback, useMemo, useRef } from 'react';
import {
  differenceBy,
  intersectBy,
  isEmpty,
  maxBy,
  sum,
  sumBy,
} from '../../lib/data_structures';

interface UseGridTransformerProps {
  groups: Group[];
  rowHeight: number;
  groupHeight: number;
  columns: number[];
  fixedColumnCount: number;
}

interface GridTransformerData {
  contentHeight: number;
  contentWidth: number;
  leftPaneColumns: Column[];
  leftPaneContentWidth: number;
  rightPaneColumns: Column[];
  rightPaneContentWidth: number;
  rows: Row[];
}

export function useGridTransformer(
  props: UseGridTransformerProps,
): GridTransformerData {
  const { columns, fixedColumnCount, groups, groupHeight, rowHeight } = props;

  const leftPaneColumnWidths = useMemo(
    () => columns.slice(0, fixedColumnCount),
    [columns, fixedColumnCount],
  );
  const rightPaneColumnWidths = useMemo(() => columns.slice(fixedColumnCount), [
    columns,
    fixedColumnCount,
  ]);
  const leftPaneContentWidth = useMemo(() => sum(leftPaneColumnWidths), [
    leftPaneColumnWidths,
  ]);
  const rightPaneContentWidth = useMemo(() => sum(rightPaneColumnWidths), [
    rightPaneColumnWidths,
  ]);
  const leftPaneColumns = useMemo(() => getColumns(leftPaneColumnWidths), [
    leftPaneColumnWidths,
  ]);
  const rightPaneColumns = useMemo(
    () => getColumns(rightPaneColumnWidths, fixedColumnCount),
    [rightPaneColumnWidths, fixedColumnCount],
  );
  const rows = useMemo(() => getRows(groups, groupHeight, rowHeight, [], 0), [
    groups,
    groupHeight,
    rowHeight,
  ]);
  const contentHeight = useMemo(() => getRowsHeight(rows), [rows]);
  const contentWidth = leftPaneContentWidth + rightPaneContentWidth;

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
  columns: Column[];
  rows: Row[];
}

interface GridRecyclerData {
  recycledRows: RecycledRow[];
  recycledColumns: RecycledColumn[];
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

  const prevRecycledRowsRef = useRef<RecycledRow[]>([]);
  const prevRecycledColumnsRef = useRef<RecycledColumn[]>([]);

  const { startIndex: rowStartIndex, endIndex: rowEndIndex } = useMemo(
    () =>
      getVisibleRowsIndexRange({
        rows,
        scrollY,
        scrollViewHeight,
      }),
    [rows, scrollY, scrollViewHeight],
  );

  const recycledRows = useMemo(
    (): RecycledRow[] =>
      recycleRows({
        rows,
        prevRows: prevRecycledRowsRef.current,
        startIndex: rowStartIndex,
        endIndex: rowEndIndex,
      }),
    [rows, rowStartIndex, rowEndIndex],
  );

  const { startIndex: columnStartIndex, endIndex: columnEndIndex } = useMemo(
    () =>
      getVisibleColumnsIndexRange({
        columns,
        scrollX,
        scrollViewWidth,
      }),
    [scrollX, scrollViewWidth, columns],
  );

  const recycledColumns = useMemo(
    (): RecycledColumn[] =>
      recycleColumns({
        columns,
        prevColumns: prevRecycledColumnsRef.current,
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

export interface Cell {
  row: number;
  column: number;
}

export interface ContentOffset {
  x: number;
  y: number;
}

interface UseGridGetScrollToCellOffsetProps {
  scrollViewHeight: number;
  scrollViewWidth: number;
  scrollX: number;
  scrollY: number;
  fixedColumnCount: number;
  columns: Column[];
  rows: Row[];
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

      const { y, height } = rows[row - 1];

      const above = scrollY >= y;
      const below = y + height >= scrollY + scrollViewHeight;

      if (above) {
        return Math.max(y - padding, 0);
      } else if (below) {
        return y + height - scrollViewHeight + padding;
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

      const { x, width } = columns[column - 1 - fixedColumnCount];

      const left = scrollX >= x;
      const right = x + width >= scrollX + scrollViewWidth;

      if (left) {
        return Math.max(x - padding, 0);
      } else if (right) {
        return x + width - scrollViewWidth + padding;
      }
    },
    [scrollX, columns, fixedColumnCount, scrollViewWidth, padding],
  );

  return useCallback(
    (cell: Partial<Cell>): Partial<ContentOffset> => {
      const { row, column } = cell;

      return {
        y: getScrollToRowOffset(row),
        x: getScrollToColumnOffset(column),
      };
    },
    [getScrollToRowOffset, getScrollToColumnOffset],
  );
}

interface RecycleItemsParams<T extends object, K extends T> {
  items: T[];
  prevItems: K[];
  startIndex: number;
  endIndex: number;
  toRecycledItem: (item: T, key: number) => K;
  /** Value to recycle by */
  getValue: (item: T | K) => number;
  getKey: (item: K) => number;
}

export function recycleItems<T extends object, K extends T>(
  params: RecycleItemsParams<T, K>,
): K[] {
  const {
    items,
    startIndex,
    endIndex,
    prevItems,
    getValue,
    toRecycledItem,
    getKey,
  } = params;

  const currentItems = items.slice(startIndex, endIndex + 1);

  if (isEmpty(prevItems)) {
    return currentItems.map((item, index) => toRecycledItem(item, index));
  }

  const reusedItems = intersectBy(prevItems, currentItems, getValue);
  const recycledItems = differenceBy(prevItems, currentItems, getValue);
  const newItems = differenceBy(currentItems, prevItems, getValue);

  const recycledKeys = recycledItems.map((c) => getKey(c));
  if (recycledKeys.length < newItems.length) {
    let maxKey = maxBy(prevItems, getKey);

    while (recycledKeys.length !== newItems.length) {
      recycledKeys.push(++maxKey);
    }
  }

  return reusedItems
    .concat(newItems.map((item, i) => toRecycledItem(item, recycledKeys[i])))
    .sort((a, b) => getValue(a) - getValue(b));
}

interface RecycleRowsParams {
  rows: Row[];
  prevRows: RecycledRow[];
  startIndex: number;
  endIndex: number;
}

function recycleRows(params: RecycleRowsParams) {
  const { rows, prevRows, startIndex, endIndex } = params;

  return recycleItems({
    items: rows,
    prevItems: prevRows,
    startIndex,
    endIndex,
    getValue: (row) => row.y,
    getKey: (row) => row.key,
    toRecycledItem: (row, key) => ({
      ...row,
      key,
    }),
  });
}

interface RecycleColumnsParams {
  columns: Column[];
  prevColumns: RecycledColumn[];
  startIndex: number;
  endIndex: number;
}

function recycleColumns(params: RecycleColumnsParams) {
  const { columns, prevColumns, startIndex, endIndex } = params;

  return recycleItems({
    items: columns,
    prevItems: prevColumns,
    startIndex,
    endIndex,
    getValue: (column) => column.column,
    getKey: (column) => column.key,
    toRecycledItem: (column, key) => ({
      ...column,
      key,
    }),
  });
}

interface GetVisibleIndexRangeParams<T = any> {
  items: T[];
  scrollOffset: number;
  scrollViewSize: number;
  getItemOffset: (item: T) => number;
  getItemSize: (item: T) => number;
  overscan?: number;
}

export interface VisibleIndexRange {
  startIndex: number;
  endIndex: number;
}

export function getVisibleIndexRange<T = any>(
  params: GetVisibleIndexRangeParams<T>,
): VisibleIndexRange {
  const {
    items,
    scrollOffset,
    scrollViewSize,
    getItemOffset,
    getItemSize,
    overscan = 0,
  } = params;

  let startIndex = 0;
  let endIndex = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (getItemOffset(item) > scrollOffset) {
      startIndex = i - 1;
      break;
    }
  }

  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];

    if (
      getItemOffset(item) + getItemSize(item) >=
      scrollOffset + scrollViewSize
    ) {
      endIndex = i;
      break;
    }
  }

  // ScrollView is larger than occupied items
  if (endIndex === 0) {
    endIndex = items.length - 1;
  }

  startIndex = Math.max(startIndex - overscan, 0);
  endIndex = Math.min(endIndex + overscan, items.length - 1);

  return { startIndex, endIndex };
}

export function getColumns(columnWidths: number[], offset: number = 0) {
  const result: Column[] = [];

  for (let i = 0; i < columnWidths.length; i++) {
    const width = columnWidths[i];
    const prevColumn = result[i - 1];

    if (prevColumn === undefined) {
      result.push({ width, x: 0, column: 1 + offset });
    } else {
      result.push({
        width,
        x: prevColumn.x + prevColumn.width,
        column: i + 1 + offset,
      });
    }
  }

  return result;
}

interface GetVisibleColumnsIndexRangeParams {
  columns: Column[];
  scrollX: number;
  scrollViewWidth: number;
}

function getVisibleColumnsIndexRange(
  params: GetVisibleColumnsIndexRangeParams,
): VisibleIndexRange {
  const { columns, scrollX, scrollViewWidth } = params;

  return getVisibleIndexRange({
    items: columns,
    getItemOffset: (column) => column.x,
    getItemSize: (column) => column.width,
    scrollOffset: scrollX,
    scrollViewSize: scrollViewWidth,
  });
}

interface GetVisibleRowsIndexRangeParams {
  rows: Row[];
  scrollY: number;
  scrollViewHeight: number;
}

function getVisibleRowsIndexRange(
  params: GetVisibleRowsIndexRangeParams,
): VisibleIndexRange {
  const { rows, scrollY, scrollViewHeight } = params;

  return getVisibleIndexRange({
    items: rows,
    getItemOffset: (column) => column.y,
    getItemSize: (column) => column.height,
    scrollOffset: scrollY,
    scrollViewSize: scrollViewHeight,
  });
}

export interface LeafGroup {
  type: 'leaf';
  collapsed: boolean;
  rowCount: number;
}

export interface AncestorGroup {
  type: 'ancestor';
  collapsed: boolean;
  children: Group[];
}

export type Group = LeafGroup | AncestorGroup;

export function getRows(
  groups: Group[],
  groupHeight: number,
  rowHeight: number,
  prevPath: number[],
  prevOffset: number,
): Row[] {
  if (isEmpty(groups)) {
    return [];
  }

  let rows: Row[] = [];
  let offset = prevOffset;

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const { collapsed } = group;
    const path = [...prevPath, i];

    rows = rows.concat({
      type: 'group',
      height: groupHeight,
      y: offset,
      path,
      collapsed,
    });

    offset += groupHeight;

    if (collapsed === true) {
      continue;
    }

    if (isLeafGroup(group)) {
      const { rowCount } = group;
      const leafRows = getLeafRows(rowCount, rowHeight, path, offset);
      offset += getRowsHeight(leafRows);
      rows = rows.concat(leafRows);
    } else {
      const { children } = group;
      const groupRows = getRows(children, groupHeight, rowHeight, path, offset);
      offset += getRowsHeight(groupRows);
      rows = rows.concat(groupRows);
    }
  }

  return rows;
}

function getLeafRows(
  rowCount: number,
  rowHeight: number,
  path: number[],
  offset: number,
): LeafRow[] {
  const leafRows: LeafRow[] = [];

  for (let i = 0; i < rowCount; i++) {
    leafRows.push({
      type: 'leaf',
      height: rowHeight,
      y: offset + i * rowHeight,
      path,
      row: i + 1,
    });
  }

  return leafRows;
}

function isLeafGroup(group: Group): group is LeafGroup {
  if (group.type === 'leaf') {
    return true;
  }

  return false;
}

export function getRowsHeight(rows: Row[]): number {
  return sumBy(rows, (row) => row.height);
}

export interface Column {
  width: number;
  x: number;
  column: number;
}

export interface RecycledColumn extends Column {
  key: number;
}

export interface LeafRow {
  type: 'leaf';
  height: number;
  y: number;
  path: number[];
  row: number;
}

export interface GroupRow {
  type: 'group';
  height: number;
  y: number;
  path: number[];
  collapsed: boolean;
}

export interface RecycledLeafRow extends LeafRow {
  key: number;
}

export interface RecycledGroupRow extends GroupRow {
  key: number;
}

export type Row = LeafRow | GroupRow;
export type RecycledRow = RecycledLeafRow | RecycledGroupRow;

// interface UseGetStatefulRowsProps {
//   focusedCell?: FocusedCell | null;
//   selectedRows?: number[] | null;
//   recycledRows: RecycledItem[];
// }

// export function useGetStatefulRows(
//   props: UseGetStatefulRowsProps,
// ): RecycledRow[] {
//   const { recycledRows, focusedCell, selectedRows } = props;

//   const selectedRowsMap = useMemo(() => {
//     const map: { [row: number]: boolean } = {};

//     if (selectedRows === undefined || selectedRows === null) {
//       return map;
//     }

//     for (let i = 0; i < selectedRows.length; i++) {
//       const selectedRow = selectedRows[i];
//       map[selectedRow] = true;
//     }

//     return map;
//   }, [selectedRows]);

//   return recycledRows.map((row) => ({
//     key: row.key,
//     size: row.size,
//     offset: row.offset,
//     selected: selectedRowsMap[row.num] || false,
//     focusedCell: focusedCell?.row === row.num ? focusedCell : null,
//   }));
// }
