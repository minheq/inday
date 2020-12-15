import { Record, RecordID } from './records';
import {
  assertBooleanFieldKindValue,
  assertDateFieldValue,
  assertMultiSelectFieldKindValue,
  assertNumberFieldValue,
  assertSingleSelectFieldKindValue,
  assertTextFieldKindValue,
  BooleanFieldKindValue,
  DateFieldKindValue,
  Field,
  FieldID,
  FieldType,
  FieldValue,
  MultiSelectFieldKindValue,
  NumberFieldKindValue,
  SelectOptionID,
  SingleSelectFieldKindValue,
  TextFieldKindValue,
} from './fields';
import { ViewID } from './views';
import { generateID, validateID } from '../../lib/id';
import {
  isISODate,
  isISODateInterval,
  ISODate,
  ISODateInterval,
  parseISODate,
  parseISODateInterval,
} from '../../lib/date_utils';
import {
  isAfter,
  isBefore,
  isSameDay,
  isWithinDateInterval,
} from '../../lib/date_utils';
import { hasAllOf, hasAnyOf, hasNoneOf } from '../../lib/array_utils';
import { isEmpty } from '../../lib/lang_utils';
import { CollaboratorID } from './collaborators';

export const filterIDPrefix = `fil` as const;
export type FilterID = `${typeof filterIDPrefix}${string}`;

export const Filter = {
  generateID: (): FilterID => {
    return generateID(filterIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(filterIDPrefix, id);
  },
};

export interface BaseFilter {
  id: FilterID;
  viewID: ViewID;
  // Group filters to make "AND" and "OR" filters
  // "AND" belong to the same group, "OR" will have different group
  group: number;
}

export interface CheckboxFieldFilterConfig {
  fieldID: FieldID;
  rule: BooleanFieldKindFilterRule;
  value: BooleanFieldKindFilterRuleValue;
}
export interface CheckboxFieldFilter
  extends BaseFilter,
    CheckboxFieldFilterConfig {}

export interface CurrencyFieldFilterConfig {
  fieldID: FieldID;
  rule: NumberFieldKindFilterRule;
  value: NumberFieldKindFilterRuleValue;
}
export interface CurrencyFieldFilter
  extends BaseFilter,
    CurrencyFieldFilterConfig {}

export interface DateFieldFilterConfig {
  fieldID: FieldID;
  rule: DateFieldKindFilterRule;
  value: DateFieldKindFilterRuleValue;
}
export interface DateFieldFilter extends BaseFilter, DateFieldFilterConfig {}

export interface EmailFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface EmailFieldFilter extends BaseFilter, EmailFieldFilterConfig {}

export interface MultiCollaboratorFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFieldKindFilterRule;
  value: MultiCollaboratorFieldFilterValue;
}
type MultiCollaboratorFieldFilterValue = CollaboratorID[];
export interface MultiCollaboratorFieldFilter
  extends BaseFilter,
    MultiCollaboratorFieldFilterConfig {}

export interface MultiRecordLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFieldKindFilterRule;
  value: MultiRecordLinkFieldFilterValue;
}
type MultiRecordLinkFieldFilterValue = RecordID[];
export interface MultiRecordLinkFieldFilter
  extends BaseFilter,
    MultiRecordLinkFieldFilterConfig {}

export interface MultiLineTextFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface MultiLineTextFieldFilter
  extends BaseFilter,
    MultiLineTextFieldFilterConfig {}

export interface MultiOptionFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFieldKindFilterRule;
  value: MultiOptionFieldFilterValue;
}
type MultiOptionFieldFilterValue = SelectOptionID[];

export interface MultiOptionFieldFilter
  extends BaseFilter,
    MultiOptionFieldFilterConfig {}

export interface NumberFieldFilterConfig {
  fieldID: FieldID;
  rule: NumberFieldKindFilterRule;
  value: NumberFieldKindFilterRuleValue;
}
export interface NumberFieldFilter
  extends BaseFilter,
    NumberFieldFilterConfig {}

export interface PhoneNumberFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface PhoneNumberFieldFilter
  extends BaseFilter,
    PhoneNumberFieldFilterConfig {}

export interface SingleCollaboratorFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFieldKindFilterRule;
  value: SingleCollaboratorFieldFilterValue;
}
type SingleCollaboratorFieldFilterValue =
  | CollaboratorID
  | CollaboratorID[]
  | null;

