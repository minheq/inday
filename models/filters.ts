import { Document, DocumentID } from "./documents";
import {
  assertBooleanFieldKindValue,
  assertDateFieldValue,
  assertMultiOptionFieldKindValue,
  assertNumberFieldValue,
  assertSingleOptionFieldKindValue,
  assertTextFieldKindValue,
  BooleanFieldKindValue,
  DateFieldKindValue,
  Field,
  FieldID,
  FieldType,
  FieldValue,
  MultiOptionFieldKindValue,
  NumberFieldKindValue,
  SelectOptionID,
  SingleOptionFieldKindValue,
  TextFieldKindValue,
} from "./fields";
import { ViewID } from "./views";
import { generateID, validateID } from "../lib/id";
import {
  isISODate,
  isISODateInterval,
  ISODate,
  ISODateInterval,
  parseISODate,
  parseISODateInterval,
} from "../lib/date_utils";
import {
  isAfter,
  isBefore,
  isSameDay,
  isWithinDateInterval,
} from "../lib/date_utils";
import { hasAllOf, hasAnyOf, hasNoneOf } from "../lib/array_utils";
import { isEmpty } from "../lib/lang_utils";
import { CollaboratorID } from "./collaborators";

export const filterIDPrefix = `fil` as const;
export type FilterID = `${typeof filterIDPrefix}${string}`;

export function generateFilterID(): FilterID {
  return generateID(filterIDPrefix);
}

export function validateFilterID(id: string): void {
  return validateID(filterIDPrefix, id);
}

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
  rule: MultiOptionFieldKindFilterRule;
  value: MultiCollaboratorFieldFilterValue;
}
type MultiCollaboratorFieldFilterValue = CollaboratorID[];
export interface MultiCollaboratorFieldFilter
  extends BaseFilter,
    MultiCollaboratorFieldFilterConfig {}

export interface MultiDocumentLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiOptionFieldKindFilterRule;
  value: MultiDocumentLinkFieldFilterValue;
}
type MultiDocumentLinkFieldFilterValue = DocumentID[];
export interface MultiDocumentLinkFieldFilter
  extends BaseFilter,
    MultiDocumentLinkFieldFilterConfig {}

export interface MultiLineTextFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface MultiLineTextFieldFilter
  extends BaseFilter,
    MultiLineTextFieldFilterConfig {}

export interface MultiSelectFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiOptionFieldKindFilterRule;
  value: MultiSelectFieldFilterValue;
}
type MultiSelectFieldFilterValue = SelectOptionID[];

export interface MultiSelectFieldFilter
  extends BaseFilter,
    MultiSelectFieldFilterConfig {}

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
  rule: SingleOptionFieldKindFilterRule;
  value: SingleCollaboratorFieldFilterValue;
}
type SingleCollaboratorFieldFilterValue =
  | CollaboratorID
  | CollaboratorID[]
  | null;

export interface SingleCollaboratorFieldFilter
  extends BaseFilter,
    SingleCollaboratorFieldFilterConfig {}

export interface SingleDocumentLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleOptionFieldKindFilterRule;
  value: SingleDocumentLinkFieldFilterValue;
}
type SingleDocumentLinkFieldFilterValue = DocumentID | DocumentID[] | null;

export interface SingleDocumentLinkFieldFilter
  extends BaseFilter,
    SingleDocumentLinkFieldFilterConfig {}

export interface SingleLineTextFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface SingleLineTextFieldFilter
  extends BaseFilter,
    SingleLineTextFieldFilterConfig {}

export interface SingleSelectFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleOptionFieldKindFilterRule;
  value: SingleSelectFieldFilterValue;
}
type SingleSelectFieldFilterValue = SelectOptionID | SelectOptionID[] | null;

export interface SingleSelectFieldFilter
  extends BaseFilter,
    SingleSelectFieldFilterConfig {}

export interface URLFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface URLFieldFilter extends BaseFilter, URLFieldFilterConfig {}

// eslint-disable-next-line
export enum TextFieldKindFilterRule {
  Contains = "Contains",
  DoesNotContain = "DoesNotContain",
  Is = "Is",
  IsNot = "IsNot",
  IsEmpty = "IsEmpty",
  IsNotEmpty = "IsNotEmpty",
}
export type TextFieldKindFilterRuleValue = string;

