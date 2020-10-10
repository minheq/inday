import { RecycleQueue } from './recycle_queue';

describe('RecycleQueue', () => {
  const queue = new RecycleQueue(5);

  test('enqueue 1 item', () => {
    queue.enqueue();
    expect(queue.getItems()).toEqual([1]);
  });

  test('enqueue full queue', () => {
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    expect(queue.getItems()).toEqual([1, 2, 3, 4, 5]);
  });

  test('enqueue 2', () => {
    queue.enqueue();
    queue.enqueue();

    expect(queue.getItems()).toEqual([6, 7, 3, 4, 5]);
  });

  test('enqueue 5', () => {
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    queue.enqueue();
    expect(queue.getItems()).toEqual([11, 12, 8, 9, 10]);
  });

  test('enqueue 1', () => {
    queue.enqueue();
    expect(queue.getItems()).toEqual([11, 12, 13, 9, 10]);
  });

  test('dequeue 1', () => {
    queue.dequeue();

    expect(queue.getItems()).toEqual([11, 12, 8, 9, 10]);
  });

  test('dequeue 5', () => {
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();

    expect(queue.getItems()).toEqual([6, 7, 3, 4, 5]);
  });

  test('dequeue 2', () => {
    queue.dequeue();
    queue.dequeue();

    expect(queue.getItems()).toEqual([1, 2, 3, 4, 5]);
  });

  test('dequeue to last item', () => {
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();

    expect(queue.getItems()).toEqual([1]);
  });

  test('dequeue to empty', () => {
    queue.dequeue();

    expect(queue.getItems()).toEqual([]);
  });
});
