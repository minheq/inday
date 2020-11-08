import { get, set } from './object_utils';

describe('set', () => {
  test('happy', () => {
    const result = set({ b: 2 }, ['a', 'b', 'c'], 1);

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

describe('get', () => {
  test('happy', () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
      },
      b: 2,
    };

    const result = get(obj, ['a', 'b', 'c']);

    expect(result).toBe(1);
  });
});
