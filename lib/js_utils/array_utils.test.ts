import { test } from '../../lib/testing';

import { intersectBy, differenceBy } from './array_utils';

test('intersectBy', (t) => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = intersectBy(a, b, (i) => i.x);

  t.deepEqual(result, [{ x: 2 }, { x: 3 }]);
});

test('differenceBy', (t) => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = differenceBy(a, b, (i) => i.x);

  t.deepEqual(result, [{ x: 1 }]);
});
