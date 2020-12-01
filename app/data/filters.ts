import { Record } from './records';
import { Array, Date } from '../../lib/js_utils';
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
  SingleSelectFieldKindValue,
  TextFieldKindValue,
} from './fields';
import { ViewID } from './views';
import { generateID, validateID } from '../../lib/id';
import { Interval } from '../../lib/datetime';

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
  value: MultiSelectFieldKindFilterRuleValue;
}
export interface MultiCollaboratorFieldFilter
  extends BaseFilter,
    MultiCollaboratorFieldFilterConfig {}

export interface MultiRecordLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: MultiSelectFieldKindFilterRule;
  value: MultiSelectFieldKindFilterRuleValue;
}
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
  value: MultiSelectFieldKindFilterRuleValue;
}
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
  value: SingleSelectFieldKindFilterRuleValue;
}
export interface SingleCollaboratorFieldFilter
  extends BaseFilter,
    SingleCollaboratorFieldFilterConfig {}

export interface SingleRecordLinkFieldFilterConfig {
  fieldID: FieldID;
  rule: SingleSelectFieldKindFilterRule;
  value: SingleSelectFieldKindFilterRuleValue;
}
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
  value: SingleSelectFieldKindFilterRuleValue;
}
export interface SingleOptionFieldFilter
  extends BaseFilter,
    SingleOptionFieldFilterConfig {}

export interface URLFieldFilterConfig {
  fieldID: FieldID;
  rule: TextFieldKindFilterRule;
  value: TextFieldKindFilterRuleValue;
}
export interface URLFieldFilter extends BaseFilter, URLFieldFilterConfig {}

export type TextFieldKindFilterRule =
  | 'contains'
  | 'doesNotContain'
  | 'is'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';
export type TextFieldKindFilterRuleValue = string;

export type SingleSelectFieldKindFilterRule =
  | 'is'
  | 'isNot'
  | 'isAnyOf'
  | 'isNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';
export type SingleSelectFieldKindFilterRuleValue = string | string[] | null;

export type MultiSelectFieldKindFilterRule =
  | 'hasAnyOf'
  | 'hasAllOf'
  | 'hasNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';
export type MultiSelectFieldKindFilterRuleValue = string[];

export type DateFieldKindFilterRule =
  | 'is'
  | 'isWithin'
  | 'isBefore'
  | 'isAfter'
  | 'isOnOrBefore'
  | 'isOnOrAfter'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';
export type DateFieldKindFilterRuleValue = Date | Interval | null;

export type NumberFieldKindFilterRule =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';
export type NumberFieldKindFilterRuleValue = number | null;

export type BooleanFieldKindFilterRule = 'is';
export type BooleanFieldKindFilterRuleValue = boolean;

export type FilterRule =
  | DateFieldKindFilterRule
  | MultiSelectFieldKindFilterRule
  | NumberFieldKindFilterRule
  | SingleSelectFieldKindFilterRule
  | TextFieldKindFilterRule;

export type FilterRuleValue =
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
    case FieldType.MultiRecordLink:
    case FieldType.MultiOption:
      return { fieldID: field.id, rule: 'hasAnyOf', value: [] };
    case FieldType.SingleOption:
    case FieldType.SingleRecordLink:
    case FieldType.SingleCollaborator:
      return { fieldID: field.id, rule: 'is', value: null };
    default:
      throw new Error(
        `Expected default filter config for ${JSON.stringify(field)}`,
      );
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
    if (Array.isEmpty(filterGroups)) {
      return true;
    }

    return filterGroups.some((filterGroup) => {
      return filterGroup.every((filter) => {
        const field = getField(filter.fieldID);

        const applyFilter = filtersByFieldType[field.type];

        return applyFilter(record.fields[filter.fieldID], filter);
      });
    });
  });

  return filteredRecords;
}

