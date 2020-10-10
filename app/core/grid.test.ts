import { getItems, Item } from './grid';

describe('getItems', () => {
  const scrollViewHeight = 1000;
  const rowHeight = 50;
  const rowsCount = 100;

  test('scroll downwards twice', () => {
    let scrollTop = 0;
    let prevItems: Item[] = [];
    // Load
    let items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    // console.log(items, 'before');

    // First scroll
    prevItems = items;
    scrollTop = 300;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    // console.log(items, 'after');

    // second scroll
    prevItems = items;
    scrollTop = 600;

    items = getItems({
      scrollViewHeight,
      rowHeight,
      rowsCount,
      scrollTop,
      prevItems,
    });

    // console.log(items, 'after');
  });
});
