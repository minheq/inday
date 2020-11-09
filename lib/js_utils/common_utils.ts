import { isEmptyArray, areArraysEqual } from './array_utils';

export function isEmpty<T extends object>(obj: T): boolean;
export function isEmpty<T extends any>(arr: T[]): boolean;
export function isEmpty(data: any): boolean {
  if (Array.isArray(data)) {
    return isEmptyArray(data);
  }

  return Object.keys(data).length === 0;
}

export function areEqual<T extends object>(a: T, b: T): boolean;
export function areEqual<T extends any>(a: T[], b: T[]): boolean;
export function areEqual(a: any, b: any): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return areArraysEqual(a, b);
  }

  return a === b;
}