export function assertNumberFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is NumberFieldKindFilterRule {
  if (rule in numberFieldKindFiltersByRule) {
    return;
  }

  throw Error(
    `Expected one of valid NumberFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertTextFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is TextFieldKindFilterRule {
  if (rule in textFieldKindFiltersByRule) {
    return;
  }

  throw Error(
    `Expected one of valid TextFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertDateFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is DateFieldKindFilterRule {
  if (rule in dateFieldKindFiltersByRule) {
    return;
  }

  throw Error(
    `Expected one of valid DateFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertMultiSelectFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is MultiSelectFieldKindFilterRule {
  if (rule in multiSelectFieldKindFiltersByRule) {
    return;
  }

  throw Error(
    `Expected one of valid MultiSelectFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertSingleSelectFieldKindFilterRule(
  rule: FilterRule,
): asserts rule is SingleSelectFieldKindFilterRule {
  if (rule in singleSelectFieldKindFiltersByRule) {
    return;
  }

  throw Error(
    `Expected one of valid SingleSelectFieldKindFilterRule. Received ${rule}`,
  );
}

export function assertBooleanFilterRule(
  rule: FilterRule,
): asserts rule is BooleanFieldKindFilterRule {
  if (rule in booleanFieldKindFiltersByRule) {
    return;
  }

  throw Error(
    `Expected one of valid BooleanFieldKindFilterRule. Received ${rule}`,
  );
}

export function applyTextFieldKindFilter(
  value: TextFieldKindValue,
  filter: TextFieldKindFilter,
): boolean {
  return textFieldKindFiltersByRule[filter.rule](value, filter.value);
}

export const textFieldKindFiltersByRule: {
  [rule in TextFieldKindFilterRule]: (
    value: TextFieldKindValue,
    filterValue: TextFieldKindFilterRuleValue,
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

export function applyNumberFieldKindFilter(
  value: NumberFieldKindValue,
  filter: NumberFieldFilter,
): boolean {
  return numberFieldKindFiltersByRule[filter.rule](value, filter.value);
}

export const numberFieldKindFiltersByRule: {
  [rule in NumberFieldKindFilterRule]: (
    value: NumberFieldKindValue,
    filterValue: NumberFieldKindFilterRuleValue,
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

export function applyDateFieldKindFilter(
  value: DateFieldKindValue,
  filter: DateFieldFilter,
): boolean {
  return dateFieldKindFiltersByRule[filter.rule](value, filter.value);
}

export const dateFieldKindFiltersByRule: {
  [rule in DateFieldKindFilterRule]: (
    value: DateFieldKindValue,
    filterValue: DateFieldKindFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return Date.isSameDay(value, filterValue);
  },
  isWithin: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (filterValue === null) {
      return true;
    }

    if (Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Interval. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return Date.isWithinInterval(value, filterValue);
  },
  isBefore: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return Date.isBefore(value, filterValue);
  },
  isAfter: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return Date.isAfter(value, filterValue);
  },
  isOnOrBefore: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return (
      Date.isBefore(value, filterValue) || Date.isSameDay(value, filterValue)
    );
  },
  isOnOrAfter: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return (
      Date.isAfter(value, filterValue) || Date.isSameDay(value, filterValue)
    );
  },
  isNot: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    if (!Date.isDate(filterValue)) {
      throw new Error(
        `Expected filterValue to be Date. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return !Date.isSameDay(value, filterValue);
  },
  isEmpty: (value) => {
    return value === null;
  },
  isNotEmpty: (value) => {
    return value !== null;
  },
};

export function applySingleSelectFieldKindFilter(
  value: SingleSelectFieldKindValue,
  filter: SingleSelectFieldKindFilter,
): boolean {
  return singleSelectFieldKindFiltersByRule[filter.rule](value, filter.value);
}

export const singleSelectFieldKindFiltersByRule: {
  [rule in SingleSelectFieldKindFilterRule]: (
    value: SingleSelectFieldKindValue,
    filterValue: SingleSelectFieldKindFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
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
  },
  isNot: (value, filterValue) => {
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
        `Expected filterValue to be string[]. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return Array.hasAnyOf([value], filterValue);
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
        `Expected filterValue to be string[]. Received ${JSON.stringify(
          filterValue,
        )}`,
      );
    }

    return Array.hasNoneOf([value], filterValue);
  },
  isEmpty: (value) => {
    return value === null;
  },
  isNotEmpty: (value) => {
    return value !== null;
  },
};

export function applyMultiSelectFieldKindFilter(
  value: MultiSelectFieldKindValue,
  filter: MultiSelectFieldKindFilter,
): boolean {
  return multiSelectFieldKindFiltersByRule[filter.rule](value, filter.value);
}

export const multiSelectFieldKindFiltersByRule: {
  [rule in MultiSelectFieldKindFilterRule]: (
    value: MultiSelectFieldKindValue,
    filterValue: MultiSelectFieldKindFilterRuleValue,
  ) => boolean;
} = {
  hasAnyOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return Array.hasAnyOf(value, filterValue);
  },
  hasAllOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return Array.hasAllOf(value, filterValue);
  },
  hasNoneOf: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return Array.hasNoneOf(value, filterValue);
  },
  isEmpty: (value) => {
    return Array.isEmpty(value as string[]);
  },
  isNotEmpty: (value) => {
    return !Array.isEmpty(value as string[]);
  },
};

