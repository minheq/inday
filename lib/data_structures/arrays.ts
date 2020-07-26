export function range(min: number, max: number, step?: number): number[];
export function range(max: number): number[];
export function range(arg0: any, arg1?: any, arg2?: any): number[] {
  const arr: number[] = [];

  if (!arg1) {
    for (let i = 0; i < arg0; i++) {
      arr.push(i);
    }

    return arr;
  }

  for (let i = arg0; i <= arg1; i = i + (arg2 || 1)) {
    arr.push(i);
  }

  return arr;
}

export function first<T = any>(arr: T[]): T {
  return arr[0];
}

export function last<T = any>(arr: T[]): T {
  return arr[arr.length - 1];
}

export function secondLast<T = any>(arr: T[]): T {
  return arr[arr.length - 2];
}

export function isEmpty<T = any>(arr: T[]): boolean {
  return arr.length === 0;
}