// eslint-disable-next-line
export enum SingleOptionFieldKindFilterRule {
  Is = "Is",
  IsNot = "IsNot",
  IsAnyOf = "IsAnyOf",
  IsNoneOf = "IsNoneOf",
  IsEmpty = "IsEmpty",
  IsNotEmpty = "IsNotEmpty",
}
export type SingleOptionFieldKindFilterRuleValue =
  | SingleSelectFieldFilterValue
  | SingleCollaboratorFieldFilterValue
  | SingleDocumentLinkFieldFilterValue;

// eslint-disable-next-line
export enum MultiOptionFieldKindFilterRule {
  HasAnyOf = "HasAnyOf",
  HasAllOf = "HasAllOf",
  HasNoneOf = "HasNoneOf",
  IsEmpty = "IsEmpty",
  IsNotEmpty = "IsNotEmpty",
}
export type MultiOptionFieldKindFilterRuleValue =
  | MultiSelectFieldFilterValue
  | MultiCollaboratorFieldFilterValue
  | MultiDocumentLinkFieldFilterValue;

// eslint-disable-next-line
export enum DateFieldKindFilterRule {
  Is = "Is",
  IsWithin = "IsWithin",
  IsBefore = "IsBefore",
  IsAfter = "IsAfter",
  IsOnOrBefore = "IsOnOrBefore",
  IsOnOrAfter = "IsOnOrAfter",
  IsNot = "IsNot",
  IsEmpty = "IsEmpty",
  IsNotEmpty = "IsNotEmpty",
}
export type DateFieldKindFilterRuleValue = ISODate | ISODateInterval | null;

// eslint-disable-next-line
export enum NumberFieldKindFilterRule {
  Equal = "Equal",
  NotEqual = "NotEqual",
  LessThan = "LessThan",
  GreaterThan = "GreaterThan",
  LessThanOrEqual = "LessThanOrEqual",
  GreaterThanOrEqual = "GreaterThanOrEqual",
  IsEmpty = "IsEmpty",
  IsNotEmpty = "IsNotEmpty",
}
export type NumberFieldKindFilterRuleValue = number | null;

// eslint-disable-next-line
export enum BooleanFieldKindFilterRule {
  Is = "Is",
}
export type BooleanFieldKindFilterRuleValue = boolean;

export type FilterRule =
  | BooleanFieldKindFilterRule
  | DateFieldKindFilterRule
  | MultiOptionFieldKindFilterRule
  | NumberFieldKindFilterRule
  | SingleOptionFieldKindFilterRule
  | TextFieldKindFilterRule;

export type FilterRuleValue =
  | BooleanFieldKindFilterRuleValue
  | DateFieldKindFilterRuleValue
  | MultiOptionFieldKindFilterRuleValue
  | NumberFieldKindFilterRuleValue
  | SingleOptionFieldKindFilterRuleValue
  | TextFieldKindFilterRuleValue;

export type FilterConfig =
  | BooleanFieldKindFilterConfig
  | DateFieldKindFilterConfig
  | MultiOptionFieldKindFilterConfig
  | NumberFieldKindFilterConfig
  | SingleOptionFieldKindFilterConfig
  | TextFieldKindFilterConfig;

export type Filter =
  | BooleanFieldKindFilter
  | DateFieldKindFilter
  | MultiOptionFieldKindFilter
  | NumberFieldKindFilter
  | SingleOptionFieldKindFilter
  | TextFieldKindFilter;

export type FilterGroup = Filter[];

export type BooleanFieldKindFilter = CheckboxFieldFilter;
export type DateFieldKindFilter = DateFieldFilter;
export type MultiOptionFieldKindFilter =
  | MultiCollaboratorFieldFilter
  | MultiDocumentLinkFieldFilter
  | MultiSelectFieldFilter;
export type NumberFieldKindFilter = CurrencyFieldFilter | NumberFieldFilter;
export type SingleOptionFieldKindFilter =
  | SingleCollaboratorFieldFilter
  | SingleDocumentLinkFieldFilter
  | SingleSelectFieldFilter;
export type TextFieldKindFilter =
  | EmailFieldFilter
  | MultiLineTextFieldFilter
  | PhoneNumberFieldFilter
  | SingleLineTextFieldFilter
  | URLFieldFilter;

