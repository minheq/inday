import { isEmptyArray, arrayIsEqual } from './array_utils';

export function isEmpty<T extends Record<string, unknown>>(obj: T): boolean;
export function isEmpty<T>(arr: T[]): boolean;
export function isEmpty<T>(data: Record<string, unknown> | T[]): boolean {
  if (Array.isArray(data)) {
    return isEmptyArray(data);
  }

  return Object.keys(data).length === 0;
}

export function isEqual<T extends Record<string, unknown>>(a: T, b: T): boolean;
export function isEqual<T extends string | number>(
  a: T[],
  b: T[],
  order?: boolean,
): boolean;
export function isEqual<T extends string | number | Record<string, unknown>>(
  a: T,
  b: T,
  order?: boolean,
): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return arrayIsEqual(a, b, order);
  }

  return a === b;
}

export function isNonNullish<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

export function isNullish<T>(value?: T | null): value is null | undefined {
  return value === undefined || value === null;
}
