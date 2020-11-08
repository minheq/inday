export function sum(numbers: number[]): number {
  return numbers.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0,
  );
}

export function maxBy<T extends { [key: string]: any }>(
  a: T[],
  getValue: (item: T) => number,
): number {
  return Math.max(...a.map((c) => getValue(c)));
}

export function sumBy<T extends { [key: string]: any }>(
  a: T[],
  getValue: (item: T) => number,
): number {
  return sum(a.map((c) => getValue(c)));
}
