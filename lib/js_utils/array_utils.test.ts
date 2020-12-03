import { test } from '../../lib/testing';

import { Array } from './array_utils';

test('intersectBy', (t) => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = Array.intersectBy(a, b, (i) => i.x);

  t.deepEqual(result, [{ x: 2 }, { x: 3 }]);
});

test('differenceBy', (t) => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = Array.differenceBy(a, b, (i) => i.x);

  t.deepEqual(result, [{ x: 1 }]);
});
