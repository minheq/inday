import { isEmpty } from './lang_utils';

export type FlatObject<T> = {
  get: (arr: (string | number)[]) => T | undefined;
  set: (arr: (string | number)[], value: T) => void;
};

/**
 * An Object where setters and getters use array of keys
 */
export function FlatObject<T>(init: { [key: string]: T } = {}): FlatObject<T> {
  const obj: { [key: string]: T } = init;

  function makeKey(arr: (string | number)[]) {
    let key = '';
    for (let i = 0; i < arr.length; i++) {
      const nextKey = arr[i];
      key += `${nextKey}.`;
    }
    return key;
  }

  return {
    get: (arr: (string | number)[]) => {
      return obj[makeKey(arr)];
    },
    set: (arr: (string | number)[], value: T) => {
      if (isEmpty(arr)) {
        console.error(
          '[FlatObject] empty array passed as keys. Nothing will be set. Make sure to pass non-empty array of keys',
        );
        return;
      }

      obj[makeKey(arr)] = value;
    },
  };
}
