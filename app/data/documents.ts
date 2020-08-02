import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { doc1, doc2 } from './fake_data';

export type CollaboratorID = string;

export type SingleLineTextFieldValue = string;
export type MultiLineTextFieldValue = string;
export type SingleSelectFieldValue = string;
export type MultiSelectFieldValue = string[];
export type SingleCollaboratorFieldValue = CollaboratorID;
export type MultiCollaboratorFieldValue = CollaboratorID[];
export type SingleDocumentLinkFieldValue = DocumentID;
export type MultiDocumentLinkFieldValue = DocumentID[];
export type DateFieldValue = Date;
export type PhoneNumberFieldValue = string;
export type EmailFieldValue = string;
export type URLFieldValue = string;
export type NumberFieldValue = number;
export type CurrencyFieldValue = {
  amount: number;
  currency: string;
};

type CheckboxFieldValue = boolean;

export type DocumentFieldValue =
  | SingleLineTextFieldValue
  | MultiLineTextFieldValue
  | SingleSelectFieldValue
  | MultiSelectFieldValue
  | SingleCollaboratorFieldValue
  | MultiCollaboratorFieldValue
  | SingleDocumentLinkFieldValue
  | MultiDocumentLinkFieldValue
  | DateFieldValue
  | PhoneNumberFieldValue
  | EmailFieldValue
  | URLFieldValue
  | NumberFieldValue
  | CurrencyFieldValue
  | CheckboxFieldValue;

export type DocumentID = string;

export interface Document {
  id: DocumentID;
  createdAt: Date;
  updatedAt: Date;
  fields: {
    [fieldID: string]: DocumentFieldValue;
  };
  collectionID: string;
}

export type DocumentsByIDState = { [documentID: string]: Document | undefined };
export const documentsByIDState = atom<DocumentsByIDState>({
  key: RecoilKey.DocumentsByID,
  default: {
    [doc1.id]: doc1,
    [doc2.id]: doc2,
  },
});

export const documentsQuery = selector({
  key: RecoilKey.Documents,
  get: ({ get }) => {
    const documentsByID = get(documentsByIDState);

    return Object.values(documentsByID) as Document[];
  },
});

export const documentQuery = selectorFamily<Document, string>({
  key: RecoilKey.Document,
  get: (documentID: string) => ({ get }) => {
    const documentsByID = get(documentsByIDState);
    const document = documentsByID[documentID];

    if (document === undefined) {
      throw new Error('Document not found');
    }

    return document;
  },
});
