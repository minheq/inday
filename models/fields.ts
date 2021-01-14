import { formatDecimal, formatUnit, Unit } from '../lib/unit';
import { generateID, validateID } from '../lib/id';
import { hasAllOf, keyedBy } from '../lib/array_utils';
import {
  DateTimeFormatOptions,
  formatDate,
  isDate,
  isISODate,
  ISODate,
  isSameDay,
  parseISODate,
} from '../lib/date_utils';
import { CollaboratorID } from './collaborators';
import { CollectionID } from './collections';
import { DocumentFieldValues, DocumentID } from './documents';
import { assertUnreached, map } from '../lib/lang_utils';
import { getSystemLocale } from '../app/lib/locale';

export const fieldIDPrefix = 'fld' as const;
export type FieldID = `${typeof fieldIDPrefix}${string}`;

export function generateFieldID(): FieldID {
  return generateID(fieldIDPrefix);
}

export function validateFieldID(id: string): void {
  return validateID(fieldIDPrefix, id);
}

// eslint-disable-next-line
export enum FieldType {
  Checkbox = 'Checkbox',
  Currency = 'Currency',
  Date = 'Date',
  Email = 'Email',
  MultiCollaborator = 'MultiCollaborator',
  MultiLineText = 'MultiLineText',
  MultiSelect = 'MultiSelect',
  MultiDocumentLink = 'MultiDocumentLink',
  Number = 'Number',
  PhoneNumber = 'PhoneNumber',
  SingleCollaborator = 'SingleCollaborator',
  SingleLineText = 'SingleLineText',
  SingleSelect = 'SingleSelect',
  SingleDocumentLink = 'SingleDocumentLink',
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

export const selectOptionIDPrefix = 'opt' as const;
export type SelectOptionID = `${typeof selectOptionIDPrefix}${string}`;

export function generateSelectOptionID(): SelectOptionID {
  return generateID(selectOptionIDPrefix);
}

export function validateSelectOptionID(id: string): void {
  return validateID(selectOptionIDPrefix, id);
}

export interface SelectOption {
  id: SelectOptionID;
  label: string;
  color: string;
  order: number;
}

export interface SingleSelectFieldConfig {
  type: FieldType.SingleSelect;
  options: SelectOption[];
}
export interface SingleSelectField extends BaseField, SingleSelectFieldConfig {}

export interface MultiSelectFieldConfig {
  type: FieldType.MultiSelect;
  options: SelectOption[];
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
  documentsFromCollectionID: CollectionID;
}
export interface SingleDocumentLinkField
  extends BaseField,
    SingleDocumentLinkFieldConfig {}

export interface MultiDocumentLinkFieldConfig {
  type: FieldType.MultiDocumentLink;
  documentsFromCollectionID: CollectionID;
}
export interface MultiDocumentLinkField
  extends BaseField,
    MultiDocumentLinkFieldConfig {}

export interface DateOnlyFieldConfig {
  type: FieldType.Date;
  includeTime: false;
  format: DateTimeFormatOptions;
}

export interface DateAndTimeFieldConfig {
  type: FieldType.Date;
  includeTime: true;
  format: DateTimeFormatOptions;
  /** Use same time zone for all collaborators */
  timezone: boolean;
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
  unit: Unit;
}
export interface DecimalFieldConfig {
  type: FieldType.Number;
  default: number | null;
  style: 'decimal';
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}
export interface IntegerFieldConfig {
  type: FieldType.Number;
  default: number | null;
  style: 'integer';
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
  | MultiSelectFieldConfig
  | NumberFieldConfig
  | PhoneNumberFieldConfig
  | SingleCollaboratorFieldConfig
  | SingleDocumentLinkFieldConfig
  | SingleLineTextFieldConfig
  | SingleSelectFieldConfig
  | URLFieldConfig;

export type BooleanFieldKind = CheckboxField;
export type DateFieldKind = DateField;
export type MultiOptionFieldKind =
  | MultiCollaboratorField
  | MultiDocumentLinkField
  | MultiSelectField;
export type NumberFieldKind = CurrencyField | NumberField;
export type SingleOptionFieldKind =
  | SingleCollaboratorField
  | SingleDocumentLinkField
  | SingleSelectField;
export type TextFieldKind =
  | EmailField
  | MultiLineTextField
  | PhoneNumberField
  | SingleLineTextField
  | URLField;
export type PrimaryField = TextFieldKind;

export type Field =
  | BooleanFieldKind
  | DateFieldKind
  | MultiOptionFieldKind
  | NumberFieldKind
  | SingleOptionFieldKind
  | TextFieldKind;

export type CheckboxFieldValue = boolean;
export type CurrencyFieldValue = number | null;
export type DateFieldValue = ISODate | null;
export type EmailFieldValue = string;
export type MultiCollaboratorFieldValue = CollaboratorID[];
export type MultiDocumentLinkFieldValue = DocumentID[];
export type MultiLineTextFieldValue = string;
export type MultiSelectFieldValue = SelectOptionID[];
export type NumberFieldValue = number | null;
export type PhoneNumberFieldValue = string;
export type SingleCollaboratorFieldValue = CollaboratorID | null;
export type SingleDocumentLinkFieldValue = DocumentID | null;
export type SingleLineTextFieldValue = string;
export type SingleSelectFieldValue = SelectOptionID | null;
export type URLFieldValue = string;

export type BooleanFieldKindValue = CheckboxFieldValue;
export type DateFieldKindValue = DateFieldValue;
export type MultiOptionFieldKindValue =
  | MultiCollaboratorFieldValue
  | MultiDocumentLinkFieldValue
  | MultiSelectFieldValue;
export type NumberFieldKindValue = CurrencyFieldValue | NumberFieldValue;
export type SingleOptionFieldKindValue =
  | SingleCollaboratorFieldValue
  | SingleDocumentLinkFieldValue
  | SingleSelectFieldValue;
export type TextFieldKindValue =
  | EmailFieldValue
  | MultiLineTextFieldValue
  | PhoneNumberFieldValue
  | SingleLineTextFieldValue
  | URLFieldValue;
export type PrimaryFieldValue = TextFieldKindValue;

export type FieldValue =
  | BooleanFieldKindValue
  | DateFieldKindValue
  | MultiOptionFieldKindValue
  | NumberFieldKindValue
  | SingleOptionFieldKindValue
  | TextFieldKindValue;

export interface FieldTypeToField {
  [FieldType.Checkbox]: CheckboxField;
  [FieldType.Currency]: CurrencyField;
  [FieldType.Date]: DateField;
  [FieldType.Email]: EmailField;
  [FieldType.MultiCollaborator]: MultiCollaboratorField;
  [FieldType.MultiLineText]: MultiLineTextField;
  [FieldType.MultiSelect]: MultiSelectField;
  [FieldType.MultiDocumentLink]: MultiDocumentLinkField;
  [FieldType.Number]: NumberField;
  [FieldType.PhoneNumber]: PhoneNumberField;
  [FieldType.SingleCollaborator]: SingleCollaboratorField;
  [FieldType.SingleLineText]: SingleLineTextField;
  [FieldType.SingleSelect]: SingleSelectField;
  [FieldType.SingleDocumentLink]: SingleDocumentLinkField;
  [FieldType.URL]: URLField;
}

export interface FieldTypeToFieldValue {
  [FieldType.Checkbox]: CheckboxFieldValue;
  [FieldType.Currency]: CurrencyFieldValue;
  [FieldType.Date]: DateFieldValue;
  [FieldType.Email]: EmailFieldValue;
  [FieldType.MultiCollaborator]: MultiCollaboratorFieldValue;
  [FieldType.MultiLineText]: MultiLineTextFieldValue;
  [FieldType.MultiSelect]: MultiSelectFieldValue;
  [FieldType.MultiDocumentLink]: MultiDocumentLinkFieldValue;
  [FieldType.Number]: NumberFieldValue;
  [FieldType.PhoneNumber]: PhoneNumberFieldValue;
  [FieldType.SingleCollaborator]: SingleCollaboratorFieldValue;
  [FieldType.SingleLineText]: SingleLineTextFieldValue;
  [FieldType.SingleSelect]: SingleSelectFieldValue;
  [FieldType.SingleDocumentLink]: SingleDocumentLinkFieldValue;
  [FieldType.URL]: URLFieldValue;
}

export function stringifyFieldValue(
  field: Field,
  value: FieldValue,
  locales?: string | string[],
): string {
  switch (field.type) {
    case FieldType.SingleLineText:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.MultiLineText:
    case FieldType.PhoneNumber:
      assertTextFieldKindValue(value);
      return value;
    case FieldType.Number:
    case FieldType.Currency:
      assertNumberFieldKindValue(value);
      if (value === null) {
        return '';
      }

      return value.toString();
    case FieldType.MultiSelect: {
      assertMultiSelectFieldValue(value);
      return value
        .map((selectOptionID) => {
          const selected = field.options.find(
            (opt) => opt.id === selectOptionID,
          );

          if (selected === undefined) {
            return '';
          }

          return selected.label;
        })
        .join(', ');
    }
    case FieldType.SingleSelect: {
      assertSingleSelectFieldValue(value);
      const selected = field.options.find((opt) => opt.id === value);

      if (selected === undefined) {
        return '';
      }

      return selected.label;
    }
    case FieldType.Checkbox:
      assertBooleanFieldKindValue(value);
      return value === true ? 'true' : 'false';
    case FieldType.Date:
      assertDateFieldKindValue(value);
      if (value === null) {
        return '';
      }

      if (!isISODate(value)) {
        return value;
      }

      return formatDate(parseISODate(value), locales);
    default:
      throw new Error(`Field type ${field.type} cannot be stringified.`);
  }
}

export function areFieldValuesEqual(
  field: Field,
  a: FieldValue,
  b: FieldValue,
): boolean {
  switch (field.type) {
    case FieldType.SingleLineText:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.MultiLineText:
    case FieldType.PhoneNumber:
      assertTextFieldKindValue(a);
      assertTextFieldKindValue(b);
      return areTextFieldKindValueEqual(a, b);
    case FieldType.Number:
    case FieldType.Currency:
      assertNumberFieldKindValue(a);
      assertNumberFieldKindValue(b);
      return areNumberFieldKindValueEqual(a, b);
    case FieldType.MultiCollaborator:
    case FieldType.MultiSelect:
    case FieldType.MultiDocumentLink:
      assertMultiOptionFieldKindValue(a);
      assertMultiOptionFieldKindValue(b);
      return areMultiOptionFieldKindValueEqual(a, b);
    case FieldType.SingleCollaborator:
    case FieldType.SingleSelect:
    case FieldType.SingleDocumentLink:
      assertSingleOptionFieldKindValue(a);
      assertSingleOptionFieldKindValue(b);
      return areSingleOptionFieldKindValueEqual(a, b);
    case FieldType.Checkbox:
      assertBooleanFieldKindValue(a);
      assertBooleanFieldKindValue(b);
      return areBooleanFieldKindValueEqual(a, b);
    case FieldType.Date:
      assertDateFieldKindValue(a);
      assertDateFieldKindValue(b);
      return areDateFieldKindValueEqual(a, b);
    default:
      assertUnreached(field);
  }
}

function areTextFieldKindValueEqual(
  a: TextFieldKindValue,
  b: TextFieldKindValue,
): boolean {
  return a === b;
}

function areNumberFieldKindValueEqual(
  a: NumberFieldKindValue,
  b: NumberFieldKindValue,
): boolean {
  return a === b;
}

function areSingleOptionFieldKindValueEqual(
  a: SingleOptionFieldKindValue,
  b: SingleOptionFieldKindValue,
): boolean {
  return a === b;
}

function areMultiOptionFieldKindValueEqual(a: string[], b: string[]): boolean {
  return hasAllOf(a, b);
}

function areBooleanFieldKindValueEqual(
  a: BooleanFieldKindValue,
  b: BooleanFieldKindValue,
): boolean {
  return a === b;
}

function areDateFieldKindValueEqual(
  a: DateFieldKindValue,
  b: DateFieldKindValue,
): boolean {
  if (isDate(a) && isDate(b)) {
    return isSameDay(a, b);
  }

  return a === b;
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

export function assertPrimaryField(
  field: Field,
): asserts field is PrimaryField {
  if (
    field.type !== FieldType.Email &&
    field.type !== FieldType.MultiLineText &&
    field.type !== FieldType.PhoneNumber &&
    field.type !== FieldType.SingleLineText &&
    field.type !== FieldType.URL
  ) {
    throw new Error(
      `Expected field to be PrimaryField. Received ${field.type}`,
    );
  }
}

export function assertFieldValueType<T extends FieldType>(
  fieldType: T,
  value: FieldTypeToFieldValue[T],
): asserts value is FieldTypeToFieldValue[T] {
  switch (fieldType) {
    case FieldType.Checkbox:
      assertCheckboxFieldValue(value);
      break;
    case FieldType.Currency:
      assertCurrencyFieldValue(value);
      break;
    case FieldType.Date:
      assertDateFieldValue(value);
      break;
    case FieldType.Email:
      assertEmailFieldValue(value);
      break;
    case FieldType.MultiCollaborator:
      assertMultiCollaboratorFieldValue(value);
      break;
    case FieldType.MultiLineText:
      assertMultiLineTextFieldValue(value);
      break;
    case FieldType.MultiSelect:
      assertMultiSelectFieldValue(value);
      break;
    case FieldType.MultiDocumentLink:
      assertMultiDocumentLinkFieldValue(value);
      break;
    case FieldType.Number:
      assertNumberFieldValue(value);
      break;
    case FieldType.PhoneNumber:
      assertPhoneNumberFieldValue(value);
      break;
    case FieldType.SingleCollaborator:
      assertSingleCollaboratorFieldValue(value);
      break;
    case FieldType.SingleLineText:
      assertSingleLineTextFieldValue(value);
      break;
    case FieldType.SingleSelect:
      assertSingleSelectFieldValue(value);
      break;
    case FieldType.SingleDocumentLink:
      assertSingleDocumentLinkFieldValue(value);
      break;
    case FieldType.URL:
      assertURLFieldValue(value);
      break;
  }
}

export function assertCheckboxFieldValue(
  value: FieldValue,
): asserts value is CheckboxFieldValue {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Expected CheckboxFieldValue to be boolean. Received "${JSON.stringify(
        value,
      )}"`,
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
      `Expected CurrencyFieldValue to be number. Received "${JSON.stringify(
        value,
      )}"`,
    );
  }
}

