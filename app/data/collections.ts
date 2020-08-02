import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { fieldsQuery, Field } from './fields';
import { Document, documentsQuery } from './documents';
import { collection1, collection2 } from './fake_data';
import { View, viewsQuery } from './views';

export interface Collection {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}

export type CollectionsByIDState = { [id: string]: Collection | undefined };
export const collectionsByIDState = atom<CollectionsByIDState>({
  key: RecoilKey.CollectionsByID,
  default: {
    [collection1.id]: collection1,
    [collection2.id]: collection2,
  },
});

export const collectionsQuery = selector({
  key: RecoilKey.Collections,
  get: ({ get }) => {
    const collectionsByID = get(collectionsByIDState);

    return Object.values(collectionsByID) as Collection[];
  },
});

export const collectionQuery = selectorFamily<Collection | null, string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const collectionsByID = get(collectionsByIDState);
    const collection = collectionsByID[collectionID];

    if (collection === undefined) {
      return null;
    }

    return collection;
  },
});

export const collectionFieldsByIDQuery = selectorFamily<
  { [fieldID: string]: Field },
  string
>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    const fieldsByID: { [fieldID: string]: Field } = {};

    for (const field of fields) {
      if (field.collectionID === collectionID) {
        fieldsByID[field.id] = field;
      }
    }

    return fieldsByID;
  },
});

export const collectionFieldsQuery = selectorFamily<Field[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    return fields.filter((f) => f.collectionID === collectionID);
  },
});

export const collectionViewsQuery = selectorFamily<View[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const views = get(viewsQuery);

    return views.filter((v) => v.collectionID === collectionID);
  },
});

export const collectionDocumentsQuery = selectorFamily<Document[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const documents = get(documentsQuery);

    return documents.filter((doc) => doc.collectionID === collectionID);
  },
});
