import { getIndex, recycleItems, RecycleItem, getItems } from './grid.common';

describe('getIndex', () => {
  const items = getItems([100, 200, 100, 200, 100, 200]);
  const scrollViewSize = 400;

  test('left 0', () => {
    const result = getIndex({
      items,
      scrollValue: 0,
      scrollViewSize,
    });

    expect(result).toEqual({
      startIndex: 0,
      endIndex: 2,
    });
  });

  test('left 100', () => {
    const result = getIndex({
      items,
      scrollValue: 100,
      scrollViewSize,
    });

    expect(result).toEqual({
      startIndex: 1,
      endIndex: 3,
    });
  });

  test('left 350', () => {
    const result = getIndex({
      items,
      scrollValue: 350,
      scrollViewSize,
    });

    expect(result).toEqual({
      startIndex: 2,
      endIndex: 5,
    });
  });

  test('scroll rightmost', () => {
    const result = getIndex({
      items,
      scrollValue: 500,
      scrollViewSize,
    });

    expect(result).toEqual({
      startIndex: 3,
      endIndex: 5,
    });
  });
});

describe('recycleItems', () => {
  let prevItems: RecycleItem[] = [];
  const scrollViewSize = 400;
  const items = getItems([100, 200, 100, 200, 100, 200]);

  test('initial', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 0,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 100, offset: 0, num: 1, key: 0 },
      { size: 200, offset: 100, num: 2, key: 1 },
      { size: 100, offset: 300, num: 3, key: 2 },
    ]);

    prevItems = result;
  });

  test('scroll 100', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 100,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 200, offset: 100, num: 2, key: 1 },
      { size: 100, offset: 300, num: 3, key: 2 },
      { size: 200, offset: 400, num: 4, key: 0 },
    ]);

    prevItems = result;
  });

  test('scroll 350', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 350,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 100, offset: 300, num: 3, key: 2 },
      { size: 200, offset: 400, num: 4, key: 0 },
      { size: 100, offset: 600, num: 5, key: 1 },
      { size: 200, offset: 700, num: 6, key: 3 },
    ]);

    prevItems = result;
  });

  test('scroll rightmost', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 500,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 200, offset: 400, num: 4, key: 0 },
      { size: 100, offset: 600, num: 5, key: 1 },
      { size: 200, offset: 700, num: 6, key: 3 },
    ]);

    prevItems = result;
  });

  test('scroll back to 350', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 350,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 100, offset: 300, num: 3, key: 4 },
      { size: 200, offset: 400, num: 4, key: 0 },
      { size: 100, offset: 600, num: 5, key: 1 },
      { size: 200, offset: 700, num: 6, key: 3 },
    ]);

    prevItems = result;
  });

  test('scroll back to 100', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 100,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 200, offset: 100, num: 2, key: 1 },
      { size: 100, offset: 300, num: 3, key: 4 },
      { size: 200, offset: 400, num: 4, key: 0 },
    ]);

    prevItems = result;
  });

  test('scroll back to 0', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 0,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 100, offset: 0, num: 1, key: 0 },
      { size: 200, offset: 100, num: 2, key: 1 },
      { size: 100, offset: 300, num: 3, key: 4 },
    ]);

    prevItems = result;
  });

  test('scroll rightmost again', () => {
    const { startIndex, endIndex } = getIndex({
      items,
      scrollValue: 500,
      scrollViewSize,
    });

    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
    });

    expect(result).toEqual([
      { size: 200, offset: 400, num: 4, key: 0 },
      { size: 100, offset: 600, num: 5, key: 1 },
      { size: 200, offset: 700, num: 6, key: 4 },
    ]);
  });
});
