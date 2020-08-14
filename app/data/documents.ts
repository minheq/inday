import { CollaboratorID } from './collaborators';

export type CheckboxValue = boolean;
export type CurrencyValue = number | null;
export type DateValue = Date | null;
export type EmailValue = string;
export type MultiCollaboratorValue = CollaboratorID[];
export type MultiDocumentLinkValue = DocumentID[];
export type MultiLineTextValue = string;
export type MultiOptionValue = string[];
export type NumberValue = number | null;
export type PhoneNumberValue = string;
export type SingleCollaboratorValue = CollaboratorID | null;
export type SingleDocumentLinkValue = DocumentID | null;
export type SingleLineTextValue = string;
export type SingleOptionValue = string | null;
export type URLValue = string;

export type BooleanFieldValue = CheckboxValue;
export type DateFieldValue = DateValue;
export type MultiSelectFieldValue =
  | MultiCollaboratorValue
  | MultiDocumentLinkValue
  | MultiOptionValue;
export type NumberFieldValue = CurrencyValue | NumberValue;
export type SingleSelectFieldValue =
  | SingleCollaboratorValue
  | SingleDocumentLinkValue
  | SingleOptionValue;
export type TextFieldValue =
  | EmailValue
  | MultiLineTextValue
  | PhoneNumberValue
  | SingleLineTextValue
  | URLValue;
export type FieldValue =
  | BooleanFieldValue
  | DateFieldValue
  | MultiSelectFieldValue
  | NumberFieldValue
  | SingleSelectFieldValue
  | TextFieldValue;

export type DocumentID = string;

export interface Document {
  id: DocumentID;
  createdAt: Date;
  updatedAt: Date;
  fields: {
    [fieldID: string]: FieldValue;
  };
  collectionID: string;
}

export function assertCheckboxFieldValue(
  value: FieldValue,
): asserts value is CheckboxValue {
  if (typeof value !== 'boolean') {
    throw new Error(`Expected CurrencyValue to be boolean. Received ${value}`);
  }
}

export function assertCurrencyFieldValue(
  value: FieldValue,
): asserts value is CurrencyValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'number') {
    throw new Error(`Expected CurrencyValue to be number. Received ${value}`);
  }
}

export function assertDateValue(value: FieldValue): asserts value is DateValue {
  if (value === null) {
    return;
  }

  if (!(value instanceof Date)) {
    throw new Error(`Expected DateValue to be Date. Received ${value}`);
  }
}

export function assertEmailFieldValue(
  value: FieldValue,
): asserts value is EmailValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected EmailValue to be string. Received ${value}`);
  }
}

export function assertMultiCollaboratorFieldValue(
  value: FieldValue,
): asserts value is MultiCollaboratorValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiCollaboratorFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertMultiDocumentLinkFieldValue(
  value: FieldValue,
): asserts value is MultiDocumentLinkValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiDocumentLinkFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertMultiLineTextFieldValue(
  value: FieldValue,
): asserts value is MultiLineTextValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected MultiLineTextFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertMultiOptionFieldValue(
  value: FieldValue,
): asserts value is MultiOptionValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiOptionFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertNumberValue(
  value: FieldValue,
): asserts value is NumberValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'number') {
    throw new Error(
      `Expected NumberFieldValue to be number. Received ${value}`,
    );
  }
}

export function assertPhoneNumberFieldValue(
  value: FieldValue,
): asserts value is PhoneNumberValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected PhoneNumberFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertSingleCollaboratorFieldValue(
  value: FieldValue,
): asserts value is SingleCollaboratorValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleCollaboratorFieldValue to be string. Received ${value}`,
    );
  }
}
export function assertSingleDocumentLinkFieldValue(
  value: FieldValue,
): asserts value is SingleDocumentLinkValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleDocumentLinkFieldValue to be string. Received ${value}`,
    );
  }
}
export function assertSingleLineTextFieldValue(
  value: FieldValue,
): asserts value is SingleLineTextValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleLineTextFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertSingleOptionFieldValue(
  value: FieldValue,
): asserts value is SingleOptionValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleOptionFieldValue to be string. Received ${value}`,
    );
  }
}

export function assertURLFieldValue(
  value: FieldValue,
): asserts value is URLValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected URLFieldValue to be string. Received ${value}`);
  }
}

export function assertBooleanFieldValue(
  value: FieldValue,
): asserts value is BooleanFieldValue {
  if (typeof value !== 'boolean') {
    throw new Error(`Expected BooleanFieldValue. Received ${value}`);
  }
}

export function assertDateFieldValue(
  value: FieldValue,
): asserts value is DateFieldValue {
  if (value !== null && !((value as any) instanceof Date)) {
    throw new Error(`Expected DateFieldValue. Received ${value}`);
  }
}

export function assertMultiSelectFieldValue(
  value: FieldValue,
): asserts value is MultiSelectFieldValue {
  if (Array.isArray(value) === false) {
    throw new Error(`Expected MultiSelectFieldValue. Received ${value}`);
  }
}

export function assertNumberFieldValue(
  value: FieldValue,
): asserts value is NumberFieldValue {
  if (value !== null && typeof value !== 'number') {
    throw new Error(`Expected NumberFieldValue. Received ${value}`);
  }
}

export function assertSingleSelectFieldValue(
  value: FieldValue,
): asserts value is SingleSelectFieldValue {
  if (value !== null && typeof value !== 'string') {
    throw new Error(`Expected SingleSelectFieldValue. Received ${value}`);
  }
}

export function assertTextFieldValue(
  value: FieldValue,
): asserts value is TextFieldValue {
  if (typeof value !== 'string') {
    throw new Error(`Expected TextFieldValue. Received ${value}`);
  }
}
