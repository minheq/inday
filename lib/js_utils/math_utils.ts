import { MathNative } from './math_native';

function sum(numbers: number[]): number {
  return numbers.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0,
  );
}

function maxBy<T>(a: T[], getValue: (item: T) => number): number {
  return MathNative.max(...a.map((c) => getValue(c)));
}

function sumBy<T>(a: T[], getValue: (item: T) => number): number {
  return sum(a.map((c) => getValue(c)));
}

function max(...args: number[]): number {
  return MathNative.max(...args);
}

function min(...args: number[]): number {
  return MathNative.min(...args);
}

export const Math = {
  sum,
  maxBy,
  sumBy,
  max,
  min,
};
