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

/** Returns array of values found in left and right array */
export function intersectBy<
  T extends { [key: string]: any },
  K extends { [key: string]: any }
>(a: T[], b: K[], getValue: (item: T | K) => string | number): T[] {
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
export function differenceBy<
  T extends { [key: string]: any },
  K extends { [key: string]: any }
>(a: T[], b: K[], getValue: (item: T | K) => string | number): T[] {
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

/**
 * Returns an object with keys as chosen property of the item,
 * and value as item.
 */
export function keyedBy<T extends { [key: string]: any }>(
  items: T[],
  prop: keyof T,
): KeyedBy<T> {
  const result: KeyedBy<T> = {};

  for (const item of items) {
    const key = item[prop];

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
  return [items.slice(0, items.length - 1), items[items.length - 1]];
}

/**
 * Returns an object with keys as chosen property of the item,
 * and value as array of item with same key.
 */
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

export function isEmptyArray<T = any>(data: T[]): boolean {
  return data.length === 0;
}

/**
 * Compares whether 2 arrays are equal
 * @param order If true, both array items must be in the same order
 */
export function areArraysEqual<T extends number | string = any>(
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
