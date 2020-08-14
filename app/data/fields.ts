export type FieldID = string;

export enum FieldType {
  SingleLineText = 'SingleLineText',
  MultiLineText = 'MultiLineText',
  SingleOption = 'SingleOption',
  MultiOption = 'MultiOption',
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

export interface BaseField {
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
  order: number;
}

export interface SingleOptionFieldConfig {
  type: FieldType.SingleOption;
  options: SelectOption[];
}
export interface SingleOptionField extends BaseField, SingleOptionFieldConfig {}

export interface MultiOptionFieldConfig {
  type: FieldType.MultiOption;
  options: SelectOption[];
}
export interface MultiOptionField extends BaseField, MultiOptionFieldConfig {}

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
  | CheckboxFieldConfig
  | CurrencyFieldConfig
  | DateFieldConfig
  | EmailFieldConfig
  | MultiCollaboratorFieldConfig
  | MultiDocumentLinkFieldConfig
  | MultiLineTextFieldConfig
  | MultiOptionFieldConfig
  | NumberFieldConfig
  | PhoneNumberFieldConfig
  | SingleCollaboratorFieldConfig
  | SingleDocumentLinkFieldConfig
  | SingleLineTextFieldConfig
  | SingleOptionFieldConfig
  | URLFieldConfig;

export type Field =
  | CheckboxField
  | CurrencyField
  | DateField
  | EmailField
  | MultiCollaboratorField
  | MultiDocumentLinkField
  | MultiLineTextField
  | MultiOptionField
  | NumberField
  | PhoneNumberField
  | SingleCollaboratorField
  | SingleDocumentLinkField
  | SingleLineTextField
  | SingleOptionField
  | URLField;

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

export function assertSingleOptionField(
  field: Field,
): asserts field is SingleOptionField {
  if (field.type !== FieldType.SingleOption) {
    throw new Error(
      `Expected field to be SingleOptionField. Received ${field.type}`,
    );
  }
}

export function assertMultiOptionField(
  field: Field,
): asserts field is MultiOptionField {
  if (field.type !== FieldType.MultiOption) {
    throw new Error(
      `Expected field to be MultiOptionField. Received ${field.type}`,
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