export function applyBooleanFieldKindFilter(
  value: BooleanFieldKindValue,
  filter: BooleanFieldKindFilter,
): boolean {
  return booleanFieldKindFiltersByRule[filter.rule](value, filter.value);
}

export const booleanFieldKindFiltersByRule: {
  [rule in BooleanFieldKindFilterRule]: (
    value: BooleanFieldKindValue,
    filterValue: BooleanFieldKindFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    return value === filterValue;
  },
};

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

export const filtersByFieldType: {
  [fieldType in FieldType]: (value: FieldValue, filter: Filter) => boolean;
} = {
  [FieldType.Checkbox]: booleanFieldKindFilter,
  [FieldType.Currency]: numberFieldKindFilter,
  [FieldType.Date]: dateFieldKindFilter,
  [FieldType.Email]: textFieldKindFilter,
  [FieldType.MultiCollaborator]: multiSelectFieldKindFilter,
  [FieldType.MultiRecordLink]: multiSelectFieldKindFilter,
  [FieldType.MultiLineText]: textFieldKindFilter,
  [FieldType.MultiOption]: multiSelectFieldKindFilter,
  [FieldType.Number]: numberFieldKindFilter,
  [FieldType.PhoneNumber]: textFieldKindFilter,
  [FieldType.SingleCollaborator]: singleSelectFieldKindFilter,
  [FieldType.SingleRecordLink]: singleSelectFieldKindFilter,
  [FieldType.SingleLineText]: textFieldKindFilter,
  [FieldType.SingleOption]: singleSelectFieldKindFilter,
  [FieldType.URL]: textFieldKindFilter,
};

function textFieldKindFilter(value: FieldValue, filter: Filter): boolean {
  assertTextFieldKindValue(value);
  assertTextFilter(filter);

  return applyTextFieldKindFilter(value, filter);
}

function numberFieldKindFilter(value: FieldValue, filter: Filter): boolean {
  assertNumberFieldValue(value);
  assertNumberFilter(filter);

  return applyNumberFieldKindFilter(value, filter);
}

function dateFieldKindFilter(value: FieldValue, filter: Filter): boolean {
  assertDateFieldValue(value);
  assertDateFilter(filter);

  return applyDateFieldKindFilter(value, filter);
}

function singleSelectFieldKindFilter(
  value: FieldValue,
  filter: Filter,
): boolean {
  assertSingleSelectFieldKindValue(value);
  assertSingleSelectFilter(filter);

  return applySingleSelectFieldKindFilter(value, filter);
}

function multiSelectFieldKindFilter(
  value: FieldValue,
  filter: Filter,
): boolean {
  assertMultiSelectFieldKindValue(value);
  assertMultiSelectFilter(filter);

  return applyMultiSelectFieldKindFilter(value, filter);
}

function booleanFieldKindFilter(value: FieldValue, filter: Filter): boolean {
  assertBooleanFieldKindValue(value);
  assertBooleanFilter(filter);

  return applyBooleanFieldKindFilter(value, filter);
}
