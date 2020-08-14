import { isSameDay, isWithinInterval, isBefore, isAfter } from 'date-fns';
import {
  FieldValue,
  assertTextFieldValue,
  assertNumberFieldValue,
  assertDateFieldValue,
  assertSingleSelectFieldValue,
  assertMultiSelectFieldValue,
  assertBooleanFieldValue,
} from './documents';
import {
  hasAnyOf,
  hasAllOf,
  hasNoneOf,
  isEmpty,
} from '../../lib/data_structures/arrays';
import { FieldID, Field, FieldType } from './fields';
import { ViewID } from './views';
import {
  DateValue,
  CurrencyValue,
  NumberFieldValue,
  CheckboxValue,
  TextFieldValue,
  SingleSelectFieldValue,
  MultiSelectFieldValue,
  BooleanFieldValue,
} from './documents';

export type FilterID = string;

export interface BaseFilter {
  id: FilterID;
  viewID: ViewID;
  // Group filters to make "AND" and "OR" filters
  // "AND" belong to the same group, "OR" will have different group
  group: number;
}

export interface CheckboxFieldFilterConfig {
  fieldID: FieldID;
  rule: BooleanFilterRule;
  value: BooleanFilterRuleValue;
}
export interface CheckboxFieldFilter
  extends BaseFilter,
    CheckboxFieldFilterConfig {}

export interface CurrencyFieldFilterConfig {
  fieldID: FieldID;
  rule: NumberFilterRule;
  value: NumberFilterRuleValue;
}
export interface CurrencyFieldFilter
  extends BaseFilter,
    CurrencyFieldFilterConfig {}

export interface DateFieldFilterConfig {
  fieldID: FieldID;
  rule: DateFilterRule;
  value: DateFilterRuleValue;
}
export interface DateFieldFilter extends BaseFilter, DateFieldFilterConfig {}

export interface EmailFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface EmailFieldFilter extends BaseFilter, EmailFieldFilterConfig {}

export interface MultiCollaboratorFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFilterRule;
  value: MultiSelectFilterRuleValue;
}
export interface MultiCollaboratorFieldFilter
  extends BaseFilter,
    MultiCollaboratorFieldFilterConfig {}

export interface MultiDocumentLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFilterRule;
  value: MultiSelectFilterRuleValue;
}
export interface MultiDocumentLinkFieldFilter
  extends BaseFilter,
    MultiDocumentLinkFieldFilterConfig {}

export interface MultiLineTextFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface MultiLineTextFieldFilter
  extends BaseFilter,
    MultiLineTextFieldFilterConfig {}

export interface MultiOptionFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFilterRule;
  value: MultiSelectFilterRuleValue;
}
export interface MultiOptionFieldFilter
  extends BaseFilter,
    MultiOptionFieldFilterConfig {}

export interface NumberFieldFilterConfig {
  fieldID: FieldID;
  rule: NumberFilterRule;
  value: NumberFilterRuleValue;
}
export interface NumberFieldFilter
  extends BaseFilter,
    NumberFieldFilterConfig {}

export interface PhoneNumberFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface PhoneNumberFieldFilter
  extends BaseFilter,
    PhoneNumberFieldFilterConfig {}

export interface SingleCollaboratorFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFilterRule;
  value: SingleSelectFilterRuleValue;
}
export interface SingleCollaboratorFieldFilter
  extends BaseFilter,
    SingleCollaboratorFieldFilterConfig {}

export interface SingleDocumentLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFilterRule;
  value: SingleSelectFilterRuleValue;
}
export interface SingleDocumentLinkFieldFilter
  extends BaseFilter,
    SingleDocumentLinkFieldFilterConfig {}

export interface SingleLineTextFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface SingleLineTextFieldFilter
  extends BaseFilter,
    SingleLineTextFieldFilterConfig {}

