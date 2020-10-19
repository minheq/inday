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

/** Returns array of values found in left and right array */
export function intersectBy<
  T extends { [key: string]: any },
  K extends { [key: string]: any }
>(a: T[], b: K[], prop: keyof T): T[] {
  const bMap: { [key: string]: K } = {};

  for (let i = 0; i < b.length; i++) {
    const itemB = b[i];
    // @ts-ignore: its ok.
    const val = itemB[prop];
    if (val === undefined) {
      throw new Error(
        `Property '${prop}' does not exist in values in right array.`,
      );
    }
    bMap[val] = itemB;
  }

  const result: T[] = [];

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const val = itemA[prop];

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
>(a: T[], b: K[], prop: keyof T): T[] {
  const bMap: { [key: string]: K } = {};

  for (let i = 0; i < b.length; i++) {
    const itemB = b[i];
    // @ts-ignore: we want autocompletion.
    const val = itemB[prop];
    bMap[val] = itemB;
  }

  const result: T[] = [];

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const val = itemA[prop];

    if (bMap[val] === undefined) {
      result.push(itemA);
    }
  }

  return result;
}

export function maxBy<T extends { [key: string]: any }>(
  a: T[],
  prop: keyof T,
): number {
  return Math.max(...a.map((c) => c[prop]));
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