export function assertDateFieldValue(
  value: FieldValue,
): asserts value is DateFieldValue {
  if (value === null) {
    return;
  }

  if (!isDate(value) && typeof value !== 'string') {
    throw new Error(
      `Expected DateFieldValue to be  Received "${JSON.stringify(value)}"`,
    );
  }
}

export function assertEmailFieldValue(
  value: FieldValue,
): asserts value is EmailFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected EmailFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
    );
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
      `Expected MultiCollaboratorFieldValue to be string[]. Received "${JSON.stringify(
        value,
      )}"`,
    );
  }
}

export function assertMultiDocumentLinkFieldValue(
  value: FieldValue,
): asserts value is MultiDocumentLinkFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiDocumentLinkFieldValue to be string[]. Received "${JSON.stringify(
        value,
      )}"`,
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
      `Expected MultiLineTextFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
    );
  }
}

export function assertMultiSelectFieldValue(
  value: FieldValue,
): asserts value is MultiSelectFieldValue {
  if (value === null) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new Error(
      `Expected MultiSelectFieldValue to be string[]. Received "${JSON.stringify(
        value,
      )}"`,
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
      `Expected NumberFieldValue to be number. Received "${JSON.stringify(
        value,
      )}"`,
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
      `Expected PhoneNumberFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
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
      `Expected SingleCollaboratorFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
    );
  }
}
export function assertSingleDocumentLinkFieldValue(
  value: FieldValue,
): asserts value is SingleDocumentLinkFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleDocumentLinkFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
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
      `Expected SingleLineTextFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
    );
  }
}

export function assertSingleSelectFieldValue(
  value: FieldValue,
): asserts value is SingleSelectFieldValue {
  if (value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Expected SingleSelectFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
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
    throw new Error(
      `Expected URLFieldValue to be string. Received "${JSON.stringify(
        value,
      )}"`,
    );
  }
}

