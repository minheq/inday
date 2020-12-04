import { test } from './testing';

import { FlatObject } from './flat_object';

test('happy', (t) => {
  const obj = FlatObject();

  obj.set(['a', 'b', 'c'], 1);

  const result = obj.get(['a', 'b', 'c']);

  t.deepEqual(result, 1);
});