export interface SingleOptionFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFilterRule;
  value: SingleSelectFilterRuleValue;
}
export interface SingleOptionFieldFilter
  extends BaseFilter,
    SingleOptionFieldFilterConfig {}

export interface URLFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface URLFieldFilter extends BaseFilter, URLFieldFilterConfig {}

export type TextFilterRule =
  | 'contains'
  | 'doesNotContain'
  | 'is'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';
export type TextFilterRuleValue = string;

export type SingleSelectFilterRule =
  | 'is'
  | 'isNot'
  | 'isAnyOf'
  | 'isNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';
export type SingleSelectFilterRuleValue = string | string[] | null;

export type MultiSelectFilterRule =
  | 'hasAnyOf'
  | 'hasAllOf'
  | 'hasNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';
export type MultiSelectFilterRuleValue = string[];

export type DateFilterRule =
  | 'is'
  | 'isWithin'
  | 'isBefore'
  | 'isAfter'
  | 'isOnOrBefore'
  | 'isOnOrAfter'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';
export type DateFilterRuleValue = Date | Interval | null;

export type NumberFilterRule =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';
export type NumberFilterRuleValue = number | null;

export type BooleanFilterRule = 'is';
export type BooleanFilterRuleValue = boolean;

export type FilterRule =
  | DateFilterRule
  | MultiSelectFilterRule
  | NumberFilterRule
  | SingleSelectFilterRule
  | TextFilterRule;

export type FilterRuleValue =
  | DateFilterRuleValue
  | MultiSelectFilterRuleValue
  | NumberFilterRuleValue
  | SingleSelectFilterRuleValue
  | TextFilterRuleValue;

export type FilterConfig =
  | BooleanFilterConfig
  | DateFilterConfig
  | MultiSelectFilterConfig
  | NumberFilterConfig
  | SingleSelectFilterConfig
  | TextFilterConfig;

export type Filter =
  | BooleanFilter
  | DateFilter
  | MultiSelectFilter
  | NumberFilter
  | SingleSelectFilter
  | TextFilter;

export type FilterGroup = Filter[];

export type BooleanFilter = CheckboxFieldFilter;
export type DateFilter = DateFieldFilter;
export type MultiSelectFilter =
  | MultiCollaboratorFieldFilter
  | MultiDocumentLinkFieldFilter
  | MultiOptionFieldFilter;
export type NumberFilter = CurrencyFieldFilter | NumberFieldFilter;
export type SingleSelectFilter =
  | SingleCollaboratorFieldFilter
  | SingleDocumentLinkFieldFilter
  | SingleOptionFieldFilter;
export type TextFilter =
  | EmailFieldFilter
  | MultiLineTextFieldFilter
  | PhoneNumberFieldFilter
  | SingleLineTextFieldFilter
  | URLFieldFilter;

export type BooleanFilterConfig = CheckboxFieldFilterConfig;
export type DateFilterConfig = DateFieldFilterConfig;
export type MultiSelectFilterConfig =
  | MultiCollaboratorFieldFilterConfig
  | MultiDocumentLinkFieldFilterConfig
  | MultiOptionFieldFilterConfig;
export type NumberFilterConfig =
  | CurrencyFieldFilterConfig
  | NumberFieldFilterConfig;
export type SingleSelectFilterConfig =
  | SingleCollaboratorFieldFilterConfig
  | SingleDocumentLinkFieldFilterConfig
  | SingleOptionFieldFilterConfig;
export type TextFilterConfig =
  | EmailFieldFilterConfig
  | MultiLineTextFieldFilterConfig
  | PhoneNumberFieldFilterConfig
  | SingleLineTextFieldFilterConfig
  | URLFieldFilterConfig;

