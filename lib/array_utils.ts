import { isEmpty } from "./lang_utils";
import { random } from "./number_utils";

export function range(min: number, max: number, step?: number): number[];
export function range(max: number): number[];
export function range(arg0: number, arg1?: number, arg2?: number): number[] {
  const arr: number[] = [];

  if (arg1 === undefined) {
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
 *
 * NOTE: Make sure to check that the array is not empty first or that element exists
 */
export function first<T>(arr: T[]): T {
  return arr[0];
}

/**
 * Get last item in the array.
 *
 * NOTE: Make sure to check that the array is not empty first or that element exists
 */
export function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

export function secondLast<T>(arr: T[]): T {
  return arr[arr.length - 2];
}

export function isNotEmpty<T>(arr: T[]): boolean {
  return arr.length > 0;
}

export function uniqueBy<T>(
  arr: T[],
  getValue: (item: T) => string | number
): T[] {
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

export function unique<T>(arr: T[]): T[] {
  const set = new Set(arr);

  const result: T[] = [];

  for (const item of set) {
    result.push(item);
  }

  return result;
}

export function take<T>(arr: T[], size: number): T[] {
  return arr.slice(0, size);
}

export function filterBy<T>(arr: T[], getValue: (item: T) => boolean): T[] {
  return arr.filter((v) => getValue(v));
}

export function removeBy<T>(arr: T[], getValue: (item: T) => boolean): T[] {
  const result: T[] = [];

  for (const item of arr) {
    const skip = getValue(item);

    if (!skip) {
      result.push(item);
    }
  }

  return result;
}

export function append<T>(arr: T[], item: T): T[] {
  return arr.concat(item);
}

export function updateLast<T>(arr: T[], updater: (item: T) => T): T[] {
  const nextArr = arr.slice(0);
  nextArr[arr.length - 1] = updater(arr[arr.length - 1]);
  return nextArr;
}

export function intersect<T extends number | string>(a: T[], b: T[]): T[] {
  return intersectBy(a, b, (v) => v);
}

/**
 * Returns array of values found in left and right array.
 * Other values not intersected by, will be taken from left array.
 *
 * If `merge` is true, objects will be merged, with the objects from right array overriding the other array objects.
 */
export function intersectBy<T, K>(
  a: T[],
  b: K[],
  getValue: (item: T | K) => string | number,
  merge = false
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
    const itemB = bMap[val];

    if (itemB !== undefined) {
      if (merge) {
        result.push({ ...itemA, ...itemB });
      } else {
        result.push(itemA);
      }
    }
  }

  return result;
}

/** Returns array of values in left array that are not in the right array */
export function differenceBy<T, K>(
  a: T[],
  b: K[],
  getValue: (item: T | K) => string | number
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

export function hasAnyOf<T extends string | number>(a: T[], b: T[]): boolean {
  return isNotEmpty(intersect(a, b));
}

export function hasAllOf<T extends string | number>(a: T[], b: T[]): boolean {
  const intersection = intersect(a, b);

  return intersection.length === a.length && a.length === b.length;
}

export function hasNoneOf<T extends string | number>(a: T[], b: T[]): boolean {
  return isEmpty(intersect(a, b));
}

type KeyedBy<T> = { [key: string]: T };

/**
 * Returns an object with keys as chosen property of the item,
 * and value as item.
 */
export function keyedBy<T>(
  items: T[],
  getKey: (item: T) => string
): KeyedBy<T> {
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
export function splitLast<T>(items: T[]): [T[], T] {
  return [items.slice(0, items.length - 1), last(items)];
}

/**
 *
 * Example:
 * ```
 * splitFirst([1, 2, 3])
 * // => [1, [2, 3]]
 * ```
 */
export function splitFirst<T>(items: T[]): [T, T[]] {
  return [first(items), items.slice(1)];
}

/**
 * Returns an object with keys as chosen property of the item,
 * and value as array of item with same key.
 */
export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string
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

export function chunk<T>(arr: T[], size: number): T[][] {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }

  return result;
}

export function sample<T>(arr: T[]): T {
  const index = random(0, arr.length - 1);

  return arr[index];
}

export function isEqualBy<T>(
  a: T[],
  b: T[],
  getValue: (item: T) => string | number,
  order = false
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

export function isArray<T>(arg: unknown): arg is T[] {
  return Array.isArray(arg);
}

export function shallowCloneArray<T>(arr: T[]): T[] {
  return arr.slice(0);
}
