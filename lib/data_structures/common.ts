export function isEmpty<T extends object>(obj: T): boolean;
export function isEmpty<T extends any>(arr: T[]): boolean;
export function isEmpty(data: any): boolean {
  if (Array.isArray(data)) {
    return data.length === 0;
  }

  return Object.keys(data).length === 0;
}