export function getDefaultFilterConfig(field: Field): FilterConfig {
  switch (field.type) {
    case FieldType.Checkbox:
      return { fieldID: field.id, rule: 'is', value: false };
    case FieldType.Date:
      return { fieldID: field.id, rule: 'is', value: null };
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return { fieldID: field.id, rule: 'contains', value: '' };
    case FieldType.Number:
    case FieldType.Currency:
      return { fieldID: field.id, rule: 'equal', value: null };
    case FieldType.MultiCollaborator:
    case FieldType.MultiDocumentLink:
    case FieldType.MultiOption:
      return { fieldID: field.id, rule: 'hasAnyOf', value: [] };
    case FieldType.SingleOption:
    case FieldType.SingleDocumentLink:
    case FieldType.SingleCollaborator:
      return { fieldID: field.id, rule: 'is', value: null };
    default:
      throw new Error(`Expected default filter config for ${field}`);
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

export function assertNumberFilterRule(
  rule: FilterRule,
): asserts rule is NumberFilterRule {
  if (rule in numberFiltersByRule) {
    return;
  }

  throw Error(`Expected one of valid NumberFilterRule. Received ${rule}`);
}

export function assertTextFilterRule(
  rule: FilterRule,
): asserts rule is TextFilterRule {
  if (rule in textFiltersByRule) {
    return;
  }

  throw Error(`Expected one of valid TextFilterRule. Received ${rule}`);
}

export function assertDateFilterRule(
  rule: FilterRule,
): asserts rule is DateFilterRule {
  if (rule in dateFiltersByRule) {
    return;
  }

  throw Error(`Expected one of valid DateFilterRule. Received ${rule}`);
}

export function assertMultiSelectFilterRule(
  rule: FilterRule,
): asserts rule is MultiSelectFilterRule {
  if (rule in multiSelectFiltersByRule) {
    return;
  }

  throw Error(`Expected one of valid MultiSelectFilterRule. Received ${rule}`);
}

export function assertSingleSelectFilterRule(
  rule: FilterRule,
): asserts rule is SingleSelectFilterRule {
  if (rule in singleSelectFiltersByRule) {
    return;
  }

  throw Error(`Expected one of valid SingleSelectFilterRule. Received ${rule}`);
}

export function assertBooleanFilterRule(
  rule: FilterRule,
): asserts rule is BooleanFilterRule {
  if (rule in booleanFiltersByRule) {
    return;
  }

  throw Error(`Expected one of valid BooleanFilterRule. Received ${rule}`);
}

export function applyTextFilter(
  value: TextFieldValue,
  filter: TextFilter,
): boolean {
  return textFiltersByRule[filter.rule](value, filter.value);
}

export const textFiltersByRule: {
  [rule in TextFilterRule]: (
    value: TextFieldValue,
    filterValue: TextFilterRuleValue,
  ) => boolean;
} = {
  contains: (value, filterValue) => {
    return value.toLowerCase().includes(filterValue.toLowerCase());
  },
  doesNotContain: (value, filterValue) => {
    return !value.toLowerCase().includes(filterValue.toLowerCase());
  },
  is: (value, filterValue) => {
    return value === filterValue;
  },
  isNot: (value, filterValue) => {
    return value !== filterValue;
  },
  isEmpty: (value) => {
    return value === '';
  },
  isNotEmpty: (value) => {
    return value !== '';
  },
};

export function applyNumberFilter(
  value: NumberFieldValue,
  filter: NumberFieldFilter,
): boolean {
  return numberFiltersByRule[filter.rule](value, filter.value);
}

export const numberFiltersByRule: {
  [rule in NumberFilterRule]: (
    value: CurrencyValue | NumberFieldValue,
    filterValue: NumberFilterRuleValue,
  ) => boolean;
} = {
  equal: (value, filterValue) => {
    return value === filterValue;
  },
  notEqual: (value, filterValue) => {
    return value !== filterValue;
  },
  lessThan: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    return value < filterValue;
  },
  greaterThan: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    return value > filterValue;
  },
  lessThanOrEqual: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    return value <= filterValue;
  },
  greaterThanOrEqual: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    return value >= filterValue;
  },
  isEmpty: (value) => {
    return value === null;
  },
  isNotEmpty: (value) => {
    return value !== null;
  },
};

