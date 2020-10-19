import { intersectBy, differenceBy } from './arrays';

describe('intersectBy', () => {
  test('success', () => {
    const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
    const result = intersectBy(a, b, 'x');

    expect(result).toEqual([{ x: 2 }, { x: 3 }]);
  });
});

describe('differenceBy', () => {
  test('success', () => {
    const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
    const result = differenceBy(a, b, 'x');

    expect(result).toEqual([{ x: 1 }]);
  });
});
