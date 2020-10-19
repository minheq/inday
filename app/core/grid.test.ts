import {
  getRowsData,
  RowData,
  getIndex,
  getColumns,
  ColumnData,
  recycleItems,
} from './grid';

describe('getRowsData ', () => {
  const scrollViewHeight = 100;
  const rowHeight = 20;
  const rowCount = 30;
  let scrollY = 0;
  let prevRowsData: RowData[] = [];
  let rowsData: RowData[] = [];

  function getRowsDataKeys(data: RowData[]) {
    return data.map((item) => item.row);
  }

  test('initial', () => {
    rowsData = getRowsData({
      scrollViewHeight,
      rowHeight,
      rowCount,
      scrollY,
      prevRowsData,
    });

    expect(getRowsDataKeys(rowsData)).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
    ]);
  });

  test('scroll to start row 10', () => {
    // First scroll
    prevRowsData = rowsData;
    scrollY = 180;

    rowsData = getRowsData({
      scrollViewHeight,
      rowHeight,
      rowCount,
      scrollY,
      prevRowsData,
    });

    expect(getRowsDataKeys(rowsData)).toEqual([
      16,
      17,
      18,
      19,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
    ]);
  });

  test('scroll to bottom', () => {
    // First scroll
    prevRowsData = rowsData;
    scrollY = 500;

    rowsData = getRowsData({
      scrollViewHeight,
      rowHeight,
      rowCount,
      scrollY,
      prevRowsData,
    });

    expect(getRowsDataKeys(rowsData)).toEqual([
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
    ]);
  });

  test('scroll to top', () => {
    // First scroll
    prevRowsData = rowsData;
    scrollY = 0;

    rowsData = getRowsData({
      scrollViewHeight,
      rowHeight,
      rowCount,
      scrollY,
      prevRowsData,
    });

    expect(getRowsDataKeys(rowsData)).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
    ]);
  });
});

describe('getIndex', () => {
  test('left 0', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const result = getIndex({
      columns: getColumns(columns),
      scrollX: 0,
      scrollViewWidth,
    });

    expect(result).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });

  test('left 100', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const result = getIndex({
      columns: getColumns(columns),
      scrollX: 100,
      scrollViewWidth,
    });

    expect(result).toEqual({
      startIndex: 1,
      endIndex: 3,
    });
  });

  test('left 350', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const result = getIndex({
      columns: getColumns(columns),
      scrollX: 350,
      scrollViewWidth,
    });

    expect(result).toEqual({
      startIndex: 2,
      endIndex: 5,
    });
  });

  test('scroll rightmost', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const result = getIndex({
      columns: getColumns(columns),
      scrollX: 500,
      scrollViewWidth,
    });

    expect(result).toEqual({
      startIndex: 3,
      endIndex: 5,
    });
  });

  test('scrollview larger', () => {
    const columns = [100, 200];
    const scrollViewWidth = 400;

    const result = getIndex({
      columns: getColumns(columns),
      scrollX: 0,
      scrollViewWidth,
    });

    expect(result).toEqual({
      startIndex: 0,
      endIndex: 1,
    });
  });

  test('scrollview equal', () => {
    const columns = [100, 200, 100];
    const scrollViewWidth = 400;

    const result = getIndex({
      columns: getColumns(columns),
      scrollX: 0,
      scrollViewWidth,
    });

    expect(result).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });
});

describe.only('recycleItems', () => {
  let prevColumns: ColumnData[] = [];
  const scrollViewWidth = 400;
  const columns = getColumns([100, 200, 100, 200, 100, 200]);

  test('initial', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 0,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 100, x: 0, column: 1, key: 0 },
      { width: 200, x: 100, column: 2, key: 1 },
      { width: 100, x: 300, column: 3, key: 2 },
    ]);

    prevColumns = result;
  });

  test('scroll 100', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 100,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 200, x: 100, column: 2, key: 1 },
      { width: 100, x: 300, column: 3, key: 2 },
      { width: 200, x: 400, column: 4, key: 0 },
    ]);

    prevColumns = result;
  });

  test('scroll 350', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 350,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 100, x: 300, column: 3, key: 2 },
      { width: 200, x: 400, column: 4, key: 0 },
      { width: 100, x: 600, column: 5, key: 1 },
      { width: 200, x: 700, column: 6, key: 3 },
    ]);

    prevColumns = result;
  });

  test('scroll rightmost', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 500,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 200, x: 400, column: 4, key: 0 },
      { width: 100, x: 600, column: 5, key: 1 },
      { width: 200, x: 700, column: 6, key: 3 },
    ]);

    prevColumns = result;
  });

  test('scroll back to 350', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 350,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 100, x: 300, column: 3, key: 4 },
      { width: 200, x: 400, column: 4, key: 0 },
      { width: 100, x: 600, column: 5, key: 1 },
      { width: 200, x: 700, column: 6, key: 3 },
    ]);

    prevColumns = result;
  });

  test('scroll back to 100', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 100,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 200, x: 100, column: 2, key: 1 },
      { width: 100, x: 300, column: 3, key: 4 },
      { width: 200, x: 400, column: 4, key: 0 },
    ]);

    prevColumns = result;
  });

  test('scroll back to 0', () => {
    const { startIndex, endIndex } = getIndex({
      columns,
      scrollX: 0,
      scrollViewWidth,
    });

    const result = recycleItems({
      columns,
      prevColumns,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { width: 100, x: 0, column: 1, key: 0 },
      { width: 200, x: 100, column: 2, key: 1 },
      { width: 100, x: 300, column: 3, key: 4 },
    ]);
  });
});
