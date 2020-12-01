import { ArrayNative } from './array_native';
import { Number } from './number_utils';

function range(min: number, max: number, step?: number): number[];
function range(max: number): number[];
function range(arg0: number, arg1?: number, arg2?: number): number[] {
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
function first<T>(arr: T[]): T {
  return arr[0];
}

/**
 * Get last item in the array.
 * IMPORTANT: Make sure to check that the array is not empty first.
 */
function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

function secondLast<T>(arr: T[]): T {
  return arr[arr.length - 2];
}

function isNotEmpty<T>(arr: T[]): boolean {
  return arr.length > 0;
}

function uniqueBy<T>(arr: T[], getValue: (item: T) => string | number): T[] {
  const map: { [key: string]: true } = {};
  const result: T[] = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const val = getValue(item);

    if (map[val]) {
      continue;
    }

    map[val] = true;
    result.push(item);
  }

  return result;
}

function unique<T>(arr: T[]): T[] {
  const set = new Set(arr);

  const result: T[] = [];

  for (const item of set) {
    result.push(item);
  }

  return result;
}

function take<T>(arr: T[], size: number): T[] {
  return arr.slice(0, size);
}

function remove<T>(arr: T[], size: number): T[] {
  return arr.slice(0, arr.length - size);
}

function append<T>(arr: T[], item: T): T[] {
  return arr.concat(item);
}

function updateLast<T>(arr: T[], updater: (item: T) => T): T[] {
  const nextArr = arr.slice(0);
  nextArr[arr.length - 1] = updater(arr[arr.length - 1]);
  return nextArr;
}

function intersect<T extends number | string>(a: T[], b: T[]): T[] {
  return intersectBy(a, b, (v) => v);
}

/** Returns array of values found in left and right array */
function intersectBy<T, K>(
  a: T[],
  b: K[],
  getValue: (item: T | K) => string | number,
): T[] {
  const bMap: { [key: string]: K } = {};

  for (let i = 0; i < b.length; i++) {
    const itemB = b[i];
    const val = getValue(itemB);
    bMap[val] = itemB;
  }

  const result: T[] = [];

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const val = getValue(itemA);

    if (bMap[val] !== undefined) {
      result.push(itemA);
    }
  }

  return result;
}

/** Returns array of values in left array that are not in the right array */
function differenceBy<T, K>(
  a: T[],
  b: K[],
  getValue: (item: T | K) => string | number,
): T[] {
  const bMap: { [key: string]: K } = {};

  for (let i = 0; i < b.length; i++) {
    const itemB = b[i];
    const val = getValue(itemB);
    bMap[val] = itemB;
  }

  const result: T[] = [];

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const val = getValue(itemA);

    if (bMap[val] === undefined) {
      result.push(itemA);
    }
  }

  return result;
}

function hasAnyOf<T extends string | number>(a: T[], b: T[]): boolean {
  return isNotEmpty(intersect(a, b));
}

function hasAllOf<T extends string | number>(a: T[], b: T[]): boolean {
  const intersection = intersect(a, b);

  return intersection.length === a.length && a.length === b.length;
}

function hasNoneOf<T extends string | number>(a: T[], b: T[]): boolean {
  return isEmpty(intersect(a, b));
}

type KeyedBy<T> = { [key: string]: T };

/**
 * Returns an object with keys as chosen property of the item,
 * and value as item.
 */
function keyedBy<T>(items: T[], getKey: (item: T) => string): KeyedBy<T> {
  const result: KeyedBy<T> = {};

  for (const item of items) {
    const key = getKey(item);

    result[key] = item;
  }

  return result;
}

/**
 *
 * Example:
 * ```
 * splitLast([1, 2, 3])
 * // => [[1, 2], 3]
 * ```
 */
function splitLast<T>(items: T[]): [T[], T] {
  return [items.slice(0, items.length - 1), items[items.length - 1]];
}

/**
 * Returns an object with keys as chosen property of the item,
 * and value as array of item with same key.
 */
function groupBy<T>(
  items: T[],
  getKey: (item: T) => string,
): { [key: string]: T[] } {
  const grouped: { [key: string]: T[] } = {};

  for (const item of items) {
    const key = getKey(item);

    if (grouped[key]) {
      grouped[key].push(item);
    } else {
      grouped[key] = [item];
    }
  }

  return grouped;
}

function isEmpty<T>(data: T[]): boolean {
  return data.length === 0;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }

  return result;
}

function sample<T>(arr: T[]): T {
  const index = Number.sample(0, arr.length - 1);

  return arr[index];
}

/**
 * Compares whether 2 arrays are equal
 * @param order If true, both array items must be in the same order
 */
function isEqual<T extends number | string>(
  a: T[],
  b: T[],
  order = false,
): boolean {
  if (order === true) {
    for (let i = 0; i < a.length; i++) {
      const itemA = a[i];
      const itemB = b[i];

      if (itemA !== itemB) {
        return false;
      }
    }

    return true;
  }

  return hasAllOf(a, b);
}

function isEqualBy<T>(
  a: T[],
  b: T[],
  getValue: (item: T) => string | number,
  order = false,
): boolean {
  if (order === true) {
    for (let i = 0; i < a.length; i++) {
      const valA = getValue(a[i]);
      const valB = getValue(b[i]);

      if (valA !== valB) {
        return false;
      }
    }

    return true;
  }

  const intersection = intersectBy(a, b, getValue);

  return intersection.length === a.length;
}

function isArray<T>(
  arg: T | any,
): arg is T extends readonly any[]
  ? unknown extends T
    ? never
    : readonly any[]
  : any[] {
  return ArrayNative.isArray(arg);
}

export const Array = {
  range,
  first,
  last,
  secondLast,
  isNotEmpty,
  uniqueBy,
  unique,
  take,
  remove,
  append,
  updateLast,
  intersect,
  intersectBy,
  differenceBy,
  hasAnyOf,
  hasAllOf,
  hasNoneOf,
  keyedBy,
  splitLast,
  groupBy,
  isEmpty,
  chunk,
  sample,
  isEqual,
  isEqualBy,
  isArray,
};
