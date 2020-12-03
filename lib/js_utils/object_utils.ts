import { ObjectNative } from './object_native';

function keysOf<T>(obj: T): (keyof T)[] {
  return ObjectNative.keys(obj) as (keyof T)[];
}

function valuesOf<T, K extends keyof T>(obj: T): T[K][] {
  return ObjectNative.values(obj) as T[K][];
}

function isEmpty<T extends Record<string, unknown>>(obj: T): boolean {
  return ObjectNative.keys(obj).length === 0;
}

export type EmptyObject = {
  [key: string]: never;
};

export const Object = {
  keysOf,
  valuesOf,
  isEmpty,
};
