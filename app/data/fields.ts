import { isSameDay } from 'date-fns';
import { hasAllOf } from '../../lib/js_utils/array_utils';
import { CollaboratorID } from './collaborators';
import { RecordID } from './records';

export type FieldID = string;

export enum FieldType {
  Checkbox = 'Checkbox',
  Currency = 'Currency',
  Date = 'Date',
  Email = 'Email',
  MultiCollaborator = 'MultiCollaborator',
  MultiLineText = 'MultiLineText',
  MultiOption = 'MultiOption',
  MultiRecordLink = 'MultiRecordLink',
  Number = 'Number',
  PhoneNumber = 'PhoneNumber',
  SingleCollaborator = 'SingleCollaborator',
  SingleLineText = 'SingleLineText',
  SingleOption = 'SingleOption',
  SingleRecordLink = 'SingleRecordLink',
  URL = 'URL',
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

export interface SingleRecordLinkFieldConfig {
  type: FieldType.SingleRecordLink;
  recordsFromCollectionID: string;
}
export interface SingleRecordLinkField
  extends BaseField,
    SingleRecordLinkFieldConfig {}

export interface MultiRecordLinkFieldConfig {
  type: FieldType.MultiRecordLink;
  recordsFromCollectionID: string;
}
export interface MultiRecordLinkField
  extends BaseField,
    MultiRecordLinkFieldConfig {}

export interface DateOnlyFieldConfig {
  type: FieldType.Date;
  style: 'date';
  format: string;
}
export interface DateAndTimeFieldConfig {
  type: FieldType.Date;
  format: 'time';
  /** Use same time zone for all collaborators */
  uniform: boolean;
  hourCycle: 'h12' | 'h23' | 'h11' | 'h24';
}

export type DateFieldConfig = DateOnlyFieldConfig | DateAndTimeFieldConfig;
export type DateField = BaseField & DateFieldConfig;

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

export interface UnitFieldConfig {
  type: FieldType.Number;
  default: number;
  style: 'unit';
  unit:
    | 'acre'
    | 'bit'
    | 'byte'
    | 'celsius'
    | 'centimeter'
    | 'day'
    | 'degree'
    | 'fahrenheit'
    | 'fluid-ounce'
    | 'foot'
    | 'gallon'
    | 'gigabit'
    | 'gigabyte'
    | 'gram'
    | 'hectare'
    | 'hour'
    | 'inch'
    | 'kilobit'
    | 'kilobyte'
    | 'kilogram'
    | 'kilometer'
    | 'liter'
    | 'megabit'
    | 'megabyte'
    | 'meter'
    | 'mile'
    | 'mile-scandinavian'
    | 'milliliter'
    | 'millimeter'
    | 'millisecond'
    | 'minute'
    | 'month'
    | 'ounce'
    | 'percent'
    | 'petabyte'
    | 'pound'
    | 'second'
    | 'stone'
    | 'terabit'
    | 'terabyte'
    | 'week'
    | 'yard'
    | 'year';
}
export interface DecimalFieldConfig {
  type: FieldType.Number;
  default: number;
  style: 'decimal';
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}
export interface IntegerFieldConfig {
  type: FieldType.Number;
  default: number | null;
  format: 'integer';
}
export type NumberFieldConfig =
  | DecimalFieldConfig
  | IntegerFieldConfig
  | UnitFieldConfig;
export type NumberField = BaseField & NumberFieldConfig;

export interface CurrencyFieldConfig {
  type: FieldType.Currency;
  currency: string;
}
export interface CurrencyField extends BaseField, CurrencyFieldConfig {}

export interface CheckboxFieldConfig {
  type: FieldType.Checkbox;
  emoji: string;
  color: string;
}
export interface CheckboxField extends BaseField, CheckboxFieldConfig {}

export type FieldConfig =
  | CheckboxFieldConfig
  | CurrencyFieldConfig
  | DateFieldConfig
  | EmailFieldConfig
  | MultiCollaboratorFieldConfig
  | MultiRecordLinkFieldConfig
  | MultiLineTextFieldConfig
  | MultiOptionFieldConfig
  | NumberFieldConfig
  | PhoneNumberFieldConfig
  | SingleCollaboratorFieldConfig
  | SingleRecordLinkFieldConfig
  | SingleLineTextFieldConfig
  | SingleOptionFieldConfig
  | URLFieldConfig;

export type BooleanFieldKind = CheckboxField;
export type DateFieldKind = DateField;
export type MultiSelectFieldKind =
  | MultiCollaboratorField
  | MultiRecordLinkField
  | MultiOptionField;
export type NumberFieldKind = CurrencyField | NumberField;
export type SingleSelectFieldKind =
  | SingleCollaboratorField
  | SingleRecordLinkField
  | SingleOptionField;
export type TextFieldKind =
  | EmailField
  | MultiLineTextField
  | PhoneNumberField
  | SingleLineTextField
  | URLField;

export type Field =
  | BooleanFieldKind
  | DateFieldKind
  | MultiSelectFieldKind
  | NumberFieldKind
  | SingleSelectFieldKind
  | TextFieldKind;

export type CheckboxFieldValue = boolean;
export type CurrencyFieldValue = number | null;
export type DateFieldValue = Date | null;
export type EmailFieldValue = string;
export type MultiCollaboratorFieldValue = CollaboratorID[];
export type MultiRecordLinkFieldValue = RecordID[];
export type MultiLineTextFieldValue = string;
export type MultiOptionFieldValue = string[];
export type NumberFieldValue = number | null;
export type PhoneNumberFieldValue = string;
export type SingleCollaboratorFieldValue = CollaboratorID | null;
export type SingleRecordLinkFieldValue = RecordID | null;
export type SingleLineTextFieldValue = string;
export type SingleOptionFieldValue = string | null;
export type URLFieldValue = string;

export type BooleanFieldKindValue = CheckboxFieldValue;
export type DateFieldKindValue = DateFieldValue;
export type MultiSelectFieldKindValue =
  | MultiCollaboratorFieldValue
  | MultiRecordLinkFieldValue
  | MultiOptionFieldValue;
export type NumberFieldKindValue = CurrencyFieldValue | NumberFieldValue;
export type SingleSelectFieldKindValue =
  | SingleCollaboratorFieldValue
  | SingleRecordLinkFieldValue
  | SingleOptionFieldValue;
export type TextFieldKindValue =
  | EmailFieldValue
  | MultiLineTextFieldValue
  | PhoneNumberFieldValue
  | SingleLineTextFieldValue
  | URLFieldValue;

export type FieldValue =
  | BooleanFieldKindValue
  | DateFieldKindValue
  | MultiSelectFieldKindValue
  | NumberFieldKindValue
  | SingleSelectFieldKindValue
  | TextFieldKindValue;

export interface FieldTypeToFieldValue {
  [FieldType.Checkbox]: CheckboxFieldValue;
  [FieldType.Currency]: CurrencyFieldValue;
  [FieldType.Date]: DateFieldValue;
  [FieldType.Email]: EmailFieldValue;
  [FieldType.MultiCollaborator]: MultiCollaboratorFieldValue;
  [FieldType.MultiLineText]: MultiLineTextFieldValue;
  [FieldType.MultiOption]: MultiOptionFieldValue;
  [FieldType.MultiRecordLink]: MultiRecordLinkFieldValue;
  [FieldType.Number]: NumberFieldValue;
  [FieldType.PhoneNumber]: PhoneNumberFieldValue;
  [FieldType.SingleCollaborator]: SingleCollaboratorFieldValue;
  [FieldType.SingleLineText]: SingleLineTextFieldValue;
  [FieldType.SingleOption]: SingleOptionFieldValue;
  [FieldType.SingleRecordLink]: SingleRecordLinkFieldValue;
  [FieldType.URL]: URLFieldValue;
}

export interface FieldTypeToField {
  [FieldType.Checkbox]: CheckboxField;
  [FieldType.Currency]: CurrencyField;
  [FieldType.Date]: DateField;
  [FieldType.Email]: EmailField;
  [FieldType.MultiCollaborator]: MultiCollaboratorField;
  [FieldType.MultiLineText]: MultiLineTextField;
  [FieldType.MultiOption]: MultiOptionField;
  [FieldType.MultiRecordLink]: MultiRecordLinkField;
  [FieldType.Number]: NumberField;
  [FieldType.PhoneNumber]: PhoneNumberField;
  [FieldType.SingleCollaborator]: SingleCollaboratorField;
  [FieldType.SingleLineText]: SingleLineTextField;
  [FieldType.SingleOption]: SingleOptionField;
  [FieldType.SingleRecordLink]: SingleRecordLinkField;
  [FieldType.URL]: URLField;
}

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

export function assertSingleRecordLinkField(
  field: Field,
): asserts field is SingleRecordLinkField {
  if (field.type !== FieldType.SingleRecordLink) {
    throw new Error(
      `Expected field to be SingleRecordLinkField. Received ${field.type}`,
    );
  }
}

export function assertMultiRecordLinkField(
  field: Field,
): asserts field is MultiRecordLinkField {
  if (field.type !== FieldType.MultiRecordLink) {
    throw new Error(
      `Expected field to be MultiRecordLinkField. Received ${field.type}`,
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

export function assertCheckboxFieldValue(
  value: FieldValue,
): asserts value is CheckboxFieldValue {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Expected CheckboxFieldValue to be boolean. Received ${value}`,
    );
  }
}

export function assertCurrencyFieldValue(
  value: FieldValue,
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

export function assertDateFieldValue(
  value: FieldValue,
): asserts value is DateFieldValue {
  if (value === null) {
    return;
  }

  if (!(value instanceof Date)) {
    throw new Error(`Expected DateFieldValue to be Date. Received ${value}`);
  }
}

export function assertEmailFieldValue(
  value: FieldValue,
): asserts value is EmailFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected EmailFieldValue to be string. Received ${value}`);
  }
}

export function assertMultiCollaboratorFieldValue(
  value: FieldValue,
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

export function assertMultiRecordLinkFieldValue(
  value: FieldValue,
): asserts value is MultiRecordLinkFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiRecordLinkFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertMultiLineTextFieldValue(
  value: FieldValue,
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

export function assertMultiOptionFieldValue(
  value: FieldValue,
): asserts value is MultiOptionFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiOptionFieldValue to be string[]. Received ${value}`,
    );
  }
}

export function assertNumberFieldValue(
  value: FieldValue,
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

export function assertPhoneNumberFieldValue(
  value: FieldValue,
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

export function assertSingleCollaboratorFieldValue(
  value: FieldValue,
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
export function assertSingleRecordLinkFieldValue(
  value: FieldValue,
): asserts value is SingleRecordLinkFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleRecordLinkFieldValue to be string. Received ${value}`,
    );
  }
}
export function assertSingleLineTextFieldValue(
  value: FieldValue,
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

export function assertSingleOptionFieldValue(
  value: FieldValue,
): asserts value is SingleOptionFieldValue {
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
): asserts value is URLFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected URLFieldValue to be string. Received ${value}`);
  }
}

export function assertBooleanFieldKindValue(
  value: FieldValue,
): asserts value is BooleanFieldKindValue {
  if (typeof value !== 'boolean') {
    throw new Error(`Expected BooleanFieldKindValue. Received ${value}`);
  }
}

export function assertDateFieldKindValue(
  value: FieldValue,
): asserts value is DateFieldKindValue {
  if (value !== null && !(value instanceof Date)) {
    throw new Error(`Expected DateFieldKindValue. Received ${value}`);
  }
}

export function assertMultiSelectFieldKindValue(
  value: FieldValue,
): asserts value is MultiSelectFieldKindValue {
  if (Array.isArray(value) === false) {
    throw new Error(`Expected MultiSelectFieldKindValue. Received ${value}`);
  }
}

export function assertNumberFieldKindValue(
  value: FieldValue,
): asserts value is NumberFieldKindValue {
  if (value !== null && typeof value !== 'number') {
    throw new Error(`Expected NumberFieldKindValue. Received ${value}`);
  }
}

export function assertSingleSelectFieldKindValue(
  value: FieldValue,
): asserts value is SingleSelectFieldKindValue {
  if (value !== null && typeof value !== 'string') {
    throw new Error(`Expected SingleSelectFieldKindValue. Received ${value}`);
  }
}

export function assertTextFieldKindValue(
  value: FieldValue,
): asserts value is TextFieldKindValue {
  if (typeof value !== 'string') {
    throw new Error(`Expected TextFieldKindValue. Received ${value}`);
  }
}

export function areFieldValuesEqual(
  fieldType: FieldType,
  a: FieldValue,
  b: FieldValue,
): boolean {
  const checkEquality = equalityCheckerByFieldType[fieldType];

  return checkEquality(a, b);
}

const equalityCheckerByFieldType: {
  [fieldType in FieldType]: (a: FieldValue, b: FieldValue) => boolean;
} = {
  [FieldType.Checkbox]: areBooleanFieldKindValueEqual,
  [FieldType.Currency]: areNumberFieldKindValueEqual,
  [FieldType.Date]: areDateFieldKindValueEqual,
  [FieldType.Email]: areTextFieldKindValueEqual,
  [FieldType.MultiCollaborator]: areMultiSelectFieldKindValueEqual,
  [FieldType.MultiRecordLink]: areMultiSelectFieldKindValueEqual,
  [FieldType.MultiLineText]: areTextFieldKindValueEqual,
  [FieldType.MultiOption]: areMultiSelectFieldKindValueEqual,
  [FieldType.Number]: areNumberFieldKindValueEqual,
  [FieldType.PhoneNumber]: areTextFieldKindValueEqual,
  [FieldType.SingleCollaborator]: areSingleSelectFieldKindValueEqual,
  [FieldType.SingleRecordLink]: areSingleSelectFieldKindValueEqual,
  [FieldType.SingleLineText]: areTextFieldKindValueEqual,
  [FieldType.SingleOption]: areSingleSelectFieldKindValueEqual,
  [FieldType.URL]: areTextFieldKindValueEqual,
};

function areTextFieldKindValueEqual(a: FieldValue, b: FieldValue) {
  assertTextFieldKindValue(a);
  assertTextFieldKindValue(b);

  return a === b;
}

function areNumberFieldKindValueEqual(a: FieldValue, b: FieldValue) {
  assertNumberFieldKindValue(a);
  assertNumberFieldKindValue(b);

  return a === b;
}

function areSingleSelectFieldKindValueEqual(a: FieldValue, b: FieldValue) {
  assertSingleSelectFieldKindValue(a);
  assertSingleSelectFieldKindValue(b);

  return a === b;
}

function areMultiSelectFieldKindValueEqual(a: FieldValue, b: FieldValue) {
  assertMultiSelectFieldKindValue(a);
  assertMultiSelectFieldKindValue(b);

  return hasAllOf(a, b);
}

function areBooleanFieldKindValueEqual(a: FieldValue, b: FieldValue) {
  assertBooleanFieldKindValue(a);
  assertBooleanFieldKindValue(b);

  return a === b;
}

function areDateFieldKindValueEqual(a: FieldValue, b: FieldValue) {
  assertDateFieldValue(a);
  assertDateFieldValue(b);

  if (a !== null && b !== null) {
    return isSameDay(a, b);
  }

  return a === b;
}
