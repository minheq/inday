import { isEmpty } from './lang_utils';
import { isNumberString, toNumber } from './number_utils';

export type FlatObject<T, K extends string | number> = {
  get: (arr: K[]) => T | undefined;
  set: (arr: K[], value: T) => void;
  keysOf: () => K[][];
};

/**
 * An Object where setters and getters use array of keys
 */
export function FlatObject<T, K extends string | number>(
  init: { [key: string]: T } = {},
): FlatObject<T, K> {
  const obj: { [key: string]: T } = init;

  function makeKey(arr: K[]) {
    let key = '';
    for (let i = 0; i < arr.length; i++) {
      const nextKey = arr[i];
      key += `${nextKey}.`;
    }
    return key;
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

      return keys.map((arrString) =>
        arrString.split('.').map((i) => {
          if (isNumberString(i)) {
            return toNumber(i) as K;
          }

          return i as K;
        }),
      );
    },
  };
}
