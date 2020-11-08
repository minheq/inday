import { getVisibleIndexRange, getColumns, Group } from './grid.common';

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
    async (scrollOffset, expectedStartIndex, expectedEndIndex) => {
      const result = getVisibleIndexRange({
        items: columns,
        scrollOffset,
        scrollViewSize,
        getItemOffset: (column) => column.x,
        getItemSize: (column) => column.width,
      });

      expect(result).toEqual({
        startIndex: expectedStartIndex,
        endIndex: expectedEndIndex,
      });
    },
  );
});

describe('getRows', () => {
  const groups: Group[] = [
    {
      collapsed: false,
      children: [
        {
          collapsed: false,
          rowCount: 0,
        },
      ],
    },
    {
      collapsed: true,
      children: [
        {
          collapsed: false,
          rowCount: 5,
        },
      ],
    },
    {
      type: 'ancestor',
      collapsed: false,
      children: [
        {
          type: 'leaf',
          collapsed: true,
          rowCount: 10,
        },
      ],
    },
  ];
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
