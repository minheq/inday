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
export type CurrencyFieldValue = number;

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
    [fieldID: string]: DocumentFieldValue | null;
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

export function assertSingleLineTextFieldValue(
  value: DocumentFieldValue | null,
): asserts value is SingleLineTextFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleLineTextFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertMultiLineTextFieldValue(
  value: DocumentFieldValue | null,
): asserts value is MultiLineTextFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected MultiLineTextFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertSingleSelectFieldValue(
  value: DocumentFieldValue | null,
): asserts value is SingleSelectFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleSelectFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertMultiSelectFieldValue(
  value: DocumentFieldValue | null,
): asserts value is MultiSelectFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected MultiSelectFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertSingleCollaboratorFieldValue(
  value: DocumentFieldValue | null,
): asserts value is SingleCollaboratorFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleCollaboratorFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertMultiCollaboratorFieldValue(
  value: DocumentFieldValue | null,
): asserts value is MultiCollaboratorFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected MultiCollaboratorFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertSingleDocumentLinkFieldValue(
  value: DocumentFieldValue | null,
): asserts value is SingleDocumentLinkFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleDocumentLinkFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertMultiDocumentLinkFieldValue(
  value: DocumentFieldValue | null,
): asserts value is MultiDocumentLinkFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected MultiDocumentLinkFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertDateFieldValue(
  value: DocumentFieldValue | null,
): asserts value is DateFieldValue | null {
  if (value === null) {
    return;
  }

  if (!(value instanceof Date)) {
    throw new Error(`Expected DateFieldValue to be Date. Received ${value}`);
  }
}

export function assertPhoneNumberFieldValue(
  value: DocumentFieldValue | null,
): asserts value is PhoneNumberFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected PhoneNumberFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertEmailFieldValue(
  value: DocumentFieldValue | null,
): asserts value is EmailFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected EmailFieldValue to be string. Received ${value}`);
  }
}

export function assertURLFieldValue(
  value: DocumentFieldValue | null,
): asserts value is URLFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected URLFieldValue to be string. Received ${value}`);
  }
}

export function assertNumberFieldValue(
  value: DocumentFieldValue | null,
): asserts value is NumberFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'number') {
    throw new Error(
      `Expected NumberFieldValue to be number. Received ${value}`,
    );
  }
}

export function assertCurrencyFieldValue(
  value: DocumentFieldValue | null,
): asserts value is CurrencyFieldValue | null {
  if (value === null) {
    return;
  }

  if (typeof value !== 'number') {
    throw new Error(
      `Expected CurrencyFieldValue to be number. Received ${value}`,
    );
  }
}

export function assertCheckboxFieldValue(
  value: DocumentFieldValue | null,
): asserts value is CheckboxFieldValue {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Expected CurrencyFieldValue to be boolean. Received ${value}`,
    );
  }
}
