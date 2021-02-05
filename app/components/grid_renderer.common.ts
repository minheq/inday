import { useCallback, useMemo, useRef } from 'react';
import { intersectBy, differenceBy } from '../../lib/array_utils';
import { isEmpty, isEqual } from '../../lib/lang_utils';
import { sum, sumBy, maxBy, max, min } from '../../lib/math_utils';
import { FlatObject } from '../../lib/flat_object';

interface UseGridTransformerProps {
  groups: GridGroup[];
  leafRowHeight: number;
  groupRowHeight: number;
  spacerHeight: number;
  columns: number[];
  fixedColumnCount: number;
}

interface GridTransformerData {
  contentHeight: number;
  contentWidth: number;
  leftPaneColumns: GridColumn[];
  leftPaneContentWidth: number;
  rightPaneColumns: GridColumn[];
  rightPaneContentWidth: number;
  rows: GridRow[];
}

export interface Column {
  column: number;
}

export interface GridColumn extends Column {
  width: number;
  x: number;
}

export interface LeafRow {
  path: number[];
  row: number;
}

export interface GridLeafRow extends LeafRow {
  type: 'leaf';
  height: number;
  y: number;
  level: number;
  last: boolean;
}

export interface GroupRow {
  path: number[];
}

export interface GridGroupRow extends GroupRow {
  type: 'group';
  height: number;
  y: number;
  level: number;
  collapsed: boolean;
}

export interface GridSpacerRow {
  type: 'spacer';
  y: number;
  height: number;
}

export type GridRow = GridLeafRow | GridGroupRow | GridSpacerRow;

export function useGridTransformer(
  props: UseGridTransformerProps,
): GridTransformerData {
  const {
    columns,
    fixedColumnCount,
    groups,
    groupRowHeight,
    leafRowHeight,
    spacerHeight,
  } = props;

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
  const rows = useMemo(
    () => getRows(groups, groupRowHeight, leafRowHeight, spacerHeight, [], 0),
    [groups, groupRowHeight, leafRowHeight, spacerHeight],
  );
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

export interface LeafGridGroup {
  type: 'leaf';
  collapsed: boolean;
  rowCount: number;
}

export interface AncestorGridGroup {
  type: 'ancestor';
  collapsed: boolean;
  children: GridGroup[];
}

export type GridGroup = LeafGridGroup | AncestorGridGroup;

export function getRows(
  groups: GridGroup[],
  groupRowHeight: number,
  leafRowHeight: number,
  spacerHeight: number,
  prevPath: number[],
  prevOffset: number,
): GridRow[] {
  if (isEmpty(groups)) {
    return [];
  }

  let rows: GridRow[] = [];
  let offset = prevOffset;

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const { collapsed } = group;
    const path = [...prevPath, i];

    rows = rows.concat({
      type: 'group',
      height: groupRowHeight,
      y: offset,
      level: path.length,
      path,
      collapsed,
    });

    offset += groupRowHeight;

    if (collapsed === false) {
      if (isLeafGroup(group)) {
        const { rowCount } = group;
        const leafRows = getLeafRows(rowCount, leafRowHeight, path, offset);
        offset += getRowsHeight(leafRows);
        rows = rows.concat(leafRows);
      } else {
        const { children } = group;
        const groupRows = getRows(
          children,
          groupRowHeight,
          leafRowHeight,
          spacerHeight,
          path,
          offset,
        );
        offset += getRowsHeight(groupRows);
        rows = rows.concat(groupRows);
      }
    }

    if (path.length === 1) {
      rows = rows.concat({
        type: 'spacer',
        y: offset,
        height: spacerHeight,
      });
      offset += spacerHeight;
    }
  }

  return rows;
}

function getLeafRows(
  rowCount: number,
  leafRowHeight: number,
  path: number[],
  offset: number,
): GridLeafRow[] {
  const leafRows: GridLeafRow[] = [];

  for (let i = 0; i < rowCount; i++) {
    leafRows.push({
      type: 'leaf',
      height: leafRowHeight,
      y: offset + i * leafRowHeight,
      path,
      level: path.length,
      row: i + 1,
      last: i === rowCount - 1,
    });
  }

  return leafRows;
}

function isLeafGroup(group: GridGroup): group is LeafGridGroup {
  if (group.type === 'leaf') {
    return true;
  }

  return false;
}

export function getRowsHeight(rows: GridRow[]): number {
  return sumBy(rows, (row) => row.height);
}

export interface RecycledLeafRow extends GridLeafRow {
  key: number;
}

export interface RecycledGroupRow extends GridGroupRow {
  key: number;
}

export interface RecycledSpacerRow extends GridSpacerRow {
  key: number;
}

export type RecycledRow =
  | RecycledLeafRow
  | RecycledGroupRow
  | RecycledSpacerRow;

export interface RecycledColumn extends GridColumn {
  key: number;
}

export interface UseColumnsRecyclerProps {
  scrollViewWidth: number;
  scrollX: number;
  columns: GridColumn[];
}