export type BooleanFieldKindFilterConfig = CheckboxFieldFilterConfig;
export type DateFieldKindFilterConfig = DateFieldFilterConfig;
export type MultiOptionFieldKindFilterConfig =
  | MultiCollaboratorFieldFilterConfig
  | MultiDocumentLinkFieldFilterConfig
  | MultiSelectFieldFilterConfig;
export type NumberFieldKindFilterConfig =
  | CurrencyFieldFilterConfig
  | NumberFieldFilterConfig;
export type SingleOptionFieldKindFilterConfig =
  | SingleCollaboratorFieldFilterConfig
  | SingleDocumentLinkFieldFilterConfig
  | SingleSelectFieldFilterConfig;
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
        value: "",
      };
    case FieldType.Number:
    case FieldType.Currency:
      return {
        fieldID: field.id,
        rule: NumberFieldKindFilterRule.Equal,
        value: null,
      };
    case FieldType.MultiCollaborator:
    case FieldType.MultiDocumentLink:
    case FieldType.MultiSelect:
      return {
        fieldID: field.id,
        rule: MultiOptionFieldKindFilterRule.HasAnyOf,
        value: [],
      };
    case FieldType.SingleSelect:
    case FieldType.SingleDocumentLink:
    case FieldType.SingleCollaborator:
      return {
        fieldID: field.id,
        rule: SingleOptionFieldKindFilterRule.Is,
        value: null,
      };
  }
}

export function updateFilterGroup(
  filter: Filter,
  value: "and" | "or",
  filters: Filter[]
): { [filterID: string]: Filter } {
  const updatedFilters: { [filterID: string]: Filter } = {};
  const filterIndex = filters.findIndex((f) => f.id === filter.id);

  // Guaranteed to have previous filter given UI
  const prevFilter: Filter = filters[filterIndex - 1];

  let op: "add" | "sub" | null = null;

  if (value === "and" && prevFilter.group !== filter.group) {
    op = "sub";
  } else if (value === "or" && prevFilter.group === filter.group) {
    op = "add";
  }

  if (op === null) {
    return updatedFilters;
  }

  const nextFilters = filters.slice(filterIndex);

  for (const nextFilter of nextFilters) {
    updatedFilters[nextFilter.id] = {
      ...nextFilter,
      group: nextFilter.group + (op === "sub" ? -1 : 1),
    };
  }

  return updatedFilters;
}

export function deleteFilter(
  filter: Filter,
  filters: Filter[]
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

export function filterDocuments(
  filterGroups: FilterGroup[],
  documents: Document[],
  getters: FilterGetters
): Document[] {
  const { getField } = getters;

  let filteredDocuments = documents;

  filteredDocuments = filteredDocuments.filter((document) => {
    if (isEmpty(filterGroups)) {
      return true;
    }

    return filterGroups.some((filterGroup) => {
      return filterGroup.every((filter) => {
        const field = getField(filter.fieldID);

        return filterByFilter(field, document.fields[filter.fieldID], filter);
      });
    });
  });

  return filteredDocuments;
}

function filterByFilter(
  field: Field,
  value: FieldValue,
  filter: Filter
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
    case FieldType.MultiDocumentLink:
    case FieldType.MultiSelect:
      assertMultiOptionFieldKindValue(value);
      assertMultiSelectFilter(filter);

      return filterByMultiOptionFieldKindFilter(value, filter);
    case FieldType.SingleCollaborator:
    case FieldType.SingleDocumentLink:
    case FieldType.SingleSelect:
      assertSingleOptionFieldKindValue(value);
      assertSingleSelectFilter(filter);
      return filterBySingleOptionFieldKindFilter(value, filter);
  }
}

export function filterByTextFieldKindFilter(
  value: TextFieldKindValue,
  filter: TextFieldKindFilter
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
  filterValue: TextFieldKindFilterRuleValue
): boolean {
  return value.toLowerCase().includes(filterValue.toLowerCase());
}
export function filterByTextFieldKindFilterRuleDoesNotContain(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue
): boolean {
  return !value.toLowerCase().includes(filterValue.toLowerCase());
}
export function filterByTextFieldKindFilterRuleIs(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue
): boolean {
  return value === filterValue;
}
export function filterByTextFieldKindFilterRuleIsNot(
  value: TextFieldKindValue,
  filterValue: TextFieldKindFilterRuleValue
): boolean {
  return value !== filterValue;
}
export function filterByTextFieldKindFilterRuleIsEmpty(
  value: TextFieldKindValue
): boolean {
  return value === "";
}
export function filterByTextFieldKindFilterRuleIsNotEmpty(
  value: TextFieldKindValue
): boolean {
  return value !== "";
}

