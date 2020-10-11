import { getItems, Item } from './grid';

describe('getItems', () => {
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

    expect(getRows(items)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('scroll 50', () => {
    // First scroll
    prevItems = items;
    scrollTop = 50;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    expect(getRows(items)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  test('scroll 100', () => {
    // First scroll
    prevItems = items;
    scrollTop = 100;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    expect(getRows(items)).toEqual([11, 12, 13, 4, 5, 6, 7, 8, 9, 10]);
  });
});
