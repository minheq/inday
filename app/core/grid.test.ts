import { getItems, Item, RecycleQueue } from './grid';

describe('RecycleQueue', () => {
  const queue = new RecycleQueue(5, 50);

  test('enqueue', () => {
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();

    expect(queue.items).toHaveLength(5);
    expect(queue.items[0].row).toBe(1);
    expect(queue.items[0].top).toBe(0);
    expect(queue.items[1].row).toBe(2);
    expect(queue.items[1].top).toBe(50);
    expect(queue.items[2].row).toBe(3);
    expect(queue.items[2].top).toBe(100);
    expect(queue.items[3].row).toBe(4);
    expect(queue.items[3].top).toBe(150);
    expect(queue.items[4].row).toBe(5);
    expect(queue.items[4].top).toBe(200);

    queue.enqueue();
    queue.enqueue();

    expect(queue.items).toHaveLength(5);
    expect(queue.items[0].row).toBe(6);
    expect(queue.items[0].top).toBe(250);
    expect(queue.items[1].row).toBe(7);
    expect(queue.items[1].top).toBe(300);
    expect(queue.items[2].row).toBe(3);
    expect(queue.items[2].top).toBe(100);
    expect(queue.items[3].row).toBe(4);
    expect(queue.items[3].top).toBe(150);
    expect(queue.items[4].row).toBe(5);
    expect(queue.items[4].top).toBe(200);

    expect(true).toBeTruthy();
  });

  test('dequeue', () => {
    queue.dequeue();
    expect(queue.items[0].row).toBe(6);
    expect(queue.items[0].top).toBe(250);
    expect(queue.items[1].row).toBe(2);
    expect(queue.items[1].top).toBe(50);
    expect(queue.items[2].row).toBe(3);
    expect(queue.items[2].top).toBe(100);
    expect(queue.items[3].row).toBe(4);
    expect(queue.items[3].top).toBe(150);
    expect(queue.items[4].row).toBe(5);
    expect(queue.items[4].top).toBe(200);

    queue.dequeue();
    expect(queue.items[0].row).toBe(1);
    expect(queue.items[0].top).toBe(0);
    expect(queue.items[1].row).toBe(2);
    expect(queue.items[1].top).toBe(50);
    expect(queue.items[2].row).toBe(3);
    expect(queue.items[2].top).toBe(100);
    expect(queue.items[3].row).toBe(4);
    expect(queue.items[3].top).toBe(150);
    expect(queue.items[4].row).toBe(5);
    expect(queue.items[4].top).toBe(200);
  });
});

describe.only('getItems', () => {
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
