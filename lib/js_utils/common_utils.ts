import * as ArrayUtils from './array_utils';

export function isEmpty<T extends object>(obj: T): boolean;
export function isEmpty<T extends any>(arr: T[]): boolean;
export function isEmpty(data: any): boolean {
  if (Array.isArray(data)) {
    return ArrayUtils.isEmpty(data);
  }

  return Object.keys(data).length === 0;
}
