import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  15,
);

export function generateID<T extends string>(prefix: T): `${T}${string}` {
  return `${prefix}${nanoid()}` as `${T}${string}`;
}

export function validateID<T, K>(prefix: T, id: K): void {
  return;
}
