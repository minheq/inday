import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey, FieldType } from './constants';
import { field1, field2 } from './fake_data';
import { CollaboratorID, DocumentID } from './documents';

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
  default: string;
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
  options: CollaboratorID[];
}
export interface SingleCollaboratorField
  extends BaseField,
    SingleCollaboratorFieldConfig {}

export interface MultiCollaboratorFieldConfig {
  type: FieldType.MultiCollaborator;
  options: CollaboratorID[];
}
export interface MultiCollaboratorField
  extends BaseField,
    MultiCollaboratorFieldConfig {}

export interface SingleDocumentLinkFieldConfig {
  type: FieldType.SingleDocumentLink;
  options: DocumentID[];
}
export interface SingleDocumentLinkField
  extends BaseField,
    SingleDocumentLinkFieldConfig {}

export interface MultiDocumentLinkFieldConfig {
  type: FieldType.MultiDocumentLink;
  options: DocumentID[];
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
  default: number;
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
  default: {
    [field1.id]: field1,
    [field2.id]: field2,
  },
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
