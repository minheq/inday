export function clamp(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

export function isNumberString(value: string): boolean {
  if (isNaN(Number(value.trim()))) {
    return false;
  }

  return true;
}

export function random(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function toNumber(str: string): number {
  return Number(str);
}