export interface SingleCollaboratorFieldFilter
  extends BaseFilter,
    SingleCollaboratorFieldFilterConfig {}

export interface SingleRecordLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFieldKindFilterRule;
  value: SingleRecordLinkFieldFilterValue;
}
type SingleRecordLinkFieldFilterValue = RecordID | RecordID[] | null;

export interface SingleRecordLinkFieldFilter
  extends BaseFilter,
    SingleRecordLinkFieldFilterConfig {}

export interface SingleLineTextFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface SingleLineTextFieldFilter
  extends BaseFilter,
    SingleLineTextFieldFilterConfig {}

export interface SingleOptionFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFieldKindFilterRule;
  value: SingleOptionFieldFilterValue;
}
type SingleOptionFieldFilterValue = SelectOptionID | SelectOptionID[] | null;

export interface SingleOptionFieldFilter
  extends BaseFilter,
    SingleOptionFieldFilterConfig {}

export interface URLFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface URLFieldFilter extends BaseFilter, URLFieldFilterConfig {}

// eslint-disable-next-line
export enum TextFieldKindFilterRule {
  Contains = 'Contains',
  DoesNotContain = 'DoesNotContain',
  Is = 'Is',
  IsNot = 'IsNot',
  IsEmpty = 'IsEmpty',
  IsNotEmpty = 'IsNotEmpty',
}
export type TextFieldKindFilterRuleValue = string;

// eslint-disable-next-line
export enum SingleSelectFieldKindFilterRule {
  Is = 'Is',
  IsNot = 'IsNot',
  IsAnyOf = 'IsAnyOf',
  IsNoneOf = 'IsNoneOf',
  IsEmpty = 'IsEmpty',
  IsNotEmpty = 'IsNotEmpty',
}
export type SingleSelectFieldKindFilterRuleValue =
  | SingleOptionFieldFilterValue
  | SingleCollaboratorFieldFilterValue
  | SingleRecordLinkFieldFilterValue;

// eslint-disable-next-line
export enum MultiSelectFieldKindFilterRule {
  HasAnyOf = 'HasAnyOf',
  HasAllOf = 'HasAllOf',
  HasNoneOf = 'HasNoneOf',
  IsEmpty = 'IsEmpty',
  IsNotEmpty = 'IsNotEmpty',
}
export type MultiSelectFieldKindFilterRuleValue =
  | MultiOptionFieldFilterValue
  | MultiCollaboratorFieldFilterValue
  | MultiRecordLinkFieldFilterValue;

// eslint-disable-next-line
export enum DateFieldKindFilterRule {
  Is = 'Is',
  IsWithin = 'IsWithin',
  IsBefore = 'IsBefore',
  IsAfter = 'IsAfter',
  IsOnOrBefore = 'IsOnOrBefore',
  IsOnOrAfter = 'IsOnOrAfter',
  IsNot = 'IsNot',
  IsEmpty = 'IsEmpty',
  IsNotEmpty = 'IsNotEmpty',
}
export type DateFieldKindFilterRuleValue = ISODate | ISODateInterval | null;

// eslint-disable-next-line
export enum NumberFieldKindFilterRule {
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  LessThan = 'LessThan',
  GreaterThan = 'GreaterThan',
  LessThanOrEqual = 'LessThanOrEqual',
  GreaterThanOrEqual = 'GreaterThanOrEqual',
  IsEmpty = 'IsEmpty',
  IsNotEmpty = 'IsNotEmpty',
}
export type NumberFieldKindFilterRuleValue = number | null;

// eslint-disable-next-line
export enum BooleanFieldKindFilterRule {
  Is = 'Is',
}
export type BooleanFieldKindFilterRuleValue = boolean;

export type FilterRule =
  | BooleanFieldKindFilterRule
  | DateFieldKindFilterRule
  | MultiSelectFieldKindFilterRule
  | NumberFieldKindFilterRule
  | SingleSelectFieldKindFilterRule
  | TextFieldKindFilterRule;

export type FilterRuleValue =
  | BooleanFieldKindFilterRuleValue
  | DateFieldKindFilterRuleValue
  | MultiSelectFieldKindFilterRuleValue
  | NumberFieldKindFilterRuleValue
  | SingleSelectFieldKindFilterRuleValue
  | TextFieldKindFilterRuleValue;

export type FilterConfig =
  | BooleanFieldKindFilterConfig
  | DateFieldKindFilterConfig
  | MultiSelectFieldKindFilterConfig
  | NumberFieldKindFilterConfig
  | SingleSelectFieldKindFilterConfig
  | TextFieldKindFilterConfig;