export function assertBooleanFieldKindValue(
  value: FieldValue,
): asserts value is BooleanFieldKindValue {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Expected BooleanFieldKindValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function assertDateFieldKindValue(
  value: FieldValue,
): asserts value is DateFieldKindValue {
  if (value !== null && !isISODate(value)) {
    throw new Error(
      `Expected DateFieldKindValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function assertMultiOptionFieldKindValue(
  value: FieldValue,
): asserts value is MultiOptionFieldKindValue {
  if (Array.isArray(value) === false) {
    throw new Error(
      `Expected MultiOptionFieldKindValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function assertNumberFieldKindValue(
  value: FieldValue,
): asserts value is NumberFieldKindValue {
  if (value !== null && typeof value !== 'number') {
    throw new Error(
      `Expected NumberFieldKindValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function assertSingleOptionFieldKindValue(
  value: FieldValue,
): asserts value is SingleOptionFieldKindValue {
  if (value !== null && typeof value !== 'string') {
    throw new Error(
      `Expected SingleOptionFieldKindValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function assertTextFieldKindValue(
  value: FieldValue,
): asserts value is TextFieldKindValue {
  if (typeof value !== 'string') {
    throw new Error(
      `Expected TextFieldKindValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function assertPrimaryFieldValue(
  value: FieldValue,
): asserts value is PrimaryFieldValue {
  if (typeof value !== 'string') {
    throw new Error(
      `Expected PrimaryFieldValue. Received ${JSON.stringify(value)}`,
    );
  }
}

export function getDefaultFieldValue(field: Field): FieldValue {
  switch (field.type) {
    case FieldType.Checkbox:
      return false;
    case FieldType.Currency:
    case FieldType.Number:
    case FieldType.Date:
    case FieldType.SingleCollaborator:
    case FieldType.SingleSelect:
    case FieldType.SingleDocumentLink:
      return null;
    case FieldType.PhoneNumber:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.MultiLineText:
    case FieldType.SingleLineText:
      return '';
    case FieldType.MultiCollaborator:
    case FieldType.MultiSelect:
    case FieldType.MultiDocumentLink:
      return [];
    default:
      assertUnreached(field);
  }
}

export function getDefaultDocumentFieldValues(
  fields: Field[],
): DocumentFieldValues {
  const fieldsByID = keyedBy(fields, (field) => field.id);

  return map(fieldsByID, getDefaultFieldValue);
}

export function formatNumberFieldValue(
  value: NumberFieldValue,
  field: NumberField,
): string {
  if (value !== null) {
    switch (field.style) {
      case 'decimal':
        return formatDecimal(
          value,
          getSystemLocale(),
          field.minimumFractionDigits,
          field.maximumFractionDigits,
        );
      case 'unit':
        return formatUnit(value, getSystemLocale(), field.unit);
      case 'integer':
        return `${value}`;
    }
  }

  return '';
}