export function applyDateFilter(
  value: DateValue,
  filter: DateFieldFilter,
): boolean {
  return dateFiltersByRule[filter.rule](value, filter.value);
}

export const dateFiltersByRule: {
  [rule in DateFilterRule]: (
    value: DateValue,
    filterValue: DateFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!(filterValue instanceof Date)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${filterValue}`,
      );
    }

    return isSameDay(value, filterValue);
  },
  isWithin: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    if (filterValue instanceof Date) {
      throw new Error(
        `Expected filterValue to be Interval. Received ${filterValue}`,
      );
    }

    return isWithinInterval(value, filterValue);
  },
  isBefore: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!(filterValue instanceof Date)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${filterValue}`,
      );
    }

    return isBefore(value, filterValue);
  },
  isAfter: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!(filterValue instanceof Date)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${filterValue}`,
      );
    }

    return isAfter(value, filterValue);
  },
  isOnOrBefore: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!(filterValue instanceof Date)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${filterValue}`,
      );
    }

    return isBefore(value, filterValue) || isSameDay(value, filterValue);
  },
  isOnOrAfter: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!(filterValue instanceof Date)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${filterValue}`,
      );
    }

    return isAfter(value, filterValue) || isSameDay(value, filterValue);
  },
  isNot: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!(filterValue instanceof Date)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${filterValue}`,
      );
    }

    return !isSameDay(value, filterValue);
  },
  isEmpty: (value) => {
    return value === null;
  },
  isNotEmpty: (value) => {
    return value !== null;
  },
};

export function applySingleSelectFilter(
  value: SingleSelectFieldValue,
  filter: SingleSelectFilter,
): boolean {
  return singleSelectFiltersByRule[filter.rule](value, filter.value);
}

export const singleSelectFiltersByRule: {
  [rule in SingleSelectFilterRule]: (
    value: SingleSelectFieldValue,
    filterValue: SingleSelectFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (typeof filterValue !== 'string') {
      throw new Error(
        `Expected filterValue to be string. Received ${filterValue}`,
      );
    }

    return value === filterValue;
  },
  isNot: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (typeof filterValue !== 'string') {
      throw new Error(
        `Expected filterValue to be string. Received ${filterValue}`,
      );
    }

    return value !== filterValue;
  },
  isAnyOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    if (typeof filterValue === 'string') {
      throw new Error(
        `Expected filterValue to be string[]. Received ${filterValue}`,
      );
    }

    return hasAnyOf([value], filterValue);
  },
  isNoneOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    if (typeof filterValue === 'string') {
      throw new Error(
        `Expected filterValue to be string[]. Received ${filterValue}`,
      );
    }

    return hasNoneOf([value], filterValue);
  },
  isEmpty: (value) => {
    return value === null;
  },
  isNotEmpty: (value) => {
    return value !== null;
  },
};

export function applyMultiSelectFilter(
  value: MultiSelectFieldValue,
  filter: MultiSelectFilter,
): boolean {
  return multiSelectFiltersByRule[filter.rule](value, filter.value);
}

export const multiSelectFiltersByRule: {
  [rule in MultiSelectFilterRule]: (
    value: MultiSelectFieldValue,
    filterValue: MultiSelectFilterRuleValue,
  ) => boolean;
} = {
  hasAnyOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return hasAnyOf(value, filterValue);
  },
  hasAllOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return hasAllOf(value, filterValue);
  },
  hasNoneOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return hasNoneOf(value, filterValue);
  },
  isEmpty: (value) => {
    return isEmpty(value);
  },
  isNotEmpty: (value) => {
    return !isEmpty(value);
  },
};

export function applyBooleanFilter(
  value: BooleanFieldValue,
  filter: BooleanFilter,
): boolean {
  return booleanFiltersByRule[filter.rule](value, filter.value);
}

