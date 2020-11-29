import { test } from 'zora';

import {
  getVisibleIndexRange,
  getColumns,
  getRows,
  Group,
  Row,
  recycleItems,
  Column,
} from './grid.common';

test('getVisibleIndexRange', (t) => {
  const items = [
    { size: 100, offset: 0 },
    { size: 200, offset: 100 },
    { size: 100, offset: 300 },
    { size: 200, offset: 400 },
    { size: 100, offset: 600 },
    { size: 200, offset: 700 },
  ];

  const scrollViewSize = 400;

  const runs = [
    [0, 0, 2],
    [100, 1, 3],
    [350, 2, 5],
    [500, 3, 5],
  ];

  for (let i = 0; i < runs.length; i++) {
    const [scrollOffset, startIndex, endIndex] = runs[i];

    const result = getVisibleIndexRange({
      items,
      scrollOffset,
      scrollViewSize,
      getItemOffset: (column) => column.offset,
      getItemSize: (column) => column.size,
    });

    t.equals(result, [startIndex, endIndex]);
  }
});

interface Item {
  value: number;
}

interface RecycledItem {
  key: number;
  value: number;
}

test('recycleItems', (t) => {
  function run(items: Item[], prevItems: RecycledItem[]) {
    return recycleItems({
      items,
      prevItems,
      toRecycledItem: (item, key) => ({ value: item.value, key }),
      getValue: (item) => item.value,
      getKey: (item) => item.key,
    });
  }

  t.test('with empty previous items', (t) => {
    const items: Item[] = [{ value: 1 }, { value: 2 }, { value: 3 }];

    const expected: RecycledItem[] = [
      { value: 1, key: 0 },
      { value: 2, key: 1 },
      { value: 3, key: 2 },
    ];

    t.equal(run(items, []), expected);
  });

  t.test('with previous items, in middle', () => {
    const items: Item[] = [{ value: 2 }, { value: 3 }, { value: 4 }];

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

    t.equal(run(items, prevItems), expected);
  });

  t.test('with previous items, at the end', () => {
    const items: Item[] = [{ value: 3 }, { value: 4 }, { value: 5 }];

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

    t.equal(run(items, prevItems), expected);
  });

  t.test('with no matching prev items', () => {
    const items: Item[] = [{ value: 4 }, { value: 5 }];

    const prevItems: RecycledItem[] = [
      { value: 1, key: 1 },
      { value: 2, key: 2 },
      { value: 3, key: 3 },
    ];

    const expected: RecycledItem[] = [
      { value: 4, key: 1 },
      { value: 5, key: 2 },
    ];

    t.equal(run(items, prevItems), expected);
  });

  t.test('more than previous', () => {
    const items: Item[] = [{ value: 3 }, { value: 4 }, { value: 5 }];

    const prevItems: RecycledItem[] = [
      { value: 1, key: 1 },
      { value: 2, key: 2 },
    ];

    const expected: RecycledItem[] = [
      { value: 3, key: 1 },
      { value: 4, key: 2 },
      { value: 5, key: 3 },
    ];

    t.equal(run(items, prevItems), expected);
  });
});

test('getColumns', (t) => {
  const result = getColumns([100, 200, 100, 200, 100, 200]);
  const expected: Column[] = [
    { column: 1, width: 100, x: 0 },
    { column: 2, width: 200, x: 100 },
    { column: 3, width: 100, x: 300 },
    { column: 4, width: 200, x: 400 },
    { column: 5, width: 100, x: 600 },
    { column: 6, width: 200, x: 700 },
  ];
  t.equals(result, expected);
});

test('getRows', (t) => {
  t.test('single flat group', (t) => {
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

    t.equals(rows, expected);
  });

  t.test('nested with leaf rows', (t) => {
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

    t.equals(rows, expected);
  });

  t.test('nested with empty leaf rows', (t) => {
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

    t.equals(rows, expected);
  });

  t.test('nested with collapsed ancestor', (t) => {
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

    t.equals(rows, expected);
  });

  t.test('nested collapsed child', (t) => {
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

    t.equals(rows, expected);
  });
});
