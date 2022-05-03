import { isArray } from "./array_utils";

export function keysOf<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function valuesOf<T, K extends keyof T>(obj: T): T[K][] {
  return Object.values(obj) as T[K][];
}

export type EmptyObject = {
  [key: string]: never;
};

export function isObject(o: unknown): o is Record<string, unknown> {
  if (typeof o === "object") {
    return (
      (o === null ||
        Array.isArray(o) ||
        typeof o == "function" ||
        o.constructor === Date) === false
    );
  }

  return false;
}

export function shallowCloneObject<T extends object>(obj: T): T {
  return { ...obj };
}

export function get<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

/**
 * TODO: Handle merging arrays and other data types
 */
export function mergeObjects<T extends Record<string, unknown>>(
  ...objects: T[]
): T {
  return objects.reduce<T>((result, current) => {
    const keys = Object.keys(current);

    for (const key of keys) {
      const a = result[key];
      const b = current[key];

      if (isArray(a) && isArray(b)) {
        throw new Error("mergeObjects: does not support merging arrays yet");
      } else if (isObject(a) && isObject(b)) {
        // @ts-ignore fix this
        result[key] = mergeObjects(a, b);
      } else if (b !== undefined) {
        // @ts-ignore fix this
        result[key] = current[key];
      }
    }

    return result;
  }, {} as T);
}