export const booleanFiltersByRule: {
  [rule in BooleanFilterRule]: (
    value: CheckboxValue,
    filterValue: BooleanFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    return value === filterValue;
  },
};

export function assertBooleanFilter(
  filter: Filter,
): asserts filter is BooleanFilter {
  assertBooleanFilterRule(filter.rule);
}

export function assertDateFilter(filter: Filter): asserts filter is DateFilter {
  assertDateFilterRule(filter.rule);
}

export function assertMultiSelectFilter(
  filter: Filter,
): asserts filter is MultiSelectFilter {
  assertMultiSelectFilterRule(filter.rule);
}

export function assertNumberFilter(
  filter: Filter,
): asserts filter is NumberFilter {
  assertNumberFilterRule(filter.rule);
}

export function assertSingleSelectFilter(
  filter: Filter,
): asserts filter is SingleSelectFilter {
  assertSingleSelectFilterRule(filter.rule);
}

export function assertTextFilter(filter: Filter): asserts filter is TextFilter {
  assertTextFilterRule(filter.rule);
}

export function assertBooleanFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is BooleanFilterConfig {
  assertBooleanFilterRule(filterConfig.rule);
}

export function assertDateFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is DateFilterConfig {
  assertDateFilterRule(filterConfig.rule);
}

export function assertMultiSelectFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is MultiSelectFilterConfig {
  assertMultiSelectFilterRule(filterConfig.rule);
}

export function assertNumberFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is NumberFilterConfig {
  assertNumberFilterRule(filterConfig.rule);
}

export function assertSingleSelectFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is SingleSelectFilterConfig {
  assertSingleSelectFilterRule(filterConfig.rule);
}

export function assertTextFilterConfig(
  filterConfig: FilterConfig,
): asserts filterConfig is TextFilterConfig {
  assertTextFilterRule(filterConfig.rule);
}

export const filtersByFieldType: {
  [fieldType in FieldType]: (value: FieldValue, filter: Filter) => boolean;
} = {
  [FieldType.Checkbox]: booleanFilter,
  [FieldType.Currency]: numberFilter,
  [FieldType.Date]: dateFilter,
  [FieldType.Email]: textFilter,
  [FieldType.MultiCollaborator]: multiSelectFilter,
  [FieldType.MultiDocumentLink]: multiSelectFilter,
  [FieldType.MultiLineText]: textFilter,
  [FieldType.MultiOption]: multiSelectFilter,
  [FieldType.Number]: numberFilter,
  [FieldType.PhoneNumber]: textFilter,
  [FieldType.SingleCollaborator]: singleSelectFilter,
  [FieldType.SingleDocumentLink]: singleSelectFilter,
  [FieldType.SingleLineText]: textFilter,
  [FieldType.SingleOption]: singleSelectFilter,
  [FieldType.URL]: textFilter,
};

function textFilter(value: FieldValue, filter: Filter) {
  assertTextFieldValue(value);
  assertTextFilter(filter);

  return applyTextFilter(value, filter);
}

function numberFilter(value: FieldValue, filter: Filter) {
  assertNumberFieldValue(value);
  assertNumberFilter(filter);

  return applyNumberFilter(value, filter);
}

function dateFilter(value: FieldValue, filter: Filter) {
  assertDateFieldValue(value);
  assertDateFilter(filter);

  return applyDateFilter(value, filter);
}

function singleSelectFilter(value: FieldValue, filter: Filter) {
  assertSingleSelectFieldValue(value);
  assertSingleSelectFilter(filter);

  return applySingleSelectFilter(value, filter);
}

function multiSelectFilter(value: FieldValue, filter: Filter) {
  assertMultiSelectFieldValue(value);
  assertMultiSelectFilter(filter);

  return applyMultiSelectFilter(value, filter);
}

function booleanFilter(value: FieldValue, filter: Filter) {
  assertBooleanFieldValue(value);
  assertBooleanFilter(filter);

  return applyBooleanFilter(value, filter);
}
