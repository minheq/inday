import { atom, selectorFamily, selector } from 'recoil';

import { FieldType, RecoilKey } from './constants';
import { doc1, doc2 } from './fake_data';

interface SingleLineTextFieldValue {
  type: FieldType.SingleLineText;
  value: string;
}

interface MultiLineTextFieldValue {
  type: FieldType.MultiLineText;
  value: string;
}

interface SingleSelectFieldValue {
  type: FieldType.SingleSelect;
  value: string;
}

interface MultiSelectFieldValue {
  type: FieldType.MultiSelect;
  value: string[];
}

interface CollaboratorValue {
  id: string;
  email: string;
  name: string;
}

interface SingleCollaboratorFieldValue {
  type: FieldType.SingleCollaborator;
  value: CollaboratorValue;
}

interface MultiCollaboratorFieldValue {
  type: FieldType.MultiCollaborator;
  value: CollaboratorValue[];
}

interface DocumentLinkValue {
  id: string;
  email: string;
  name: string;
}

interface SingleDocumentLinkFieldValue {
  type: FieldType.SingleDocumentLink;
  value: DocumentLinkValue;
}

interface MultiDocumentLinkFieldValue {
  type: FieldType.MultiDocumentLink;
  value: DocumentLinkValue[];
}

interface DateFieldValue {
  type: FieldType.Date;
  value: Date;
}

interface PhoneNumberFieldValue {
  type: FieldType.PhoneNumber;
  value: string;
}

interface EmailFieldValue {
  type: FieldType.Email;
  value: string;
}

interface URLFieldValue {
  type: FieldType.URL;
  value: string;
}

interface NumberFieldValue {
  type: FieldType.Number;
  value: number;
}

interface CurrencyFieldValue {
  type: FieldType.Currency;
  value: {
    amount: number;
    currency: string;
  };
}

interface CheckboxFieldValue {
  type: FieldType.Checkbox;
  value: boolean;
}

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

export interface Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fields: {
    [fieldID: string]: DocumentFieldValue;
  };
  collectionID: string;
}

export type DocumentsState = { [id: string]: Document | undefined };
export const documentsState = atom<DocumentsState>({
  key: RecoilKey.Documents,
  default: {
    [doc1.id]: doc1,
    [doc2.id]: doc2,
  },
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
