import { FlatObject } from './flat_object';

describe('FlatObject', () => {
  test('happy', () => {
    const obj = FlatObject();

    obj.set(['a', 'b', 'c'], 1);

    const result = obj.get(['a', 'b', 'c']);

    expect(result).toBe(1);
  });
});
