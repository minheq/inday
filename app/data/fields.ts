import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey, FieldType } from './constants';
import { fieldsByIDFixtures } from './fixtures';

export type FieldID = string;

interface BaseField {
  id: FieldID;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

export interface SingleLineTextFieldConfig {
  type: FieldType.SingleLineText;
  default: string | null;
}
export interface SingleLineTextField
  extends BaseField,
    SingleLineTextFieldConfig {}

export interface MultiLineTextFieldConfig {
  type: FieldType.MultiLineText;
  richText: boolean;
}
export interface MultiLineTextField
  extends BaseField,
    MultiLineTextFieldConfig {}

interface SelectOption {
  value: string;
  color: string;
}

export interface SingleSelectFieldConfig {
  type: FieldType.SingleSelect;
  options: SelectOption[];
  order: string[];
}
export interface SingleSelectField extends BaseField, SingleSelectFieldConfig {}

export interface MultiSelectFieldConfig {
  type: FieldType.MultiSelect;
  options: SelectOption[];
  order: string[];
}
export interface MultiSelectField extends BaseField, MultiSelectFieldConfig {}

export interface SingleCollaboratorFieldConfig {
  type: FieldType.SingleCollaborator;
}
export interface SingleCollaboratorField
  extends BaseField,
    SingleCollaboratorFieldConfig {}

export interface MultiCollaboratorFieldConfig {
  type: FieldType.MultiCollaborator;
}
export interface MultiCollaboratorField
  extends BaseField,
    MultiCollaboratorFieldConfig {}

export interface SingleDocumentLinkFieldConfig {
  type: FieldType.SingleDocumentLink;
  documentsFromCollectionID: string;
}
export interface SingleDocumentLinkField
  extends BaseField,
    SingleDocumentLinkFieldConfig {}

export interface MultiDocumentLinkFieldConfig {
  type: FieldType.MultiDocumentLink;
  documentsFromCollectionID: string;
}
export interface MultiDocumentLinkField
  extends BaseField,
    MultiDocumentLinkFieldConfig {}

export interface DateFieldConfig {
  type: FieldType.Date;
  format: string;
  includeTime: boolean;
  timeFormat: '12hour' | '24hour';
}
export interface DateField extends BaseField, DateFieldConfig {}

export interface PhoneNumberFieldConfig {
  type: FieldType.PhoneNumber;
}
export interface PhoneNumberField extends BaseField, PhoneNumberFieldConfig {}

export interface EmailFieldConfig {
  type: FieldType.Email;
}
export interface EmailField extends BaseField, EmailFieldConfig {}

export interface URLFieldConfig {
  type: FieldType.URL;
}
export interface URLField extends BaseField, URLFieldConfig {}

export interface DecimalFieldConfig {
  type: FieldType.Number;
  default: number;
  format: 'decimal';
  precision: number;
}
export interface IntegerFieldConfig {
  type: FieldType.Number;
  default: number | null;
  format: 'integer';
}
export type NumberFieldConfig = DecimalFieldConfig | IntegerFieldConfig;
export type NumberField = BaseField & NumberFieldConfig;

export interface CurrencyFieldConfig {
  type: FieldType.Currency;
  currency: string;
  precision: number;
  allowNegative: boolean;
}
export interface CurrencyField extends BaseField, CurrencyFieldConfig {}

export interface CheckboxFieldConfig {
  type: FieldType.Checkbox;
  emoji: string;
}
export interface CheckboxField extends BaseField, CheckboxFieldConfig {}

export type FieldConfig =
  | SingleLineTextFieldConfig
  | MultiLineTextFieldConfig
  | SingleSelectFieldConfig
  | MultiSelectFieldConfig
  | SingleCollaboratorFieldConfig
  | MultiCollaboratorFieldConfig
  | SingleDocumentLinkFieldConfig
  | MultiDocumentLinkFieldConfig
  | DateFieldConfig
  | PhoneNumberFieldConfig
  | EmailFieldConfig
  | URLFieldConfig
  | NumberFieldConfig
  | CurrencyFieldConfig
  | CheckboxFieldConfig;

export type Field =
  | SingleLineTextField
  | MultiLineTextField
  | SingleSelectField
  | MultiSelectField
  | SingleCollaboratorField
  | MultiCollaboratorField
  | SingleDocumentLinkField
  | MultiDocumentLinkField
  | DateField
  | PhoneNumberField
  | EmailField
  | URLField
  | NumberField
  | CurrencyField
  | CheckboxField;

export type FieldsByIDState = { [fieldID: string]: Field | undefined };
export const fieldsByIDState = atom<FieldsByIDState>({
  key: RecoilKey.FieldsByID,
  default: fieldsByIDFixtures,
});

export const fieldsQuery = selector({
  key: RecoilKey.Fields,
  get: ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    return Object.values(fieldsByID) as Field[];
  },
});

