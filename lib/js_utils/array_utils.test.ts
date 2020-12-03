import { test } from '../../lib/testing';

import { ArrayUtils } from './array_utils';

test('intersectBy', (t) => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = ArrayUtils.intersectBy(a, b, (i) => i.x);

  t.deepEqual(result, [{ x: 2 }, { x: 3 }]);
});

test('differenceBy', (t) => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = ArrayUtils.differenceBy(a, b, (i) => i.x);

  t.deepEqual(result, [{ x: 1 }]);
});
