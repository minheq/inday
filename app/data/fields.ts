import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { field1, field2 } from './fake_data';

export enum FieldType {
  SingleLineText = 'SingleLineText',
  MultiLineText = 'MultiLineText',
  SingleSelect = 'SingleSelect',
  MultiSelect = 'MultiSelect',
  SingleCollaborator = 'SingleCollaborator',
  MultiCollaborator = 'MultiCollaborator',
  SingleDocumentLink = 'SingleDocumentLink',
  MultiDocumentLink = 'MultiDocumentLink',
  Date = 'Date',
  PhoneNumber = 'PhoneNumber',
  Email = 'Email',
  URL = 'URL',
  Number = 'Number',
  Currency = 'Currency',
  Checkbox = 'Checkbox',
}

interface BaseField {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

export interface SingleLineTextFieldConfig {
  type: FieldType.SingleLineText;
}
export interface SingleLineTextField
  extends BaseField,
    SingleLineTextFieldConfig {}

export interface MultiLineTextFieldConfig {
  type: FieldType.MultiLineText;
}
export interface MultiLineTextField
  extends BaseField,
    MultiLineTextFieldConfig {}

export interface SingleSelectFieldConfig {
  type: FieldType.SingleSelect;
}
export interface SingleSelectField extends BaseField, SingleSelectFieldConfig {}

export interface MultiSelectFieldConfig {
  type: FieldType.MultiSelect;
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
}
export interface SingleDocumentLinkField
  extends BaseField,
    SingleDocumentLinkFieldConfig {}

export interface MultiDocumentLinkFieldConfig {
  type: FieldType.MultiDocumentLink;
}
export interface MultiDocumentLinkField
  extends BaseField,
    MultiDocumentLinkFieldConfig {}

export interface DateFieldConfig {
  type: FieldType.Date;
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

export interface NumberFieldConfig {
  type: FieldType.Number;
}
export interface NumberField extends BaseField, NumberFieldConfig {}

export interface CurrencyFieldConfig {
  type: FieldType.Currency;
}
export interface CurrencyField extends BaseField, CurrencyFieldConfig {}

export interface CheckboxFieldConfig {
  type: FieldType.Checkbox;
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

export type FieldsState = { [id: string]: Field | undefined };
export const fieldsState = atom<FieldsState>({
  key: RecoilKey.Fields,
  default: {
    [field1.id]: field1,
    [field2.id]: field2,
  },
});

export const fieldListQuery = selector({
  key: RecoilKey.FieldList,
  get: ({ get }) => {
    const fields = get(fieldsState);

    return Object.values(fields) as Field[];
  },
});

export const fieldQuery = selectorFamily<Field | null, string>({
  key: RecoilKey.Field,
  get: (fieldID: string) => ({ get }) => {
    const fields = get(fieldsState);
    const field = fields[fieldID];

    if (field === undefined) {
      return null;
    }

    return field;
  },
});
