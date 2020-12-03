export function isNonNullish<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

export function isNullish<T>(value?: T | null): value is null | undefined {
  return value === undefined || value === null;
}
