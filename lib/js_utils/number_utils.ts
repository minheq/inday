export function between(num: number, min: number, max: number): number {
  return Math.max(Math.min(num, max), min);
}

export function isNumeric(value: string): boolean {
  if (value === '') {
    return true;
  }

  if (isNaN(Number(value.replaceAll(' ', '')))) {
    return false;
  }

  return true;
}
