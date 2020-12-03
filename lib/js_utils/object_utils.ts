function keysOf<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

function valuesOf<T, K extends keyof T>(obj: T): T[K][] {
  return Object.values(obj) as T[K][];
}

function isEmpty<T extends Record<string, unknown>>(obj: T): boolean {
  return Object.keys(obj).length === 0;
}

export type EmptyObject = {
  [key: string]: never;
};

export const ObjectUtils = {
  keysOf,
  valuesOf,
  isEmpty,
};
