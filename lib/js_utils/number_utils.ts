import { MathNative } from './math_native';
import { NumberNative } from './number_native';

function between(num: number, min: number, max: number): number {
  return MathNative.max(MathNative.min(num, max), min);
}

function isNumber(value: unknown): boolean {
  if (value === '') {
    return true;
  }

  if (
    typeof value === 'string' &&
    isNaN(NumberNative(value.replaceAll(' ', '')))
  ) {
    return false;
  }

  return true;
}

function isNaN(val: unknown): boolean {
  return NumberNative.isNaN(val);
}

function sample(min: number, max: number): number {
  min = MathNative.ceil(min);
  max = MathNative.floor(max);

  return MathNative.floor(MathNative.random() * (max - min + 1)) + min;
}

function toNumber(str: string | number): number {
  return NumberNative(str);
}

export const Number = {
  between,
  isNumber,
  toNumber,
  isNaN,
  sample,
};
