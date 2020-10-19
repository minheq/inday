import { isEmpty } from './primitive';

export function range(min: number, max: number, step?: number): number[];
export function range(max: number): number[];
export function range(arg0: any, arg1?: any, arg2?: any): number[] {
  const arr: number[] = [];

  if (!arg1) {
    for (let i = 0; i < arg0; i++) {
      arr.push(i);
    }

    return arr;
  }

  for (let i = arg0; i <= arg1; i = i + (arg2 || 1)) {
    arr.push(i);
  }

  return arr;
}

/**
 * Get first item in the array.
 * IMPORTANT: Make sure to check that the array is not empty first.
 */
export function first<T = any>(arr: T[]): T {
  return arr[0];
}

/**
 * Get last item in the array.
 * IMPORTANT: Make sure to check that the array is not empty first.
 */
export function last<T = any>(arr: T[]): T {
  return arr[arr.length - 1];
}

export function secondLast<T = any>(arr: T[]): T {
  return arr[arr.length - 2];
}

export function isNotEmpty<T = any>(arr: T[]): boolean {
  return arr.length > 0;
}

export function intersect<T>(a: T[], b: T[]): T[] {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));

  return Array.from(intersection);
}

type Iteratee<T> = ((item: T) => string) | string;

/** TODO: Optimize */
export function intersectBy<T extends { [key: string]: any }>(
  a: T[],
  b: T[],
  iteratee: Iteratee<T>,
): T[] {
  function getKey(item: T): string {
    if (typeof iteratee === 'string') {
      return item[iteratee];
    }

    return iteratee(item);
  }

  const result: T[] = [];

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const keyA = getKey(itemA);

    for (let j = 0; j < b.length; j++) {
      const itemB = b[j];
      const keyB = getKey(itemB);

      if (keyA === keyB) {
        result.push(itemA);
        break;
      }
    }
  }

  return result;
}

/** TODO: Optimize */
export function differenceBy<T extends { [key: string]: any }>(
  a: T[],
  b: T[],
  iteratee: Iteratee<T>,
): T[] {
  function getKey(item: T): string {
    if (typeof iteratee === 'string') {
      return item[iteratee];
    }

    return iteratee(item);
  }

  const result: T[] = [];

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const keyA = getKey(itemA);
    let contains = false;

    for (let j = 0; j < b.length; j++) {
      const itemB = b[j];
      const keyB = getKey(itemB);

      if (keyA === keyB) {
        contains = true;
        break;
      }
    }

    if (contains === false) {
      result.push(itemA);
    }
  }

  return result;
}

export function hasAnyOf<T>(a: T[], b: T[]): boolean {
  return isNotEmpty(intersect(a, b));
}

export function hasAllOf<T>(a: T[], b: T[]): boolean {
  const intersection = intersect(a, b);

  return intersection.length === a.length && a.length === b.length;
}

export function hasNoneOf<T>(a: T[], b: T[]): boolean {
  return isEmpty(intersect(a, b));
}

type KeyedBy<T extends { [key: string]: any }> = { [key: string]: T };

export function keyedBy<T extends { [key: string]: any }>(
  items: T[],
  prop: keyof T,
): KeyedBy<T> {
  const grouped: KeyedBy<T> = {};

  for (const item of items) {
    const key = item[prop];

    grouped[key] = item;
  }

  return grouped;
}

export function groupBy<T extends { [key: string]: any }>(
  items: T[],
  prop: keyof T,
) {
  const grouped: { [key: string]: T[] } = {};

  for (const item of items) {
    const key = item[prop];

    if (grouped[key]) {
      grouped[key].push(item);
    } else {
      grouped[key] = [item];
    }
  }

  return grouped;
}
