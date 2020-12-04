export function isEqual<T extends number | string>(a: T[], b: T[]): boolean {
  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const itemB = b[i];

    if (itemA !== itemB) {
      return false;
    }
  }

  return true;
}

export function isEmpty<T extends Record<string, unknown>>(data: T): boolean;
export function isEmpty<T>(data: T[]): boolean;
export function isEmpty(data: unknown[] | Record<string, unknown>): boolean {
  if (Array.isArray(data)) {
    return data.length === 0;
  }

  return Object.keys(data).length === 0;
}
