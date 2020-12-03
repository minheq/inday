function between(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

function isNumber(value: unknown): boolean {
  if (value === '') {
    return true;
  }

  if (typeof value === 'string' && isNaN(Number(value.replaceAll(' ', '')))) {
    return false;
  }

  return true;
}

function isNaN(val: unknown): boolean {
  return Number.isNaN(val);
}

function sample(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toNumber(str: string | number): number {
  return Number(str);
}

export const NumberUtils = {
  between,
  isNumber,
  toNumber,
  isNaN,
  sample,
};