export const fieldQuery = selectorFamily<Field, string>({
  key: RecoilKey.Field,
  get: (fieldID: string) => ({ get }) => {
    const fieldsByID = get(fieldsByIDState);
    const field = fieldsByID[fieldID];

    if (field === undefined) {
      throw new Error('Field not found');
    }

    return field;
  },
});

export function assertSingleLineTextField(
  field: Field,
): asserts field is SingleLineTextField {
  if (field.type !== FieldType.SingleLineText) {
    throw new Error(
      `Expected field to be SingleLineTextField. Received ${field.type}`,
    );
  }
}

export function assertMultiLineTextField(
  field: Field,
): asserts field is MultiLineTextField {
  if (field.type !== FieldType.MultiLineText) {
    throw new Error(
      `Expected field to be MultiLineTextField. Received ${field.type}`,
    );
  }
}

export function assertSingleSelectField(
  field: Field,
): asserts field is SingleSelectField {
  if (field.type !== FieldType.SingleSelect) {
    throw new Error(
      `Expected field to be SingleSelectField. Received ${field.type}`,
    );
  }
}

export function assertMultiSelectField(
  field: Field,
): asserts field is MultiSelectField {
  if (field.type !== FieldType.MultiSelect) {
    throw new Error(
      `Expected field to be MultiSelectField. Received ${field.type}`,
    );
  }
}

export function assertSingleCollaboratorField(
  field: Field,
): asserts field is SingleCollaboratorField {
  if (field.type !== FieldType.SingleCollaborator) {
    throw new Error(
      `Expected field to be SingleCollaboratorField. Received ${field.type}`,
    );
  }
}

export function assertMultiCollaboratorField(
  field: Field,
): asserts field is MultiCollaboratorField {
  if (field.type !== FieldType.MultiCollaborator) {
    throw new Error(
      `Expected field to be MultiCollaboratorField. Received ${field.type}`,
    );
  }
}

export function assertSingleDocumentLinkField(
  field: Field,
): asserts field is SingleDocumentLinkField {
  if (field.type !== FieldType.SingleDocumentLink) {
    throw new Error(
      `Expected field to be SingleDocumentLinkField. Received ${field.type}`,
    );
  }
}

export function assertMultiDocumentLinkField(
  field: Field,
): asserts field is MultiDocumentLinkField {
  if (field.type !== FieldType.MultiDocumentLink) {
    throw new Error(
      `Expected field to be MultiDocumentLinkField. Received ${field.type}`,
    );
  }
}

export function assertDateField(field: Field): asserts field is DateField {
  if (field.type !== FieldType.Date) {
    throw new Error(`Expected field to be DateField. Received ${field.type}`);
  }
}

export function assertPhoneNumberField(
  field: Field,
): asserts field is PhoneNumberField {
  if (field.type !== FieldType.PhoneNumber) {
    throw new Error(
      `Expected field to be PhoneNumberField. Received ${field.type}`,
    );
  }
}

export function assertEmailField(field: Field): asserts field is EmailField {
  if (field.type !== FieldType.Email) {
    throw new Error(`Expected field to be EmailField. Received ${field.type}`);
  }
}

export function assertURLField(field: Field): asserts field is URLField {
  if (field.type !== FieldType.URL) {
    throw new Error(`Expected field to be URLField. Received ${field.type}`);
  }
}

export function assertNumberField(field: Field): asserts field is NumberField {
  if (field.type !== FieldType.Number) {
    throw new Error(`Expected field to be NumberField. Received ${field.type}`);
  }
}

export function assertCurrencyField(
  field: Field,
): asserts field is CurrencyField {
  if (field.type !== FieldType.Currency) {
    throw new Error(
      `Expected field to be CurrencyField. Received ${field.type}`,
    );
  }
}

export function assertCheckboxField(
  field: Field,
): asserts field is CheckboxField {
  if (field.type !== FieldType.Checkbox) {
    throw new Error(
      `Expected field to be CheckboxField. Received ${field.type}`,
    );
  }
}
