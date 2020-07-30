import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { fieldListQuery, Field } from './fields';
import { Document, documentListQuery } from './documents';
import { collection1, collection2 } from './fake_data';

export interface Collection {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}

export type CollectionsState = { [id: string]: Collection | undefined };
export const collectionsState = atom<CollectionsState>({
  key: RecoilKey.Collections,
  default: {
    [collection1.id]: collection1,
    [collection2.id]: collection2,
  },
});

export const collectionListQuery = selector({
  key: RecoilKey.CollectionList,
  get: ({ get }) => {
    const collections = get(collectionsState);

    return Object.values(collections) as Collection[];
  },
});

export const collectionQuery = selectorFamily<Collection | null, string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const collections = get(collectionsState);
    const collection = collections[collectionID];

    if (collection === undefined) {
      return null;
    }

    return collection;
  },
});

export const collectionFieldsQuery = selectorFamily<
  { [fieldID: string]: Field },
  string
>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const fieldList = get(fieldListQuery);

    const fields: { [fieldID: string]: Field } = {};

    for (const field of fieldList) {
      if (field.collectionID === collectionID) {
        fields[field.id] = field;
      }
    }

    return fields;
  },
});

export const collectionDocumentListQuery = selectorFamily<Document[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const documentList = get(documentListQuery);

    return documentList.filter((doc) => doc.collectionID === collectionID);
  },
});
