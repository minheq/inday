import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

interface BaseField {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

interface SingleLineTextField extends BaseField {
  type: 'singleLineText';
}

interface MultiLineTextField extends BaseField {
  type: 'multiLineText';
}

interface SingleSelectField extends BaseField {
  type: 'singleSelect';
}

interface MultiSelectField extends BaseField {
  type: 'multiSelect';
}

interface SingleCollaboratorField extends BaseField {
  type: 'singleCollaborator';
}

interface MultiCollaboratorField extends BaseField {
  type: 'multiCollaborator';
}

interface SingleDocumentLinkField extends BaseField {
  type: 'singleDocumentLink';
}

interface MultiDocumentLinkField extends BaseField {
  type: 'multiDocumentLink';
}

interface DateField extends BaseField {
  type: 'date';
}

interface PhoneNumberField extends BaseField {
  type: 'phoneNumber';
}

interface EmailField extends BaseField {
  type: 'email';
}

interface URLField extends BaseField {
  type: 'url';
}

interface NumberField extends BaseField {
  type: 'number';
}

interface CurrencyField extends BaseField {
  type: 'currency';
}

interface CheckboxField extends BaseField {
  type: 'checkbox';
}

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
export type FieldType = Field['type'];

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
