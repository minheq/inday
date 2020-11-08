export function set<T extends { [key: string]: any } = any>(
  obj: { [key: string]: any },
  arr: string[] | number[],
  value: any,
): T {
  const clone = { ...obj };
  let current = clone;

  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];

    if (i === arr.length - 1) {
      current[key] = value;
    } else {
      if (current[key] === undefined) {
        current[key] = {};
      }

      current = current[key];
    }
  }

  return clone as T;
}

export function get<
  K extends any = any,
  T extends { [key: string]: any } = any
>(
  obj: T,
  arr: string[] | number[],
  isValue = (item: any): item is K => true,
): K | undefined {
  let current = obj;

  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];

    if (current[key] === undefined) {
      return undefined;
    }

    current = current[key];
  }

  if (isValue(current)) {
    return current;
  }

  return undefined;
}
