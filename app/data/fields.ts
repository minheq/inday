import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

export interface Field {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  viewID: string;
  typename: 'Field';
}

export type FieldsState = { [id: string]: Field | undefined };
export const fieldsState = atom<FieldsState>({
  key: RecoilKey.Fields,
  default: {},
});

export const fieldListQuery = selector({
  key: RecoilKey.FieldList,
  get: ({ get }) => {
    const fields = get(fieldsState);

    return Object.values(fields) as Field[];
  },
});

export const fieldQuery = selectorFamily<Field | null, string>({
  key: RecoilKey.Field,
  get: (fieldID: string) => ({ get }) => {
    const fields = get(fieldsState);
    const field = fields[fieldID];

    if (field === undefined) {
      return null;
    }

    return field;
  },
});
