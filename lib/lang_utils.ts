import { isArray, shallowCloneArray } from "./array_utils";
import { isObject, shallowCloneObject } from "./object_utils";

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (isArray(a) && isArray(b)) {
    return isArrayEqual(a, b);
  }

  if (isObject(a) && isObject(b)) {
    return isObjectEqual(a, b);
  }

  return a !== a && b !== b;
}

function isArrayEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const itemB = b[i];

    if (isEqual(itemA, itemB) === false) {
      return false;
    }
  }

  return true;
}

function isObjectEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  if (a.constructor !== b.constructor) {
    return false;
  }

  if (a.valueOf !== Object.prototype.valueOf) {
    return a.valueOf() === b.valueOf();
  }

  if (a.toString !== Object.prototype.toString) {
    return a.toString() === b.toString();
  }

  const keys = Object.keys(a);
  const length = keys.length;
  if (length !== Object.keys(b).length) {
    return false;
  }

  for (let i = length; i-- !== 0; ) {
    if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
      return false;
    }
  }

  for (let i = length; i-- !== 0; ) {
    const key = keys[i];

    const subA = a[key];
    const subB = b[key];

    if (!isEqual(subA, subB)) {
      return false;
    }
  }

  return true;
}

export function isEmpty<T extends Record<string, unknown>>(data: T): boolean;
export function isEmpty<T>(data: T[]): boolean;
export function isEmpty(data: unknown[] | Record<string, unknown>): boolean {
  if (isArray(data)) {
    return data.length === 0;
  }

  return Object.keys(data).length === 0;
}

export function assertUnreached(p: never, message?: string): never;
export function assertUnreached(p: unknown, message?: string): never {
  if (message !== undefined) {
    throw new Error(message);
  } else {
    throw new Error("Unknown value" + JSON.stringify(p));
  }
}

export function map<T, K>(
  obj: Record<string, T>,
  callback: (value: T) => K
): Record<string, K> {
  const keys = Object.keys(obj);
  const result: Record<string, K> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    result[key] = callback(value);
  }

  return result;
}

export function shallowClone<T>(data: T[]): T[];
export function shallowClone<T>(data: T): T;
export function shallowClone<T>(obj: T | T[]): T | T[] {
  if (isObject(obj)) {
    return shallowCloneObject(obj);
  }
  if (isArray(obj)) {
    return shallowCloneArray(obj);
  }

  return obj;
}
