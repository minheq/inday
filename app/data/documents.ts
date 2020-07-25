import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

export interface Document {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
  typename: 'Document';
}

export type DocumentsState = { [id: string]: Document | undefined };
export const documentsState = atom<DocumentsState>({
  key: RecoilKey.Documents,
  default: {},
});

export const documentListQuery = selector({
  key: RecoilKey.DocumentList,
  get: ({ get }) => {
    const documents = get(documentsState);

    return Object.values(documents) as Document[];
  },
});

export const documentQuery = selectorFamily<Document | null, string>({
  key: RecoilKey.Document,
  get: (documentID: string) => ({ get }) => {
    const documents = get(documentsState);
    const document = documents[documentID];

    if (document === undefined) {
      return null;
    }

    return document;
  },
});
