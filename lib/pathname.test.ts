import { test } from './testing';
import { matchPathname, compilePathname } from './pathname';

test('match', (t) => {
  t.deepEqual(matchPathname('/p/:id', '/p/1/2/3'), { id: '1' });
  t.deepEqual(matchPathname('/p/:id', '/p/1'), { id: '1' });
  t.deepEqual(matchPathname('/p/:id', '/P/1A'), { id: '1A' });
  t.deepEqual(matchPathname('/p/:id', '/p'), false);
  t.deepEqual(matchPathname('/p/:id/:id2', '/p'), false);
  t.deepEqual(matchPathname('/p/:id/:id2', '/p/1'), false);
  t.deepEqual(matchPathname('/p/:id/:id2', '/p/1/2'), { id: '1', id2: '2' });
  t.deepEqual(matchPathname('/p', '/p'), {});
  t.deepEqual(matchPathname('/p/', '/other'), false);
});

test('compiles', (t) => {
  t.deepEqual(compilePathname('/p', { id: '1' }), '/p');
  t.deepEqual(compilePathname('/p/:id', {}), '/p');
  t.deepEqual(compilePathname('/p/:id', { id: '1' }), '/p/1');
  t.deepEqual(compilePathname('/P/:id', { id: '1' }), '/P/1');
  t.deepEqual(compilePathname('/p/:id/:id2', {}), '/p');
  t.deepEqual(compilePathname('/p/:id/:id2', { id2: '1' }), '/p');
  t.deepEqual(compilePathname('/p/:id/:id2', { id: '1' }), '/p/1');
  t.deepEqual(compilePathname('/p/:id/:id2', { id: '1', id2: '1' }), '/p/1/1');
});
