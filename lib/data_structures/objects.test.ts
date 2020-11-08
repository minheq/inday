import { accessValue, assignValue } from './objects';

describe('assignValue', () => {
  test('happy', () => {
    const result = assignValue({ b: 2 }, ['a', 'b', 'c'], 1);

    expect(result).toMatchObject({
      a: {
        b: {
          c: 1,
        },
      },
      b: 2,
    });
  });
});

describe('accessValue', () => {
  test('happy', () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
      },
      b: 2,
    };

    const result = accessValue(obj, ['a', 'b', 'c']);

    expect(result).toBe(1);
  });
});