export function filterByNumberFieldKindFilter(
  value: NumberFieldKindValue,
  filter: NumberFieldFilter
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
        filter.value
      );
    case NumberFieldKindFilterRule.GreaterThanOrEqual:
      return filterByNumberFieldKindFilterRuleGreaterThanOrEqual(
        value,
        filter.value
      );
    case NumberFieldKindFilterRule.IsEmpty:
      return filterByNumberFieldKindFilterRuleIsEmpty(value);
    case NumberFieldKindFilterRule.IsNotEmpty:
      return filterByNumberFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByNumberFieldKindFilterRuleEqual(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue
): boolean {
  return value === filterValue;
}

export function filterByNumberFieldKindFilterRuleNotEqual(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue
): boolean {
  return value !== filterValue;
}

export function filterByNumberFieldKindFilterRuleLessThan(
  value: NumberFieldKindValue,
  filterValue: NumberFieldKindFilterRuleValue
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
  filterValue: NumberFieldKindFilterRuleValue
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
  filterValue: NumberFieldKindFilterRuleValue
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
  filterValue: NumberFieldKindFilterRuleValue
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
  value: NumberFieldKindValue
): boolean {
  return value === null;
}

export function filterByNumberFieldKindFilterRuleIsNotEmpty(
  value: NumberFieldKindValue
): boolean {
  return value !== null;
}

export function filterByDateFieldKindFilter(
  value: DateFieldKindValue,
  filter: DateFieldFilter
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
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return isSameDay(parseISODate(value), parseISODate(filterValue));
}

export function filterByDateFieldKindFilterRuleIsWithin(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return isWithinDateInterval(
    parseISODate(value),
    parseISODateInterval(filterValue)
  );
}

export function filterByDateFieldKindFilterRuleIsBefore(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return isBefore(parseISODate(value), parseISODate(filterValue));
}

export function filterByDateFieldKindFilterRuleIsAfter(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return isAfter(parseISODate(value), parseISODate(filterValue));
}

export function filterByDateFieldKindFilterRuleIsOnOrBefore(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return (
    isBefore(parseISODate(value), parseISODate(filterValue)) ||
    isSameDay(parseISODate(value), parseISODate(filterValue))
  );
}

export function filterByDateFieldKindFilterRuleIsOnOrAfter(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return (
    isAfter(parseISODate(value), parseISODate(filterValue)) ||
    isSameDay(parseISODate(value), parseISODate(filterValue))
  );
}

