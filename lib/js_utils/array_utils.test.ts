import { intersectBy, differenceBy } from './array_utils';

describe('intersectBy', () => {
  test('success', () => {
    const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
    const result = intersectBy(a, b, (i) => i.x);

    expect(result).toEqual([{ x: 2 }, { x: 3 }]);
  });
});

describe('differenceBy', () => {
  test('success', () => {
    const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
    const result = differenceBy(a, b, (i) => i.x);

    expect(result).toEqual([{ x: 1 }]);
  });
});
