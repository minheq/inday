import { isSameDay, isWithinInterval, isBefore, isAfter } from 'date-fns';
import {
  hasAnyOf,
  hasAllOf,
  hasNoneOf,
  isEmpty,
} from '../../lib/data_structures/arrays';
import { atom, selector } from 'recoil';
import { RecoilKey, FieldType } from './constants';
import { FieldID } from './fields';
import { ViewID } from './views';
import {
  DateFieldValue,
  CurrencyFieldValue,
  NumberFieldValue,
  SingleLineTextFieldValue,
  MultiLineTextFieldValue,
  URLFieldValue,
  PhoneNumberFieldValue,
  EmailFieldValue,
  SingleCollaboratorFieldValue,
  SingleSelectFieldValue,
  SingleDocumentLinkFieldValue,
  MultiCollaboratorFieldValue,
  MultiDocumentLinkFieldValue,
  MultiSelectFieldValue,
  CheckboxFieldValue,
} from './documents';

export type FilterID = string;

export interface BaseFilter {
  id: FilterID;
  fieldID: FieldID;
  viewID: ViewID;
}

export interface CheckboxFieldFilterConfig {
  rule: BooleanFilterRule;
  value: BooleanFilterRuleValue;
}
export interface CheckboxFieldFilter
  extends BaseFilter,
    CheckboxFieldFilterConfig {}

export interface CurrencyFieldFilterConfig {
  rule: NumberFilterRule;
  value: NumberFilterRuleValue;
}
export interface CurrencyFieldFilter
  extends BaseFilter,
    CurrencyFieldFilterConfig {}

export interface DateFieldFilterConfig {
  rule: DateFilterRule;
  value: DateFilterRuleValue;
}
export interface DateFieldFilter extends BaseFilter, DateFieldFilterConfig {}

export interface EmailFieldFilterConfig {
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface EmailFieldFilter extends BaseFilter, EmailFieldFilterConfig {}

export interface MultiCollaboratorFieldFilterConfig {
  rule: MultiSelectFilterRule;
  value: MultiSelectFilterRuleValue;
}
export interface MultiCollaboratorFieldFilter
  extends BaseFilter,
    MultiCollaboratorFieldFilterConfig {}

export interface MultiDocumentLinkFieldFilterConfig {
  rule: MultiSelectFilterRule;
  value: MultiSelectFilterRuleValue;
}
export interface MultiDocumentLinkFieldFilter
  extends BaseFilter,
    MultiDocumentLinkFieldFilterConfig {}

export interface MultiLineTextFieldFilterConfig {
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface MultiLineTextFieldFilter
  extends BaseFilter,
    MultiLineTextFieldFilterConfig {}

export interface MultiSelectFieldFilterConfig {
  rule: MultiSelectFilterRule;
  value: MultiSelectFilterRuleValue;
}
export interface MultiSelectFieldFilter
  extends BaseFilter,
    MultiSelectFieldFilterConfig {}

export interface NumberFieldFilterConfig {
  rule: NumberFilterRule;
  value: NumberFilterRuleValue;
}
export interface NumberFieldFilter
  extends BaseFilter,
    NumberFieldFilterConfig {}

export interface PhoneNumberFieldFilterConfig {
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface PhoneNumberFieldFilter
  extends BaseFilter,
    PhoneNumberFieldFilterConfig {}

export interface SingleCollaboratorFieldFilterConfig {
  rule: SingleSelectFilterRule;
  value: SingleSelectFilterRuleValue;
}
export interface SingleCollaboratorFieldFilter
  extends BaseFilter,
    SingleCollaboratorFieldFilterConfig {}

export interface SingleDocumentLinkFieldFilterConfig {
  rule: SingleSelectFilterRule;
  value: SingleSelectFilterRuleValue;
}
export interface SingleDocumentLinkFieldFilter
  extends BaseFilter,
    SingleDocumentLinkFieldFilterConfig {}

export interface SingleLineTextFieldFilterConfig {
  rule: TextFilterRule;
  value: TextFilterRuleValue;
}
export interface SingleLineTextFieldFilter
  extends BaseFilter,
    SingleLineTextFieldFilterConfig {}

export interface SingleSelectFieldFilterConfig {
  rule: SingleSelectFilterRule;
  value: SingleSelectFilterRuleValue;
}
export interface SingleSelectFieldFilter
  extends BaseFilter,
    SingleSelectFieldFilterConfig {}

export interface URLFieldFilterConfig {
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
  | CheckboxFieldFilterConfig
  | CurrencyFieldFilterConfig
  | DateFieldFilterConfig
  | EmailFieldFilterConfig
  | MultiCollaboratorFieldFilterConfig
  | MultiDocumentLinkFieldFilterConfig
  | MultiLineTextFieldFilterConfig
  | MultiSelectFieldFilterConfig
  | NumberFieldFilterConfig
  | PhoneNumberFieldFilterConfig
  | SingleCollaboratorFieldFilterConfig
  | SingleDocumentLinkFieldFilterConfig
  | SingleLineTextFieldFilterConfig
  | SingleSelectFieldFilterConfig
  | URLFieldFilterConfig;

export type Filter =
  | BooleanFilter
  | DateFilter
  | MultiSelectFilter
  | NumberFilter
  | SingleSelectFilter
  | TextFilter;

export type TextFilter =
  | EmailFieldFilter
  | MultiLineTextFieldFilter
  | PhoneNumberFieldFilter
  | SingleLineTextFieldFilter
  | URLFieldFilter;

export type NumberFilter = CurrencyFieldFilter | NumberFieldFilter;
export type SingleSelectFilter =
  | SingleCollaboratorFieldFilter
  | SingleDocumentLinkFieldFilter
  | SingleSelectFieldFilter;

export type MultiSelectFilter =
  | MultiCollaboratorFieldFilter
  | MultiDocumentLinkFieldFilter
  | MultiSelectFieldFilter;

export type BooleanFilter = CheckboxFieldFilter;
export type DateFilter = DateFieldFilter;

export type FiltersByIDState = { [filterID: string]: Filter | undefined };
export const filtersByIDState = atom<FiltersByIDState>({
  key: RecoilKey.FiltersByID,
  default: {},
});

export const filtersQuery = selector({
  key: RecoilKey.Filters,
  get: ({ get }) => {
    const viewsByID = get(filtersByIDState);

    return Object.values(viewsByID) as Filter[];
  },
});

export function getDefaultFilterConfig(fieldType: FieldType): FilterConfig {
  switch (fieldType) {
    case FieldType.Checkbox:
      return { rule: 'is', value: false };
    case FieldType.Date:
      return { rule: 'is', value: null };
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return { rule: 'contains', value: '' };
    case FieldType.Number:
    case FieldType.Currency:
      return { rule: 'equal', value: null };
    case FieldType.MultiCollaborator:
    case FieldType.MultiDocumentLink:
    case FieldType.MultiSelect:
      return { rule: 'hasAnyOf', value: [] };
    case FieldType.SingleSelect:
    case FieldType.SingleDocumentLink:
    case FieldType.SingleCollaborator:
      return { rule: 'is', value: null };
    default:
      throw new Error(`Expected default filter config for ${fieldType}`);
  }
}

export function assertCheckboxFieldFilter(
  filter: Filter,
): asserts filter is CheckboxFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected CheckboxFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertBooleanFilterRule(filter.rule);
}

export function assertCurrencyFieldFilter(
  filter: Filter,
): asserts filter is CurrencyFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected CurrencyFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertNumberFilterRule(filter.rule);
}

export function assertDateFieldFilter(
  filter: Filter,
): asserts filter is DateFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected DateFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertDateFilterRule(filter.rule);
}

export function assertEmailFieldFilter(
  filter: Filter,
): asserts filter is EmailFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected EmailFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterRule(filter.rule);
}

