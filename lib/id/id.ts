import { customAlphabet } from 'nanoid';

const idLength = 15;
const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const nanoid = customAlphabet(alphabet, idLength);

export function generateID<T extends string>(prefix: T): `${T}${string}` {
  return `${prefix}${nanoid()}` as `${T}${string}`;
}

export function validateID<T extends string>(prefix: T, id: string): void {
  const prefixLength = prefix.length;

  const extractedPrefix = id.substr(0, prefixLength);
  const extractedID = id.substr(prefixLength);

  if (extractedPrefix !== prefix) {
    throw new Error('Wrong prefix for ID');
  }

  if (extractedID.length !== idLength) {
    throw new Error('Wrong ID length');
  }

  const containsInvalidChar = extractedID.split('').some((char) => {
    return !alphabet.includes(char);
  });

  if (containsInvalidChar) {
    throw new Error('Wrong ID alphabet');
  }
}
