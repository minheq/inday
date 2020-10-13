import { getColumnsData, getRowsData, RowData } from './grid';

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

describe('getColumnsData', () => {
  test('left 0', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 0,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });

  test('left 100', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 100,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 1,
      endIndex: 3,
    });
  });

  test('left 350', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 350,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 2,
      endIndex: 5,
    });
  });

  test('scroll rightmost', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 500,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 3,
      endIndex: 5,
    });
  });

  test('left 0, overscan 2', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 0,
      scrollViewWidth,
      overscan: 2,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 4,
    });
  });

  test('left 100, overscan 2', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 100,
      scrollViewWidth,
      overscan: 2,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 5,
    });
  });

  test('left 350, overscan 2', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 350,
      scrollViewWidth,
      overscan: 2,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 5,
    });
  });

  test('scroll rightmost, overscan 2', () => {
    const columns = [100, 200, 100, 200, 100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 500,
      scrollViewWidth,
      overscan: 2,
    });

    expect(columnsData).toEqual({
      startIndex: 1,
      endIndex: 5,
    });
  });

  test('scrollview larger', () => {
    const columns = [100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 0,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 1,
    });
  });

  test('scrollview equal', () => {
    const columns = [100, 200, 100];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollX: 0,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });
});