export type Filter =
  | BooleanFieldKindFilter
  | DateFieldKindFilter
  | MultiSelectFieldKindFilter
  | NumberFieldKindFilter
  | SingleSelectFieldKindFilter
  | TextFieldKindFilter;

export type FilterGroup = Filter[];

export type BooleanFieldKindFilter = CheckboxFieldFilter;
export type DateFieldKindFilter = DateFieldFilter;
export type MultiSelectFieldKindFilter =
  | MultiCollaboratorFieldFilter
  | MultiRecordLinkFieldFilter
  | MultiOptionFieldFilter;
export type NumberFieldKindFilter = CurrencyFieldFilter | NumberFieldFilter;
export type SingleSelectFieldKindFilter =
  | SingleCollaboratorFieldFilter
  | SingleRecordLinkFieldFilter
  | SingleOptionFieldFilter;
export type TextFieldKindFilter =
  | EmailFieldFilter
  | MultiLineTextFieldFilter
  | PhoneNumberFieldFilter
  | SingleLineTextFieldFilter
  | URLFieldFilter;

export type BooleanFieldKindFilterConfig = CheckboxFieldFilterConfig;
export type DateFieldKindFilterConfig = DateFieldFilterConfig;
export type MultiSelectFieldKindFilterConfig =
  | MultiCollaboratorFieldFilterConfig
  | MultiRecordLinkFieldFilterConfig
  | MultiOptionFieldFilterConfig;
export type NumberFieldKindFilterConfig =
  | CurrencyFieldFilterConfig
  | NumberFieldFilterConfig;
export type SingleSelectFieldKindFilterConfig =
  | SingleCollaboratorFieldFilterConfig
  | SingleRecordLinkFieldFilterConfig
  | SingleOptionFieldFilterConfig;
export type TextFieldKindFilterConfig =
  | EmailFieldFilterConfig
  | MultiLineTextFieldFilterConfig
  | PhoneNumberFieldFilterConfig
  | SingleLineTextFieldFilterConfig
  | URLFieldFilterConfig;

export function getDefaultFilterConfig(field: Field): FilterConfig {
  switch (field.type) {
    case FieldType.Checkbox:
      return {
        fieldID: field.id,
        rule: BooleanFieldKindFilterRule.Is,
        value: false,
      };
    case FieldType.Date:
      return {
        fieldID: field.id,
        rule: DateFieldKindFilterRule.Is,
        value: null,
      };
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return {
        fieldID: field.id,
        rule: TextFieldKindFilterRule.Contains,
        value: '',
      };
    case FieldType.Number:
    case FieldType.Currency:
      return {
        fieldID: field.id,
        rule: NumberFieldKindFilterRule.Equal,
        value: null,
      };
    case FieldType.MultiCollaborator:
    case FieldType.MultiRecordLink:
    case FieldType.MultiOption:
      return {
        fieldID: field.id,
        rule: MultiSelectFieldKindFilterRule.HasAnyOf,
        value: [],
      };
    case FieldType.SingleOption:
    case FieldType.SingleRecordLink:
    case FieldType.SingleCollaborator:
      return {
        fieldID: field.id,
        rule: SingleSelectFieldKindFilterRule.Is,
        value: null,
      };
  }
}

export function updateFilterGroup(
  filter: Filter,
  value: 'and' | 'or',
  filters: Filter[],
): { [filterID: string]: Filter } {
  const updatedFilters: { [filterID: string]: Filter } = {};
  const filterIndex = filters.findIndex((f) => f.id === filter.id);

  // Guaranteed to have previous filter given UI
  const prevFilter: Filter = filters[filterIndex - 1];

  let op: 'add' | 'sub' | null = null;

  if (value === 'and' && prevFilter.group !== filter.group) {
    op = 'sub';
  } else if (value === 'or' && prevFilter.group === filter.group) {
    op = 'add';
  }

  if (op === null) {
    return updatedFilters;
  }

  const nextFilters = filters.slice(filterIndex);

  for (const nextFilter of nextFilters) {
    updatedFilters[nextFilter.id] = {
      ...nextFilter,
      group: nextFilter.group + (op === 'sub' ? -1 : 1),
    };
  }

  return updatedFilters;
}