export function useColumnsRecycler(
  props: UseColumnsRecyclerProps,
): RecycledColumn[] {
  const { columns, scrollViewWidth, scrollX } = props;

  const prevRecycledColumnsRef = useRef<RecycledColumn[]>([]);

  const [columnStartIndex, columnEndIndex] = useMemo(
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

  prevRecycledColumnsRef.current = recycledColumns;

  return recycledColumns;
}

interface RecycleItemsParams<T, K extends T> {
  items: T[];
  prevItems: K[];
  toRecycledItem: (item: T, key: number) => K;
  /** Value to recycle by */
  getValue: (item: T | K) => number;
  getKey: (item: K) => number;
}

export function recycleItems<T, K extends T>(
  params: RecycleItemsParams<T, K>,
): K[] {
  const { items, prevItems, getValue, toRecycledItem, getKey } = params;

  const reusedItems = intersectBy(prevItems, items, getValue, true);
  const recycledItems = differenceBy(prevItems, items, getValue);
  const newItems = differenceBy(items, prevItems, getValue);

  if (isEmpty(prevItems)) {
    return items.map((item, key) => toRecycledItem(item, key));
  }

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

export interface UseRowsRecyclerProps {
  scrollViewHeight: number;
  scrollY: number;
  rows: GridRow[];
}

export function useRowsRecycler(props: UseRowsRecyclerProps): RecycledRow[] {
  const { rows, scrollViewHeight, scrollY } = props;

  const prevRecycledRowsRef = useRef<RecycledRow[]>([]);

  const [rowStartIndex, rowEndIndex] = useMemo(
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

  prevRecycledRowsRef.current = recycledRows;

  return recycledRows;
}

interface RecycleRowsParams {
  rows: GridRow[];
  prevRows: RecycledRow[];
  startIndex: number;
  endIndex: number;
}

function recycleRows(params: RecycleRowsParams) {
  const { rows, prevRows, startIndex, endIndex } = params;

  const nextRows = rows.slice(startIndex, endIndex + 1);

  return recycleItems({
    items: nextRows,
    prevItems: prevRows,
    getValue: (row) => row.y,
    getKey: (row) => row.key,
    toRecycledItem: (row, key) => ({
      ...row,
      key,
    }),
  });
}

interface RecycleColumnsParams {
  columns: GridColumn[];
  prevColumns: RecycledColumn[];
  startIndex: number;
  endIndex: number;
}

function recycleColumns(params: RecycleColumnsParams) {
  const { columns, prevColumns, startIndex, endIndex } = params;

  const nextColumns = columns.slice(startIndex, endIndex + 1);

  return recycleItems({
    items: nextColumns,
    prevItems: prevColumns,
    getValue: (column) => column.column,
    getKey: (column) => column.key,
    toRecycledItem: (column, key) => ({
      ...column,
      key,
    }),
  });
}

interface GetVisibleIndexRangeParams<T> {
  items: T[];
  scrollOffset: number;
  scrollViewSize: number;
  getItemOffset: (item: T) => number;
  getItemSize: (item: T) => number;
  overscan?: number;
}

type VisibleIndexRange = [startIndex: number, endIndex: number];

export function getVisibleIndexRange<T>(
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

  startIndex = max(startIndex - overscan, 0);
  endIndex = min(endIndex + overscan, items.length - 1);

  return [startIndex, endIndex];
}

export function getColumns(columnWidths: number[], offset = 0): GridColumn[] {
  const result: GridColumn[] = [];

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
  columns: GridColumn[];
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
  rows: GridRow[];
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

interface UseGetStatefulRowsProps {
  rows: RecycledRow[];
  activeCell: StatefulLeafRowCell | null;
  selectedRows: LeafRow[] | null;
}

export type GroupRowState = 'hovered' | 'default';

interface StatefulGroupRow extends RecycledGroupRow {
  state: GroupRowState;
}

export interface GroupRowCell extends GroupRow, Column {}
export interface GridGroupRowCell extends GroupRowCell {
  type: 'group';
}
export type GroupRowCellState = 'editing' | 'hovered' | 'default';
export interface StatefulGroupRowCell extends GroupRowCell {
  state: GroupRowCellState;
}
export interface GridStatefulGroupRowCell extends StatefulGroupRowCell {
  type: 'group';
}

export type LeafRowState = 'selected' | 'hovered' | 'default';

interface StatefulLeafRow extends RecycledLeafRow {
  activeCell: StatefulLeafRowCell | null;
  state: LeafRowState;
}

export interface LeafRowCell extends LeafRow, Column {}
export type LeafRowCellState = 'focused' | 'editing' | 'hovered' | 'default';
export interface StatefulLeafRowCell extends LeafRowCell {
  state: LeafRowCellState;
}
export interface GridLeafRowCell extends LeafRowCell {
  type: 'leaf';
  last: boolean;
}
export interface GridStatefulLeafRowCell extends StatefulLeafRowCell {
  type: 'leaf';
}

export type StatefulRow =
  | StatefulLeafRow
  | StatefulGroupRow
  | RecycledSpacerRow;

export type GridCell = GridGroupRowCell | GridLeafRowCell;
export type StatefulCell = StatefulLeafRowCell | StatefulGroupRowCell;

export function useGetStatefulRows(
  props: UseGetStatefulRowsProps,
): StatefulRow[] {
  const { rows, activeCell, selectedRows } = props;

  const selectedRowsCache = useMemo(() => {
    const cache = FlatObject<boolean, number>();

    if (selectedRows === null || isEmpty(selectedRows)) {
      return cache;
    }

    for (let i = 0; i < selectedRows.length; i++) {
      const selectedRow = selectedRows[i];
      cache.set([...selectedRow.path, selectedRow.row], true);
    }

    return cache;
  }, [selectedRows]);

  return useMemo(() => {
    return rows.map((row) => {
      if (isSpacerRow(row)) {
        return {
          key: row.key,
          type: row.type,
          height: row.height,
          y: row.y,
        };
      }

      if (isLeafRow(row)) {
        const leafRowCell = getLeafRowCell(activeCell, row);

        return {
          key: row.key,
          type: row.type,
          height: row.height,
          path: row.path,
          row: row.row,
          last: row.last,
          level: row.level,
          y: row.y,
          state: getLeafRowState(leafRowCell, row, selectedRowsCache),
          activeCell: leafRowCell,
        };
      }

      return {
        key: row.key,
        type: row.type,
        height: row.height,
        y: row.y,
        path: row.path,
        level: row.level,
        state: 'default',
        collapsed: row.collapsed,
      };
    });
  }, [rows, activeCell, selectedRowsCache]);
}

function isLeafRow(row: GridRow): row is GridLeafRow {
  if (row.type === 'leaf') {
    return true;
  }

  return false;
}

function isSpacerRow(row: GridRow): row is GridSpacerRow {
  if (row.type === 'spacer') {
    return true;
  }

  return false;
}

function getLeafRowCell(
  activeCell: StatefulLeafRowCell | null,
  row: RecycledLeafRow,
): StatefulLeafRowCell | null {
  if (activeCell === null) {
    return null;
  }

  if (
    isEqual([...activeCell.path, activeCell.row], [...row.path, row.row]) ===
    false
  ) {
    return null;
  }

  return activeCell;
}

function getLeafRowState(
  activeCell: StatefulLeafRowCell | null,
  row: RecycledLeafRow,
  selectedRowsCache: FlatObject<boolean, number>,
): LeafRowState {
  if (activeCell !== null && activeCell.state === 'hovered') {
    return 'hovered';
  }

  const selected = selectedRowsCache.get([...row.path, row.row]);

  if (selected === true) {
    return 'selected';
  }

  return 'default';
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
  columns: GridColumn[];
  rows: GridRow[];
  padding?: number;
}

export function useGridGetScrollToCellOffset(
  props: UseGridGetScrollToCellOffsetProps,
): (cell: Partial<LeafRowCell>) => Partial<ContentOffset> {
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

  const leafRowsCache = useMemo(() => {
    const cache = FlatObject<GridLeafRow, number>();

    if (isEmpty(rows)) {
      return cache;
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (isLeafRow(row)) {
        cache.set([...row.path, row.row], row);
      }
    }

    return cache;
  }, [rows]);

  const getLeafRow = useCallback(
    (path?: number[], row?: number): GridLeafRow | undefined => {
      if (path !== undefined && row !== undefined) {
        return leafRowsCache.get([...path, row]);
      }

      if (
        (path === undefined && row !== undefined) ||
        (row === undefined && path !== undefined)
      ) {
        throw new Error(
          'getLeafRow required either both `path` and `row` to be present, or neither.',
        );
      }
    },
    [leafRowsCache],
  );

  const getScrollToRowOffset = useCallback(
    (row?: GridLeafRow) => {
      if (row === undefined) {
        return;
      }

      const { y, height } = row;

      const above = scrollY >= y;
      const below = y + height >= scrollY + scrollViewHeight;

      if (above) {
        return max(y - padding, 0);
      } else if (below) {
        return y + height - scrollViewHeight + padding;
      }
    },
    [scrollY, scrollViewHeight, padding],
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
        return max(x - padding, 0);
      } else if (right) {
        return x + width - scrollViewWidth + padding;
      }
    },
    [scrollX, columns, fixedColumnCount, scrollViewWidth, padding],
  );

  return useCallback(
    (cell: Partial<LeafRowCell>): Partial<ContentOffset> => {
      const { path, row, column } = cell;

      return {
        y: getScrollToRowOffset(getLeafRow(path, row)),
        x: getScrollToColumnOffset(column),
      };
    },
    [getScrollToRowOffset, getScrollToColumnOffset, getLeafRow],
  );
}
