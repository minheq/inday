import {
  getVisibleIndexRange,
  getColumns,
  getRows,
  Group,
  Row,
  recycleItems,
  Column,
} from './grid.common';

describe('getVisibleIndexRange', () => {
  const items = [
    { size: 100, offset: 0 },
    { size: 200, offset: 100 },
    { size: 100, offset: 300 },
    { size: 200, offset: 400 },
    { size: 100, offset: 600 },
    { size: 200, offset: 700 },
  ];

  const scrollViewSize = 400;

  test.concurrent.each([
    [0, 0, 2],
    [100, 1, 3],
    [350, 2, 5],
    [500, 3, 5],
  ])(
    'scrollOffset=%i, startIndex=%i, endIndex=%i',
    async (scrollOffset, startIndex, endIndex) => {
      const result = getVisibleIndexRange({
        items,
        scrollOffset,
        scrollViewSize,
        getItemOffset: (column) => column.offset,
        getItemSize: (column) => column.size,
      });

      expect(result).toEqual([startIndex, endIndex]);
    },
  );
});

interface Item {
  value: number;
}

interface RecycledItem {
  key: number;
  value: number;
}

describe('recycleItems', () => {
  function run(
    items: Item[],
    prevItems: RecycledItem[],
    startIndex: number,
    endIndex: number,
    expected: RecycledItem[],
  ) {
    const result = recycleItems({
      items,
      prevItems,
      startIndex,
      endIndex,
      toRecycledItem: (item, key) => ({ value: item.value, key }),
      getValue: (item) => item.value,
      getKey: (item) => item.key,
    });

    expect(result).toEqual(expected);
  }

  test.concurrent('fresh from start', async () => {
    const items: Item[] = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];

    const expected: RecycledItem[] = [
      { value: 1, key: 0 },
      { value: 2, key: 1 },
      { value: 3, key: 2 },
    ];

    run(items, [], 0, 2, expected);
  });

  test.concurrent('with previous items, in middle', async () => {
    const items: Item[] = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];

    const prevItems: RecycledItem[] = [
      { value: 1, key: 0 },
      { value: 2, key: 1 },
      { value: 3, key: 2 },
    ];

    const expected: RecycledItem[] = [
      { value: 2, key: 1 },
      { value: 3, key: 2 },
      { value: 4, key: 0 },
    ];

    run(items, prevItems, 1, 3, expected);
  });

  test.concurrent('with previous items, at the end', async () => {
    const items: Item[] = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];

    const prevItems: RecycledItem[] = [
      { value: 2, key: 1 },
      { value: 3, key: 2 },
      { value: 4, key: 0 },
    ];

    const expected: RecycledItem[] = [
      { value: 3, key: 2 },
      { value: 4, key: 0 },
      { value: 5, key: 1 },
    ];

    run(items, prevItems, 2, 4, expected);
  });

  test.concurrent('with no matching prev items', async () => {
    const items: Item[] = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];

    const prevItems: RecycledItem[] = [
      { value: 1, key: 1 },
      { value: 2, key: 2 },
      { value: 3, key: 3 },
    ];

    const expected: RecycledItem[] = [
      { value: 4, key: 1 },
      { value: 5, key: 2 },
    ];

    run(items, prevItems, 3, 4, expected);
  });

  test.concurrent('more than previous', async () => {
    const items: Item[] = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ];

    const prevItems: RecycledItem[] = [
      { value: 1, key: 1 },
      { value: 2, key: 2 },
    ];

    const expected: RecycledItem[] = [
      { value: 3, key: 1 },
      { value: 4, key: 2 },
      { value: 5, key: 3 },
    ];

    run(items, prevItems, 2, 4, expected);
  });
});

describe('getColumns', () => {
  test.concurrent('happy', async () => {
    const result = getColumns([100, 200, 100, 200, 100, 200]);
    const expected: Column[] = [
      { column: 1, width: 100, x: 0 },
      { column: 2, width: 200, x: 100 },
      { column: 3, width: 100, x: 300 },
      { column: 4, width: 200, x: 400 },
      { column: 5, width: 100, x: 600 },
      { column: 6, width: 200, x: 700 },
    ];
    expect(result).toEqual(expected);
  });
});

