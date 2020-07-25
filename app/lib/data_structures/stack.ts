import { last } from './arrays';

export class Stack<T = any> {
  items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }

  get last() {
    return last(this.items);
  }

  get(i: number): T | null {
    return this.items[i];
  }

  push = (item: T) => {
    this.items.push(item);
  };

  pop = () => {
    return this.items.pop();
  };
}