export function filterByDateFieldKindFilterRuleIsNot(
  value: DateFieldKindValue,
  filterValue: DateFieldKindFilterRuleValue
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
        filterValue
      )}`
    );
  }

  if (!isISODate(value)) {
    throw new Error(
      `Expected value to be ISODate. Received ${JSON.stringify(value)}`
    );
  }

  return !isSameDay(parseISODate(value), parseISODate(filterValue));
}

export function filterBySingleOptionFieldKindFilter(
  value: SingleOptionFieldKindValue,
  filter: SingleOptionFieldKindFilter
): boolean {
  switch (filter.rule) {
    case SingleOptionFieldKindFilterRule.Is:
      return filterBySingleOptionFieldKindFilterRuleIs(value, filter.value);
    case SingleOptionFieldKindFilterRule.IsNot:
      return filterBySingleOptionFieldKindFilterRuleIsNot(value, filter.value);
    case SingleOptionFieldKindFilterRule.IsAnyOf:
      return filterBySingleOptionFieldKindFilterRuleIsAnyOf(
        value,
        filter.value
      );
    case SingleOptionFieldKindFilterRule.IsNoneOf:
      return filterBySingleOptionFieldKindFilterRuleIsNoneOf(
        value,
        filter.value
      );
    case SingleOptionFieldKindFilterRule.IsEmpty:
      return filterBySingleOptionFieldKindFilterRuleIsEmpty(value);
    case SingleOptionFieldKindFilterRule.IsNotEmpty:
      return filterBySingleOptionFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByDateFieldKindFilterRuleIsEmpty(
  value: DateFieldKindValue
): boolean {
  return value === null;
}

export function filterByDateFieldKindFilterRuleIsNotEmpty(
  value: DateFieldKindValue
): boolean {
  return value !== null;
}

export function filterBySingleOptionFieldKindFilterRuleIs(
  value: SingleOptionFieldKindValue,
  filterValue: SingleOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  if (typeof filterValue !== "string") {
    throw new Error(
      `Expected filterValue to be string. Received ${JSON.stringify(
        filterValue
      )}`
    );
  }

  return value === filterValue;
}

export function filterBySingleOptionFieldKindFilterRuleIsNot(
  value: SingleOptionFieldKindValue,
  filterValue: SingleOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  if (typeof filterValue !== "string") {
    throw new Error(
      `Expected filterValue to be string. Received ${JSON.stringify(
        filterValue
      )}`
    );
  }

  return value !== filterValue;
}

export function filterBySingleOptionFieldKindFilterRuleIsAnyOf(
  value: SingleOptionFieldKindValue,
  filterValue: SingleOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (typeof filterValue === "string") {
    throw new Error(
      `Expected filterValue to be string[]. Received ${JSON.stringify(
        filterValue
      )}`
    );
  }

  return hasAnyOf([value], filterValue);
}

export function filterBySingleOptionFieldKindFilterRuleIsNoneOf(
  value: SingleOptionFieldKindValue,
  filterValue: SingleOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  if (filterValue === null) {
    return true;
  }

  if (typeof filterValue === "string") {
    throw new Error(
      `Expected filterValue to be string[]. Received ${JSON.stringify(
        filterValue
      )}`
    );
  }

  return hasNoneOf([value], filterValue);
}

export function filterBySingleOptionFieldKindFilterRuleIsEmpty(
  value: SingleOptionFieldKindValue
): boolean {
  return value === null;
}

export function filterBySingleOptionFieldKindFilterRuleIsNotEmpty(
  value: SingleOptionFieldKindValue
): boolean {
  return value !== null;
}

export function filterByMultiOptionFieldKindFilter(
  value: MultiOptionFieldKindValue,
  filter: MultiOptionFieldKindFilter
): boolean {
  switch (filter.rule) {
    case MultiOptionFieldKindFilterRule.HasAnyOf:
      return filterByMultiOptionFieldKindFilterRuleHasAnyOf(
        value,
        filter.value
      );
    case MultiOptionFieldKindFilterRule.HasAllOf:
      return filterByMultiOptionFieldKindFilterRuleHasAllOf(
        value,
        filter.value
      );
    case MultiOptionFieldKindFilterRule.HasNoneOf:
      return filterByMultiOptionFieldKindFilterRuleHasNoneOf(
        value,
        filter.value
      );
    case MultiOptionFieldKindFilterRule.IsEmpty:
      return filterByMultiOptionFieldKindFilterRuleIsEmpty(value);
    case MultiOptionFieldKindFilterRule.IsNotEmpty:
      return filterByMultiOptionFieldKindFilterRuleIsNotEmpty(value);
  }
}

export function filterByMultiOptionFieldKindFilterRuleHasAnyOf(
  value: MultiOptionFieldKindValue,
  filterValue: MultiOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  return hasAnyOf<CollaboratorID | DocumentID | SelectOptionID>(
    value,
    filterValue
  );
}
export function filterByMultiOptionFieldKindFilterRuleHasAllOf(
  value: MultiOptionFieldKindValue,
  filterValue: MultiOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  return hasAllOf<CollaboratorID | DocumentID | SelectOptionID>(
    value,
    filterValue
  );
}
export function filterByMultiOptionFieldKindFilterRuleHasNoneOf(
  value: MultiOptionFieldKindValue,
  filterValue: MultiOptionFieldKindFilterRuleValue
): boolean {
  if (value === null) {
    return false;
  }

  return hasNoneOf<CollaboratorID | DocumentID | SelectOptionID>(
    value,
    filterValue
  );
}
export function filterByMultiOptionFieldKindFilterRuleIsEmpty(
  value: MultiOptionFieldKindValue
): boolean {
  return isEmpty<CollaboratorID | DocumentID | SelectOptionID>(value);
}
export function filterByMultiOptionFieldKindFilterRuleIsNotEmpty(
  value: MultiOptionFieldKindValue
): boolean {
  return !isEmpty<CollaboratorID | DocumentID | SelectOptionID>(value);
}

export function assertNumberFieldKindFilterRule(
  rule: FilterRule
): asserts rule is NumberFieldKindFilterRule {
  if (rule in NumberFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid NumberFieldKindFilterRule. Received ${rule}`
  );
}

