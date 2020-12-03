import { test } from '../../lib/testing';
import { Pathname } from './pathname';

test('match', (t) => {
  t.deepEqual(Pathname.match('/p/:id', '/p/1/2/3'), { id: '1' });
  t.deepEqual(Pathname.match('/p/:id', '/p/1'), { id: '1' });
  t.deepEqual(Pathname.match('/p/:id', '/P/1A'), { id: '1A' });
  t.deepEqual(Pathname.match('/p/:id', '/p'), false);
  t.deepEqual(Pathname.match('/p/:id/:id2', '/p'), false);
  t.deepEqual(Pathname.match('/p/:id/:id2', '/p/1'), false);
  t.deepEqual(Pathname.match('/p/:id/:id2', '/p/1/2'), { id: '1', id2: '2' });
  t.deepEqual(Pathname.match('/p', '/p'), {});
  t.deepEqual(Pathname.match('/p/', '/other'), false);
});

test('compiles', (t) => {
  t.deepEqual(Pathname.compile('/p', { id: '1' }), '/p');
  t.deepEqual(Pathname.compile('/p/:id', {}), '/p');
  t.deepEqual(Pathname.compile('/p/:id', { id: '1' }), '/p/1');
  t.deepEqual(Pathname.compile('/P/:id', { id: '1' }), '/P/1');
  t.deepEqual(Pathname.compile('/p/:id/:id2', {}), '/p');
  t.deepEqual(Pathname.compile('/p/:id/:id2', { id2: '1' }), '/p');
  t.deepEqual(Pathname.compile('/p/:id/:id2', { id: '1' }), '/p/1');
  t.deepEqual(Pathname.compile('/p/:id/:id2', { id: '1', id2: '1' }), '/p/1/1');
});
