import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

export interface Collection {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
  typename: 'Collection';
}

export type CollectionsState = { [id: string]: Collection | undefined };
export const collectionsState = atom<CollectionsState>({
  key: RecoilKey.Collections,
  default: {},
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
