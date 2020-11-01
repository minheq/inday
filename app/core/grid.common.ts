import { useMemo, useRef } from 'react';
import {
  differenceBy,
  intersectBy,
  isEmpty,
  maxBy,
  sum,
} from '../../lib/data_structures';
import { FocusedCell } from './grid';

export interface UseGridProps {
  // Passed from Props
  focusedCell?: FocusedCell | null;
  selectedRows?: number[] | null;
  scrollViewHeight: number;
  scrollViewWidth: number;
  rowHeight: number;
  rowCount: number;
  columns: number[];
  fixedColumnCount: number;

  // Passed from Grid
  scrollX: number;
  scrollY: number;
}

export function useGrid(props: UseGridProps) {
  const {
    focusedCell,
    selectedRows,
    columns,
    fixedColumnCount,
    rowCount,
    rowHeight,
    scrollViewHeight,
    scrollViewWidth,
    scrollX,
    scrollY,
  } = props;

  const prevRowsDataRef = useRef<RecycleItem[]>([]);
  const prevBodyRightPaneColumnsDataRef = useRef<RecycleItem[]>([]);

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
  const rows = useMemo(() => {
    const items: Item[] = [];
    for (let i = 0; i < rowCount; i++) {
      items.push({ num: i + 1, size: rowHeight, offset: i * rowHeight });
    }
    return items;
  }, [rowCount, rowHeight]);
  const leftPaneContentWidth = sum(leftPaneColumnWidths);
  const rightPaneContentWidth = sum(rightPaneColumnWidths);
  const rightPaneScrollViewWidth = scrollViewWidth - leftPaneContentWidth;
  const contentHeight = rowCount * rowHeight;
  const contentWidth = leftPaneContentWidth + rightPaneContentWidth;

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

  const { startIndex: rowStartIndex, endIndex: rowEndIndex } = useMemo(
    () =>
      getIndex({
        items: rows,
        scrollValue: scrollY,
        scrollViewSize: scrollViewHeight,
        overscan: 1,
      }),
    [rows, scrollY, scrollViewHeight],
  );

  const recycledRows = useMemo(
    () =>
      recycleItems({
        items: rows,
        prevItems: prevRowsDataRef.current,
        startIndex: rowStartIndex,
        endIndex: rowEndIndex,
      }),
    [rows, rowStartIndex, rowEndIndex],
  );

  const bodyLeftPaneColumns = useMemo(
    () =>
      recycleItems({
        items: leftPaneColumns,
        prevItems: [],
        startIndex: 0,
        endIndex: fixedColumnCount - 1,
      }),
    [leftPaneColumns, fixedColumnCount],
  );

  const {
    startIndex: rightPaneStartIndex,
    endIndex: rightPaneEndIndex,
  } = useMemo(
    () =>
      getIndex({
        items: rightPaneColumns,
        scrollValue: scrollX,
        scrollViewSize: rightPaneScrollViewWidth,
        overscan: 1,
      }),
    [scrollX, rightPaneScrollViewWidth, rightPaneColumns],
  );

  const bodyRightPaneColumns = useMemo(
    () =>
      recycleItems({
        items: rightPaneColumns,
        prevItems: prevBodyRightPaneColumnsDataRef.current,
        startIndex: rightPaneStartIndex,
        endIndex: rightPaneEndIndex,
      }),
    [rightPaneColumns, rightPaneStartIndex, rightPaneEndIndex],
  );

  prevRowsDataRef.current = recycledRows;
  prevBodyRightPaneColumnsDataRef.current = bodyRightPaneColumns;

  const effectiveRows = useMemo(() => {
    return recycledRows.map((row) => ({
      key: row.key,
      height: row.size,
      y: row.offset,
      row: row.num,
      selected: selectedRowsMap[row.num] || false,
      focusedCell: focusedCell?.row === row.num ? focusedCell : null,
    }));
  }, [recycledRows, selectedRowsMap, focusedCell]);

  return {
    rows: effectiveRows,
    contentWidth,
    contentHeight,
    leftPaneColumns,
    rightPaneColumns,
    bodyLeftPaneColumns,
    bodyRightPaneColumns,
    leftPaneContentWidth,
    rightPaneContentWidth,
  };
}

export interface Item {
  size: number;
  offset: number;
  num: number;
}

export interface RecycleItem extends Item {
  key: number;
}

interface RecycleItemsParams {
  items: Item[];
  prevItems: RecycleItem[];
  startIndex: number;
  endIndex: number;
}

export function recycleItems(params: RecycleItemsParams): RecycleItem[] {
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
  scrollValue: number;
  scrollViewSize: number;
  overscan?: number;
}

export function getIndex(params: GetIndexParams) {
  const { items, scrollValue, scrollViewSize, overscan = 0 } = params;

  let startIndex = 0;
  let endIndex = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.offset > scrollValue) {
      startIndex = i - 1;
      break;
    }
  }

  for (let i = startIndex; i < items.length; i++) {
    const item = items[i];

    if (item.offset + item.size >= scrollValue + scrollViewSize) {
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
