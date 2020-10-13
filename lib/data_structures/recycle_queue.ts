import { isEmpty } from './primitive';

export class RecycleQueue {
  items: number[];
  size: number;
  private index: number;

  constructor(size: number, items: number[] = []) {
    this.size = size;
    this.items = items;

    if (isEmpty(items) === false) {
      if (size === items.length) {
        let index = 0;

        for (let i = 0; i < items.length; i++) {
          const maxNum = items[i];

          if (maxNum > items[index]) {
            index = i;
          }
        }

        this.index = index;
      } else {
        let minNum = items[0];

        for (let i = 0; i < items.length; i++) {
          if (minNum > items[i]) {
            minNum = items[i];
          }
        }

        this.items = [];
        for (let i = 0; i < size; i++) {
          this.items.push(i + minNum);
        }

        this.index = size - 1;
      }
    } else {
      this.index = -1;
    }
  }

  front() {
    return this.items[this.index];
  }

  rear() {
    return this.items[(this.index + 1) % this.size];
  }

  isEmpty() {
    return isEmpty(this.items);
  }

  getItems() {
    return this.items;
  }

  enqueue() {
    if (this.isEmpty()) {
      this.items[0] = 1;
      this.index = 0;
    } else {
      const num = this.items[this.index] + 1;
      this.index = (this.index + 1) % this.size;
      this.items[this.index] = num;
    }
  }

  dequeue() {
    if (isEmpty(this.items)) {
      throw new Error('Cannot dequeue from RecycleQueue because it is empty.');
    }

    const nextIndex = (this.index + 1) % this.size;
    const prevNum = this.items[nextIndex] - 1;

    if (prevNum === 0) {
      this.items.pop();
      return;
    }

    this.items[this.index] = prevNum;

    if (this.index === 0) {
      this.index = this.size - 1;
    } else {
      this.index = this.index - 1;
    }
  }
}
