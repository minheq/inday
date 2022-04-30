export function sum(numbers: number[]): number {
  return numbers.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
}

export function maxBy<T>(a: T[], getValue: (item: T) => number): number {
  return Math.max(...a.map((c) => getValue(c)));
}

export function sumBy<T>(a: T[], getValue: (item: T) => number): number {
  return sum(a.map((c) => getValue(c)));
}

export function max(...args: number[]): number {
  return Math.max(...args);
}

export function min(...args: number[]): number {
  return Math.min(...args);
}
