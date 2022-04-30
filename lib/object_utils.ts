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
  if (typeof o == "object") {
    return (
      (o === null ||
        Array.isArray(o) ||
        typeof o == "function" ||
        o.constructor === Date) === false
    );
  }

  return false;
}

export function get<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}
