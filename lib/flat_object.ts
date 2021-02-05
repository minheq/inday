import { isEmpty } from './lang_utils';
import { isNumberString, toNumber } from './number_utils';

export type FlatObject<K extends string | number, T> = {
  get: (arr: K[]) => T;
  set: (arr: K[], value: T) => void;
  keysOf: () => K[][];
  entries: () => [K[], T][];
};

/**
 * An Object where setters and getters use array of keys
 */
export function FlatObject<K extends string | number, T>(
  init: { [key: string]: T } = {},
): FlatObject<K, T> {
  const obj: { [key: string]: T } = init;

  function makeKey(arr: K[]) {
    let key = '';
    for (let i = 0; i < arr.length; i++) {
      const nextKey = arr[i];
      key += `${nextKey}.`;
    }
    return key;
  }

  function toKeyArray(arrString: string): K[] {
    return arrString.split('.').map((i) => {
      if (isNumberString(i)) {
        return toNumber(i) as K;
      }

      return i as K;
    });
  }

  return {
    get: (arr: K[]) => {
      return obj[makeKey(arr)];
    },
    set: (arr: K[], value: T) => {
      if (isEmpty(arr)) {
        console.error(
          '[FlatObject] empty array passed as keys. Nothing will be set. Make sure to pass non-empty array of keys',
        );
        return;
      }

      obj[makeKey(arr)] = value;
    },
    keysOf: (): K[][] => {
      const keys = Object.keys(obj);

      return keys.map((arrString) => toKeyArray(arrString));
    },
    entries: (): [K[], T][] => {
      const keys = Object.keys(obj);

      return keys.map((arrString) => {
        const arr = toKeyArray(arrString);

        return [arr, obj[makeKey(arr)]];
      });
    },
  };
}
