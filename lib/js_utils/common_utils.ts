import { isEmptyArray, areArraysEqual } from './array_utils';

export function isEmpty<T extends Record<string, unknown>>(obj: T): boolean;
export function isEmpty<T>(arr: T[]): boolean;
export function isEmpty<T>(data: Record<string, unknown> | T[]): boolean {
  if (Array.isArray(data)) {
    return isEmptyArray(data);
  }

  return Object.keys(data).length === 0;
}

export function areEqual<T extends Record<string, unknown>>(
  a: T,
  b: T,
): boolean;
export function areEqual<T extends string | number>(
  a: T[],
  b: T[],
  order?: boolean,
): boolean;
export function areEqual<T extends string | number | Record<string, unknown>>(
  a: T,
  b: T,
  order?: boolean,
): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return areArraysEqual(a, b, order);
  }

  return a === b;
}