export function deleteFilter(
  filter: Filter,
  filters: Filter[],
): { [filterID: string]: Filter } {
  const updatedFilters: { [filterID: string]: Filter } = {};
  const filterIndex = filters.findIndex((f) => f.id === filter.id);

  const nextFilters = filters.slice(filterIndex + 1);

  for (const nextFilter of nextFilters) {
    updatedFilters[nextFilter.id] = {
      ...nextFilter,
      group: nextFilter.group - 1,
    };
  }

  return updatedFilters;
}

export interface FilterGetters {
  getField: (fieldID: FieldID) => Field;
}

export function filterRecords(
  filterGroups: FilterGroup[],
  records: Record[],
  getters: FilterGetters,
): Record[] {
  const { getField } = getters;

  let filteredRecords = records;

  filteredRecords = filteredRecords.filter((record) => {
    if (isEmpty(filterGroups)) {
      return true;
    }

    return filterGroups.some((filterGroup) => {
      return filterGroup.every((filter) => {
        const field = getField(filter.fieldID);

        return filterByFilter(field, record.fields[filter.fieldID], filter);
      });
    });
  });

  return filteredRecords;
}

function filterByFilter(
  field: Field,
  value: FieldValue,
  filter: Filter,
): boolean {
  switch (field.type) {
    case FieldType.Checkbox:
      assertBooleanFieldKindValue(value);
      assertBooleanFilter(filter);

      return filterByBooleanFieldKindFilter(value, filter);
    case FieldType.Number:
    case FieldType.Currency:
      assertNumberFieldValue(value);
      assertNumberFilter(filter);

      return filterByNumberFieldKindFilter(value, filter);
    case FieldType.Date:
      assertDateFieldValue(value);
      assertDateFilter(filter);

      return filterByDateFieldKindFilter(value, filter);
    case FieldType.PhoneNumber:
    case FieldType.SingleLineText:
    case FieldType.URL:
    case FieldType.MultiLineText:
    case FieldType.Email:
      assertTextFieldKindValue(value);
      assertTextFilter(filter);

      return filterByTextFieldKindFilter(value, filter);
    case FieldType.MultiCollaborator:
    case FieldType.MultiRecordLink:
    case FieldType.MultiOption:
      assertMultiSelectFieldKindValue(value);
      assertMultiSelectFilter(filter);

      return filterByMultiSelectFieldKindFilter(value, filter);
    case FieldType.SingleCollaborator:
    case FieldType.SingleRecordLink:
    case FieldType.SingleOption:
      assertSingleSelectFieldKindValue(value);
      assertSingleSelectFilter(filter);
      return filterBySingleSelectFieldKindFilter(value, filter);
  }
}