export function assertMultiCollaboratorFieldFilter(
  filter: Filter,
): asserts filter is MultiCollaboratorFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiCollaboratorFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertMultiSelectFilterRule(filter.rule);
}

export function assertMultiDocumentLinkFieldFilter(
  filter: Filter,
): asserts filter is MultiDocumentLinkFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiDocumentLinkFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertMultiSelectFilterRule(filter.rule);
}

export function assertMultiLineTextFieldFilter(
  filter: Filter,
): asserts filter is MultiLineTextFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiLineTextFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterRule(filter.rule);
}

export function assertMultiSelectFieldFilter(
  filter: Filter,
): asserts filter is MultiSelectFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiSelectFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertMultiSelectFilterRule(filter.rule);
}

export function assertNumberFieldFilter(
  filter: Filter,
): asserts filter is NumberFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected NumberFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertNumberFilterRule(filter.rule);
}

export function assertPhoneNumberFieldFilter(
  filter: Filter,
): asserts filter is PhoneNumberFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected PhoneNumberFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterRule(filter.rule);
}

export function assertSingleCollaboratorFieldFilter(
  filter: Filter,
): asserts filter is SingleCollaboratorFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleCollaboratorFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertSingleSelectFilterRule(filter.rule);
}
export function assertSingleDocumentLinkFieldFilter(
  filter: Filter,
): asserts filter is SingleDocumentLinkFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleDocumentLinkFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertSingleSelectFilterRule(filter.rule);
}

export function assertSingleLineTextFieldFilter(
  filter: Filter,
): asserts filter is SingleLineTextFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleLineTextFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterRule(filter.rule);
}

export function assertSingleSelectFieldFilter(
  filter: Filter,
): asserts filter is SingleSelectFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleSelectFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertSingleSelectFilterRule(filter.rule);
}

export function assertURLFieldFilter(
  filter: Filter,
): asserts filter is URLFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected URLFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterRule(filter.rule);
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

export const textFiltersByRule: {
  [rule in TextFilterRule]: (
    value:
      | SingleLineTextFieldValue
      | MultiLineTextFieldValue
      | URLFieldValue
      | PhoneNumberFieldValue
      | EmailFieldValue,
    filterValue: TextFilterRuleValue,
  ) => boolean;
} = {
  contains: (value, filterValue) => {
    return value.includes(filterValue);
  },
  doesNotContain: (value, filterValue) => {
    return !value.includes(filterValue);
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

export const numberFiltersByRule: {
  [rule in NumberFilterRule]: (
    value: CurrencyFieldValue | NumberFieldValue,
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

export const dateFiltersByRule: {
  [rule in DateFilterRule]: (
    value: DateFieldValue,
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

export const singleSelectFiltersByRule: {
  [rule in SingleSelectFilterRule]: (
    value:
      | SingleCollaboratorFieldValue
      | SingleSelectFieldValue
      | SingleDocumentLinkFieldValue,
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

export const multiSelectFiltersByRule: {
  [rule in MultiSelectFilterRule]: (
    value:
      | MultiCollaboratorFieldValue
      | MultiDocumentLinkFieldValue
      | MultiSelectFieldValue,
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

export const booleanFiltersByRule: {
  [rule in BooleanFilterRule]: (
    value: CheckboxFieldValue,
    filterValue: BooleanFilterRuleValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    return value === filterValue;
  },
};
