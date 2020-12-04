export function keysOf<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function valuesOf<T, K extends keyof T>(obj: T): T[K][] {
  return Object.values(obj) as T[K][];
}

export type EmptyObject = {
  [key: string]: never;
};
