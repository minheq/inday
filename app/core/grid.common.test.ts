import {
  getVisibleIndexRange,
  getColumns,
  getRows,
  Group,
  Row,
} from './grid.common';

describe('getVisibleIndexRange', () => {
  const columns = getColumns([100, 200, 100, 200, 100, 200]);
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
        items: columns,
        scrollOffset,
        scrollViewSize,
        getItemOffset: (column) => column.x,
        getItemSize: (column) => column.width,
      });

      expect(result).toEqual([startIndex, endIndex]);
    },
  );
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

// describe('recycleItems', () => {
//   let prevRows: RecycledRow[] = [];
//   const scrollViewSize = 400;

//   const rows = getRows([100, 200, 100, 200, 100, 200]);

//   function expectRows(scrollOffset: number) {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 100, offset: 0, num: 1, key: 0 },
//       { size: 200, offset: 100, num: 2, key: 1 },
//       { size: 100, offset: 300, num: 3, key: 2 },
//     ]);

//     prevRows = result;
//   }

//   test('initial', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 0,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 100, offset: 0, num: 1, key: 0 },
//       { size: 200, offset: 100, num: 2, key: 1 },
//       { size: 100, offset: 300, num: 3, key: 2 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll 100', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 100,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 200, offset: 100, num: 2, key: 1 },
//       { size: 100, offset: 300, num: 3, key: 2 },
//       { size: 200, offset: 400, num: 4, key: 0 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll 350', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 350,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 100, offset: 300, num: 3, key: 2 },
//       { size: 200, offset: 400, num: 4, key: 0 },
//       { size: 100, offset: 600, num: 5, key: 1 },
//       { size: 200, offset: 700, num: 6, key: 3 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll rightmost', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 500,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 200, offset: 400, num: 4, key: 0 },
//       { size: 100, offset: 600, num: 5, key: 1 },
//       { size: 200, offset: 700, num: 6, key: 3 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll back to 350', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 350,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 100, offset: 300, num: 3, key: 4 },
//       { size: 200, offset: 400, num: 4, key: 0 },
//       { size: 100, offset: 600, num: 5, key: 1 },
//       { size: 200, offset: 700, num: 6, key: 3 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll back to 100', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 100,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 200, offset: 100, num: 2, key: 1 },
//       { size: 100, offset: 300, num: 3, key: 4 },
//       { size: 200, offset: 400, num: 4, key: 0 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll back to 0', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 0,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 100, offset: 0, num: 1, key: 0 },
//       { size: 200, offset: 100, num: 2, key: 1 },
//       { size: 100, offset: 300, num: 3, key: 4 },
//     ]);

//     prevRows = result;
//   });

//   test('scroll rightmost again', () => {
//     const { startIndex, endIndex } = getVisibleIndexRange({
//       items,
//       scrollOffset: 500,
//       scrollViewSize,
//     });

//     const result = recycleItems({
//       items,
//       prevRows,
//       startIndex,
//       endIndex,
//     });

//     expect(result).toEqual([
//       { size: 200, offset: 400, num: 4, key: 0 },
//       { size: 100, offset: 600, num: 5, key: 1 },
//       { size: 200, offset: 700, num: 6, key: 4 },
//     ]);
//   });
// });