export function assertTextFieldKindFilterRule(
  rule: FilterRule
): asserts rule is TextFieldKindFilterRule {
  if (rule in TextFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid TextFieldKindFilterRule. Received ${rule}`
  );
}

export function assertDateFieldKindFilterRule(
  rule: FilterRule
): asserts rule is DateFieldKindFilterRule {
  if (rule in DateFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid DateFieldKindFilterRule. Received ${rule}`
  );
}

export function assertMultiOptionFieldKindFilterRule(
  rule: FilterRule
): asserts rule is MultiOptionFieldKindFilterRule {
  if (rule in MultiOptionFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid MultiOptionFieldKindFilterRule. Received ${rule}`
  );
}

export function assertSingleOptionFieldKindFilterRule(
  rule: FilterRule
): asserts rule is SingleOptionFieldKindFilterRule {
  if (rule in SingleOptionFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid SingleOptionFieldKindFilterRule. Received ${rule}`
  );
}

export function assertBooleanFilterRule(
  rule: FilterRule
): asserts rule is BooleanFieldKindFilterRule {
  if (rule in BooleanFieldKindFilterRule) {
    return;
  }

  throw Error(
    `Expected one of valid BooleanFieldKindFilterRule. Received ${rule}`
  );
}

export function filterByBooleanFieldKindFilter(
  value: BooleanFieldKindValue,
  filter: BooleanFieldKindFilter
): boolean {
  return filterByBooleanFieldKindFilterRuleIs(value, filter.value);
}

export function filterByBooleanFieldKindFilterRuleIs(
  value: BooleanFieldKindValue,
  filterValue: BooleanFieldKindFilterRuleValue
): boolean {
  return value === filterValue;
}

export function assertBooleanFilter(
  filter: Filter
): asserts filter is BooleanFieldKindFilter {
  assertBooleanFilterRule(filter.rule);
}

export function assertDateFilter(
  filter: Filter
): asserts filter is DateFieldKindFilter {
  assertDateFieldKindFilterRule(filter.rule);
}

export function assertMultiSelectFilter(
  filter: Filter
): asserts filter is MultiOptionFieldKindFilter {
  assertMultiOptionFieldKindFilterRule(filter.rule);
}

export function assertNumberFilter(
  filter: Filter
): asserts filter is NumberFieldKindFilter {
  assertNumberFieldKindFilterRule(filter.rule);
}

export function assertSingleSelectFilter(
  filter: Filter
): asserts filter is SingleOptionFieldKindFilter {
  assertSingleOptionFieldKindFilterRule(filter.rule);
}

export function assertTextFilter(
  filter: Filter
): asserts filter is TextFieldKindFilter {
  assertTextFieldKindFilterRule(filter.rule);
}

export function assertBooleanFieldKindFilterConfig(
  filterConfig: FilterConfig
): asserts filterConfig is BooleanFieldKindFilterConfig {
  assertBooleanFilterRule(filterConfig.rule);
}

export function assertDateFieldKindFilterConfig(
  filterConfig: FilterConfig
): asserts filterConfig is DateFieldKindFilterConfig {
  assertDateFieldKindFilterRule(filterConfig.rule);
}

export function assertMultiSelectFilterConfig(
  filterConfig: FilterConfig
): asserts filterConfig is MultiOptionFieldKindFilterConfig {
  assertMultiOptionFieldKindFilterRule(filterConfig.rule);
}

export function assertNumberFilterConfig(
  filterConfig: FilterConfig
): asserts filterConfig is NumberFieldKindFilterConfig {
  assertNumberFieldKindFilterRule(filterConfig.rule);
}

export function assertSingleSelectFilterConfig(
  filterConfig: FilterConfig
): asserts filterConfig is SingleOptionFieldKindFilterConfig {
  assertSingleOptionFieldKindFilterRule(filterConfig.rule);
}

export function assertTextFilterConfig(
  filterConfig: FilterConfig
): asserts filterConfig is TextFieldKindFilterConfig {
  assertTextFieldKindFilterRule(filterConfig.rule);
}
