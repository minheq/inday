import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

interface SingleLineTextField {
  type: 'singleLineText';
}

interface MultiLineTextField {
  type: 'multiLineText';
}

interface SingleSelectField {
  type: 'singleSelect';
}

interface MultiSelectField {
  type: 'multiSelect';
}

interface SingleCollaboratorField {
  type: 'singleCollaborator';
}

interface MultiCollaboratorField {
  type: 'multiCollaborator';
}

interface SingleDocumentLinkField {
  type: 'singleDocumentLink';
}

interface MultiDocumentLinkField {
  type: 'multiDocumentLink';
}

interface DateField {
  type: 'date';
}

interface PhoneNumberField {
  type: 'phoneNumber';
}

interface EmailField {
  type: 'email';
}

interface URLField {
  type: 'url';
}

interface NumberField {
  type: 'number';
}

interface CurrencyField {
  type: 'currency';
}

interface CheckboxField {
  type: 'checkbox';
}

interface FieldMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

export type BaseField =
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

export type FieldType = BaseField['type'];
export type Field = BaseField & FieldMetadata;

export type FieldsState = { [id: string]: Field | undefined };
export const fieldsState = atom<FieldsState>({
  key: RecoilKey.Fields,
  default: {},
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
