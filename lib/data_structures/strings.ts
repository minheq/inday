export function assertString(val: any): asserts val is string {
  if (typeof val !== 'string') {
    throw new Error(`Expected string. Received ${typeof val}`);
  }
}
