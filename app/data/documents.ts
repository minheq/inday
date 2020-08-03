import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { documentsByIDFixtures } from './fixtures';
import { CollaboratorID } from './collaborators';

export type SingleLineTextFieldValue = string;
export type MultiLineTextFieldValue = string;
export type SingleSelectFieldValue = string | null;
export type MultiSelectFieldValue = string[];
export type SingleCollaboratorFieldValue = CollaboratorID | null;
export type MultiCollaboratorFieldValue = CollaboratorID[];
export type SingleDocumentLinkFieldValue = DocumentID | null;
export type MultiDocumentLinkFieldValue = DocumentID[];
export type DateFieldValue = Date | null;
export type PhoneNumberFieldValue = string;
export type EmailFieldValue = string;
export type URLFieldValue = string;
export type NumberFieldValue = number | null;
export type CurrencyFieldValue = number | null;

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
  default: documentsByIDFixtures,
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
  value: DocumentFieldValue,
): asserts value is SingleLineTextFieldValue {
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
  value: DocumentFieldValue,
): asserts value is MultiLineTextFieldValue {
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
  value: DocumentFieldValue,
): asserts value is SingleSelectFieldValue {
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
  value: DocumentFieldValue,
): asserts value is MultiSelectFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiSelectFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertSingleCollaboratorFieldValue(
  value: DocumentFieldValue,
): asserts value is SingleCollaboratorFieldValue {
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
  value: DocumentFieldValue,
): asserts value is MultiCollaboratorFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiCollaboratorFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertSingleDocumentLinkFieldValue(
  value: DocumentFieldValue,
): asserts value is SingleDocumentLinkFieldValue {
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
  value: DocumentFieldValue,
): asserts value is MultiDocumentLinkFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiDocumentLinkFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertDateFieldValue(
  value: DocumentFieldValue,
): asserts value is DateFieldValue {
  if (value === null) {
    return;
  }

  if (!(value instanceof Date)) {
    throw new Error(`Expected DateFieldValue to be Date. Received ${value}`);
  }
}

export function assertPhoneNumberFieldValue(
  value: DocumentFieldValue,
): asserts value is PhoneNumberFieldValue {
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
  value: DocumentFieldValue,
): asserts value is EmailFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected EmailFieldValue to be string. Received ${value}`);
  }
}

export function assertURLFieldValue(
  value: DocumentFieldValue,
): asserts value is URLFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected URLFieldValue to be string. Received ${value}`);
  }
}

export function assertNumberFieldValue(
  value: DocumentFieldValue,
): asserts value is NumberFieldValue {
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
  value: DocumentFieldValue,
): asserts value is CurrencyFieldValue {
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
  value: DocumentFieldValue,
): asserts value is CheckboxFieldValue {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Expected CurrencyFieldValue to be boolean. Received ${value}`,
    );
  }
}
