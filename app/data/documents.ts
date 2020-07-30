import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

interface SingleLineTextFieldValue {
  type: 'singleLineText';
  value: string;
}

interface MultiLineTextFieldValue {
  type: 'multiLineText';
  value: string;
}

interface SingleSelectFieldValue {
  type: 'singleSelect';
  value: string;
}

interface MultiSelectFieldValue {
  type: 'multiSelect';
  value: string[];
}

interface CollaboratorValue {
  id: string;
  email: string;
  name: string;
}

interface SingleCollaboratorFieldValue {
  type: 'singleCollaborator';
  value: CollaboratorValue;
}

interface MultiCollaboratorFieldValue {
  type: 'multiCollaborator';
  value: CollaboratorValue[];
}

interface DocumentLinkValue {
  id: string;
  email: string;
  name: string;
}

interface SingleDocumentLinkFieldValue {
  type: 'singleDocumentLink';
  value: DocumentLinkValue;
}

interface MultiDocumentLinkFieldValue {
  type: 'multiDocumentLink';
  value: DocumentLinkValue[];
}

interface DateFieldValue {
  type: 'date';
  value: Date;
}

interface PhoneNumberFieldValue {
  type: 'phoneNumber';
  value: string;
}

interface EmailFieldValue {
  type: 'email';
  value: string;
}

interface URLFieldValue {
  type: 'url';
  value: string;
}

interface NumberFieldValue {
  type: 'number';
  value: number;
}

interface CurrencyFieldValue {
  type: 'currency';
  value: {
    amount: number;
    currency: string;
  };
}

interface CheckboxFieldValue {
  type: 'checkbox';
  value: boolean;
}

export interface Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
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
