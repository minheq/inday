export function assertEquals<T>(val1: T, val2: T) {
  expect(val1).toEqual(val2);
}

export function assertTruthy<T>(val1: T) {
  expect(val1).toBeTruthy();
}

export function assertFalsy<T>(val1: T) {
  expect(val1).toBeFalsy();
}