export function filterByTextFieldKindFilter(
  value: TextFieldKindValue,
  filter: TextFieldKindFilter,
): boolean {
  switch (filter.rule) {
    case TextFieldKindFilterRule.Contains:
      return filterByTextFieldKindFilterRuleContains(value, filter.value);
    case TextFieldKindFilterRule.DoesNotContain:
      return filterByTextFieldKindFilterRuleDoesNotContain(value, filter.value);
    case TextFieldKindFilterRule.Is:
      return filterByTextFieldKindFilterRuleIs(value, filter.value);
    case TextFieldKindFilterRule.IsNot:
      return filterByTextFieldKindFilterRuleIsNot(value, filter.value);
    case TextFieldKindFilterRule.IsEmpty:
      return filterByTextFieldKindFilterRuleIsEmpty(value);
    case TextFieldKindFilterRule.IsNotEmpty:
      return filterByTextFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByTextFieldKindFilterRuleContains(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue,
): boolean {
  return value.toLowerCase().includes(filterValue.toLowerCase());
}
export function filterByTextFieldKindFilterRuleDoesNotContain(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue,
): boolean {
  return !value.toLowerCase().includes(filterValue.toLowerCase());
}
export function filterByTextFieldKindFilterRuleIs(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue,
): boolean {
  return value === filterValue;
}
export function filterByTextFieldKindFilterRuleIsNot(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue,
): boolean {
  return value !== filterValue;
}
export function filterByTextFieldKindFilterRuleIsEmpty(
  value: TextFieldKindValue,
): boolean {
  return value === '';
}
export function filterByTextFieldKindFilterRuleIsNotEmpty(
  value: TextFieldKindValue,
): boolean {
  return value !== '';
}

export function filterByNumberFieldKindFilter(
  value: NumberFieldKindValue,
  filter: NumberFieldFilter,
): boolean {
  switch (filter.rule) {
    case NumberFieldKindFilterRule.Equal:
      return filterByNumberFieldKindFilterRuleEqual(value, filter.value);
    case NumberFieldKindFilterRule.NotEqual:
      return filterByNumberFieldKindFilterRuleNotEqual(value, filter.value);
    case NumberFieldKindFilterRule.LessThan:
      return filterByNumberFieldKindFilterRuleLessThan(value, filter.value);
    case NumberFieldKindFilterRule.GreaterThan:
      return filterByNumberFieldKindFilterRuleGreaterThan(value, filter.value);
    case NumberFieldKindFilterRule.LessThanOrEqual:
      return filterByNumberFieldKindFilterRuleLessThanOrEqual(
        value,
        filter.value,
      );
    case NumberFieldKindFilterRule.GreaterThanOrEqual:
      return filterByNumberFieldKindFilterRuleGreaterThanOrEqual(
        value,
        filter.value,
      );
    case NumberFieldKindFilterRule.IsEmpty:
      return filterByNumberFieldKindFilterRuleIsEmpty(value);
    case NumberFieldKindFilterRule.IsNotEmpty:
      return filterByNumberFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByNumberFieldKindFilterRuleEqual(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue,
): boolean {
  return value === filterValue;
}

export function filterByNumberFieldKindFilterRuleNotEqual(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue,
): boolean {
  return value !== filterValue;
}

export function filterByNumberFieldKindFilterRuleLessThan(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  return value < filterValue;
}

export function filterByNumberFieldKindFilterRuleGreaterThan(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  return value > filterValue;
}

export function filterByNumberFieldKindFilterRuleLessThanOrEqual(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  return value <= filterValue;
}

export function filterByNumberFieldKindFilterRuleGreaterThanOrEqual(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  return value >= filterValue;
}

export function filterByNumberFieldKindFilterRuleIsEmpty(
  value: NumberFieldKindValue,
): boolean {
  return value === null;
}

export function filterByNumberFieldKindFilterRuleIsNotEmpty(
  value: NumberFieldKindValue,
): boolean {
  return value !== null;
}

export function filterByDateFieldKindFilter(
  value: DateFieldKindValue,
  filter: DateFieldFilter,
): boolean {
  switch (filter.rule) {
    case DateFieldKindFilterRule.Is:
      return filterByDateFieldKindFilterRuleIs(value, filter.value);
    case DateFieldKindFilterRule.IsWithin:
      return filterByDateFieldKindFilterRuleIsWithin(value, filter.value);
    case DateFieldKindFilterRule.IsBefore:
      return filterByDateFieldKindFilterRuleIsBefore(value, filter.value);
    case DateFieldKindFilterRule.IsAfter:
      return filterByDateFieldKindFilterRuleIsAfter(value, filter.value);
    case DateFieldKindFilterRule.IsOnOrBefore:
      return filterByDateFieldKindFilterRuleIsOnOrBefore(value, filter.value);
    case DateFieldKindFilterRule.IsOnOrAfter:
      return filterByDateFieldKindFilterRuleIsOnOrAfter(value, filter.value);
    case DateFieldKindFilterRule.IsNot:
      return filterByDateFieldKindFilterRuleIsNot(value, filter.value);
    case DateFieldKindFilterRule.IsEmpty:
      return filterByDateFieldKindFilterRuleIsEmpty(value);
    case DateFieldKindFilterRule.IsNotEmpty:
      return filterByDateFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByDateFieldKindFilterRuleIs(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODate(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return isSameDay(parseISODate(value), parseISODate(filterValue));
}

export function filterByDateFieldKindFilterRuleIsWithin(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODateInterval(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return isWithinDateInterval(
    parseISODate(value),
    parseISODateInterval(filterValue),
  );
}

export function filterByDateFieldKindFilterRuleIsBefore(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODate(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return isBefore(parseISODate(value), parseISODate(filterValue));
}

export function filterByDateFieldKindFilterRuleIsAfter(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODate(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return isAfter(parseISODate(value), parseISODate(filterValue));
}

export function filterByDateFieldKindFilterRuleIsOnOrBefore(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODate(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return (
    isBefore(parseISODate(value), parseISODate(filterValue)) ||
    isSameDay(parseISODate(value), parseISODate(filterValue))
  );
}

export function filterByDateFieldKindFilterRuleIsOnOrAfter(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODate(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return (
    isAfter(parseISODate(value), parseISODate(filterValue)) ||
    isSameDay(parseISODate(value), parseISODate(filterValue))
  );
}

export function filterByDateFieldKindFilterRuleIsNot(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (!isISODate(filterValue)) {
    throw new Error(
      `Expected filterValue to be ISODate. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`,
    );
  }

  return !isSameDay(parseISODate(value), parseISODate(filterValue));
}

export function filterBySingleSelectFieldKindFilter(
  value: SingleSelectFieldKindValue,
  filter: SingleSelectFieldKindFilter,
): boolean {
  switch (filter.rule) {
    case SingleSelectFieldKindFilterRule.Is:
      return filterBySingleSelectFieldKindFilterRuleIs(value, filter.value);
    case SingleSelectFieldKindFilterRule.IsNot:
      return filterBySingleSelectFieldKindFilterRuleIsNot(value, filter.value);
    case SingleSelectFieldKindFilterRule.IsAnyOf:
      return filterBySingleSelectFieldKindFilterRuleIsAnyOf(
        value,
        filter.value,
      );
    case SingleSelectFieldKindFilterRule.IsNoneOf:
      return filterBySingleSelectFieldKindFilterRuleIsNoneOf(
        value,
        filter.value,
      );
    case SingleSelectFieldKindFilterRule.IsEmpty:
      return filterBySingleSelectFieldKindFilterRuleIsEmpty(value);
    case SingleSelectFieldKindFilterRule.IsNotEmpty:
      return filterBySingleSelectFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByDateFieldKindFilterRuleIsEmpty(
  value: DateFieldKindValue,
): boolean {
  return value === null;
}

export function filterByDateFieldKindFilterRuleIsNotEmpty(
  value: DateFieldKindValue,
): boolean {
  return value !== null;
}

export function filterBySingleSelectFieldKindFilterRuleIs(
  value: SingleSelectFieldKindValue,
  filterValue: SingleSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (typeof filterValue !== 'string') {
    throw new Error(
      `Expected filterValue to be string. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  return value === filterValue;
}

export function filterBySingleSelectFieldKindFilterRuleIsNot(
  value: SingleSelectFieldKindValue,
  filterValue: SingleSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (typeof filterValue !== 'string') {
    throw new Error(
      `Expected filterValue to be string. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  return value !== filterValue;
}

export function filterBySingleSelectFieldKindFilterRuleIsAnyOf(
  value: SingleSelectFieldKindValue,
  filterValue: SingleSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (typeof filterValue === 'string') {
    throw new Error(
      `Expected filterValue to be string[]. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  return hasAnyOf([value], filterValue);
}

export function filterBySingleSelectFieldKindFilterRuleIsNoneOf(
  value: SingleSelectFieldKindValue,
  filterValue: SingleSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (typeof filterValue === 'string') {
    throw new Error(
      `Expected filterValue to be string[]. Received ${JSON.stringify(
        filterValue,
      )}`,
    );
  }

  return hasNoneOf([value], filterValue);
}

export function filterBySingleSelectFieldKindFilterRuleIsEmpty(
  value: SingleSelectFieldKindValue,
): boolean {
  return value === null;
}

export function filterBySingleSelectFieldKindFilterRuleIsNotEmpty(
  value: SingleSelectFieldKindValue,
): boolean {
  return value !== null;
}

export function filterByMultiSelectFieldKindFilter(
  value: MultiSelectFieldKindValue,
  filter: MultiSelectFieldKindFilter,
): boolean {
  switch (filter.rule) {
    case MultiSelectFieldKindFilterRule.HasAnyOf:
      return filterByMultiSelectFieldKindFilterRuleHasAnyOf(
        value,
        filter.value,
      );
    case MultiSelectFieldKindFilterRule.HasAllOf:
      return filterByMultiSelectFieldKindFilterRuleHasAllOf(
        value,
        filter.value,
      );
    case MultiSelectFieldKindFilterRule.HasNoneOf:
      return filterByMultiSelectFieldKindFilterRuleHasNoneOf(
        value,
        filter.value,
      );
    case MultiSelectFieldKindFilterRule.IsEmpty:
      return filterByMultiSelectFieldKindFilterRuleIsEmpty(value);
    case MultiSelectFieldKindFilterRule.IsNotEmpty:
      return filterByMultiSelectFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByMultiSelectFieldKindFilterRuleHasAnyOf(
  value: MultiSelectFieldKindValue,
  filterValue: MultiSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  return hasAnyOf<CollaboratorID | RecordID | SelectOptionID>(
    value,
    filterValue,
  );
}
export function filterByMultiSelectFieldKindFilterRuleHasAllOf(
  value: MultiSelectFieldKindValue,
  filterValue: MultiSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  return hasAllOf<CollaboratorID | RecordID | SelectOptionID>(
    value,
    filterValue,
  );
}
export function filterByMultiSelectFieldKindFilterRuleHasNoneOf(
  value: MultiSelectFieldKindValue,
  filterValue: MultiSelectFieldKindFilterRuleValue,
): boolean {
  if (value === null) {
    return false;
  }

  return hasNoneOf<CollaboratorID | RecordID | SelectOptionID>(
    value,
    filterValue,
  );
}
export function filterByMultiSelectFieldKindFilterRuleIsEmpty(
  value: MultiSelectFieldKindValue,
): boolean {
  return isEmpty<CollaboratorID | RecordID | SelectOptionID>(value);
}
export function filterByMultiSelectFieldKindFilterRuleIsNotEmpty(
  value: MultiSelectFieldKindValue,
): boolean {
  return !isEmpty<CollaboratorID | RecordID | SelectOptionID>(value);
}

export function assertNumberFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is NumberFieldKindFilterRule {
  if (rule in NumberFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid NumberFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertTextFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is TextFieldKindFilterRule {
  if (rule in TextFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid TextFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertDateFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is DateFieldKindFilterRule {
  if (rule in DateFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid DateFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertMultiSelectFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is MultiSelectFieldKindFilterRule {
  if (rule in MultiSelectFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid MultiSelectFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertSingleSelectFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is SingleSelectFieldKindFilterRule {
  if (rule in SingleSelectFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid SingleSelectFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertBooleanFilterRule(
  rule: FilterRule,
): asserts rule is BooleanFieldKindFilterRule {
  if (rule in BooleanFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid BooleanFieldKindFilterRule. Received ${rule}`,
  );
}

export function filterByBooleanFieldKindFilter(
  value: BooleanFieldKindValue,
  filter: BooleanFieldKindFilter,
): boolean {
  return filterByBooleanFieldKindFilterRuleIs(value, filter.value);
}

export function filterByBooleanFieldKindFilterRuleIs(
  value: BooleanFieldKindValue,
  filterValue: BooleanFieldKindFilterRuleValue,
): boolean {
  return value === filterValue;
}

export function assertBooleanFilter(
  filter: Filter,
): asserts filter is BooleanFieldKindFilter {
  assertBooleanFilterRule(filter.rule);
}

export function assertDateFilter(
  filter: Filter,
): asserts filter is DateFieldKindFilter {
  assertDateFieldKindFilterRule(filter.rule);
}

export function assertMultiSelectFilter(
  filter: Filter,
): asserts filter is MultiSelectFieldKindFilter {
  assertMultiSelectFieldKindFilterRule(filter.rule);
}

export function assertNumberFilter(
  filter: Filter,
): asserts filter is NumberFieldKindFilter {
  assertNumberFieldKindFilterRule(filter.rule);
}

export function assertSingleSelectFilter(
  filter: Filter,
): asserts filter is SingleSelectFieldKindFilter {
  assertSingleSelectFieldKindFilterRule(filter.rule);
}

export function assertTextFilter(
  filter: Filter,
): asserts filter is TextFieldKindFilter {
  assertTextFieldKindFilterRule(filter.rule);
}

export function assertBooleanFieldKindFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is BooleanFieldKindFilterConfig {
  assertBooleanFilterRule(filterConfig.rule);
}

export function assertDateFieldKindFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is DateFieldKindFilterConfig {
  assertDateFieldKindFilterRule(filterConfig.rule);
}

export function assertMultiSelectFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is MultiSelectFieldKindFilterConfig {
  assertMultiSelectFieldKindFilterRule(filterConfig.rule);
}

export function assertNumberFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is NumberFieldKindFilterConfig {
  assertNumberFieldKindFilterRule(filterConfig.rule);
}

export function assertSingleSelectFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is SingleSelectFieldKindFilterConfig {
  assertSingleSelectFieldKindFilterRule(filterConfig.rule);
}

export function assertTextFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is TextFieldKindFilterConfig {
  assertTextFieldKindFilterRule(filterConfig.rule);
}
