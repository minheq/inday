import { getColumnsData, getItems, Item } from './grid';

describe('getItems ', () => {
  const scrollViewHeight = 100;
  const rowHeight = 20;
  const rowsCount = 30;
  let scrollTop = 0;
  let prevItems: Item[] = [];
  let items: Item[] = [];

  function getRows(data: Item[]) {
    return data.map((item) => item.row);
  }

  test('initial', () => {
    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    expect(getRows(items)).toEqual([
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
    prevItems = items;
    scrollTop = 180;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    expect(getRows(items)).toEqual([
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
    prevItems = items;
    scrollTop = 500;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    expect(getRows(items)).toEqual([
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
    prevItems = items;
    scrollTop = 0;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    expect(getRows(items)).toEqual([
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
      scrollLeft: 0,
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
      scrollLeft: 100,
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
      scrollLeft: 350,
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
      scrollLeft: 500,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 3,
      endIndex: 5,
    });
  });

  test('scrollview larger', () => {
    const columns = [100, 200];
    const scrollViewWidth = 400;

    const columnsData = getColumnsData({
      columns,
      scrollLeft: 0,
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
      scrollLeft: 0,
      scrollViewWidth,
    });

    expect(columnsData).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });
});
