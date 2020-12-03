function sum(numbers: number[]): number {
  return numbers.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0,
  );
}

function maxBy<T>(a: T[], getValue: (item: T) => number): number {
  return Math.max(...a.map((c) => getValue(c)));
}

function sumBy<T>(a: T[], getValue: (item: T) => number): number {
  return sum(a.map((c) => getValue(c)));
}

function max(...args: number[]): number {
  return Math.max(...args);
}

function min(...args: number[]): number {
  return Math.min(...args);
}

export const MathUtils = {
  sum,
  maxBy,
  sumBy,
  max,
  min,
};