describe('getRows', () => {
  test.concurrent('single flat group', async () => {
    const groups: Group[] = [
      {
        type: 'leaf',
        collapsed: false,
        rowCount: 2,
      },
    ];

    const rows = getRows(groups, 0, 40, 72, [], 0);

    const expected: Row[] = [
      { type: 'group', height: 0, y: 0, path: [0], collapsed: false },
      { type: 'leaf', height: 40, y: 0, path: [0], row: 1 },
      { type: 'leaf', height: 40, y: 40, path: [0], row: 2 },
      { type: 'spacer', height: 72, y: 80 },
    ];

    expect(rows).toEqual(expected);
  });

  test.concurrent('nested with leaf rows', async () => {
    const groups: Group[] = [
      {
        type: 'ancestor',
        collapsed: false,
        children: [
          {
            type: 'leaf',
            collapsed: false,
            rowCount: 2,
          },
        ],
      },
      {
        type: 'ancestor',
        collapsed: false,
        children: [
          {
            type: 'leaf',
            collapsed: false,
            rowCount: 2,
          },
          {
            type: 'leaf',
            collapsed: false,
            rowCount: 2,
          },
        ],
      },
    ];

    const rows = getRows(groups, 56, 40, 72, [], 0);

    const expected: Row[] = [
      { type: 'group', height: 56, y: 0, path: [0], collapsed: false },
      { type: 'group', height: 56, y: 56, path: [0, 0], collapsed: false },
      { type: 'leaf', height: 40, y: 112, path: [0, 0], row: 1 },
      { type: 'leaf', height: 40, y: 152, path: [0, 0], row: 2 },
      { type: 'spacer', height: 72, y: 192 },
      { type: 'group', height: 56, y: 264, path: [1], collapsed: false },
      { type: 'group', height: 56, y: 320, path: [1, 0], collapsed: false },
      { type: 'leaf', height: 40, y: 376, path: [1, 0], row: 1 },
      { type: 'leaf', height: 40, y: 416, path: [1, 0], row: 2 },
      { type: 'group', height: 56, y: 456, path: [1, 1], collapsed: false },
      { type: 'leaf', height: 40, y: 512, path: [1, 1], row: 1 },
      { type: 'leaf', height: 40, y: 552, path: [1, 1], row: 2 },
      { type: 'spacer', height: 72, y: 592 },
    ];

    expect(rows).toEqual(expected);
  });

  test.concurrent('nested with empty leaf rows', async () => {
    const groups: Group[] = [
      {
        type: 'ancestor',
        collapsed: false,
        children: [
          {
            type: 'leaf',
            collapsed: false,
            rowCount: 0,
          },
        ],
      },
    ];

    const rows = getRows(groups, 56, 40, 72, [], 0);

    const expected: Row[] = [
      { type: 'group', height: 56, y: 0, path: [0], collapsed: false },
      { type: 'group', height: 56, y: 56, path: [0, 0], collapsed: false },
      { type: 'spacer', height: 72, y: 112 },
    ];

    expect(rows).toEqual(expected);
  });

  test.concurrent('nested with collapsed ancestor', async () => {
    const groups: Group[] = [
      {
        type: 'ancestor',
        collapsed: true,
        children: [
          {
            type: 'leaf',
            collapsed: false,
            rowCount: 1,
          },
        ],
      },
    ];

    const rows = getRows(groups, 56, 40, 72, [], 0);

    const expected: Row[] = [
      { type: 'group', height: 56, y: 0, path: [0], collapsed: true },
      { type: 'spacer', height: 72, y: 56 },
    ];

    expect(rows).toEqual(expected);
  });

  test.concurrent('nested collapsed child', async () => {
    const groups: Group[] = [
      {
        type: 'ancestor',
        collapsed: false,
        children: [
          {
            type: 'leaf',
            collapsed: true,
            rowCount: 5,
          },
        ],
      },
    ];

    const rows = getRows(groups, 56, 40, 72, [], 0);

    const expected: Row[] = [
      { type: 'group', height: 56, y: 0, path: [0], collapsed: false },
      { type: 'group', height: 56, y: 56, path: [0, 0], collapsed: true },
      { type: 'spacer', height: 72, y: 112 },
    ];

    expect(rows).toEqual(expected);
  });
});
