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
  condition: BooleanFilterCondition;
  value: BooleanFilterConditionValue;
}
export interface CheckboxFieldFilter
  extends BaseFilter,
    CheckboxFieldFilterConfig {}

export interface CurrencyFieldFilterConfig {
  condition: NumberFilterCondition;
  value: NumberFilterConditionValue;
}
export interface CurrencyFieldFilter
  extends BaseFilter,
    CurrencyFieldFilterConfig {}

export interface DateFieldFilterConfig {
  condition: DateFilterCondition;
  value: DateFilterConditionValue;
}
export interface DateFieldFilter extends BaseFilter, DateFieldFilterConfig {}

export interface EmailFieldFilterConfig {
  condition: TextFilterCondition;
  value: TextFilterConditionValue;
}
export interface EmailFieldFilter extends BaseFilter, EmailFieldFilterConfig {}

export interface MultiCollaboratorFieldFilterConfig {
  condition: MultiSelectFilterCondition;
  value: MultiSelectFilterConditionValue;
}
export interface MultiCollaboratorFieldFilter
  extends BaseFilter,
    MultiCollaboratorFieldFilterConfig {}

export interface MultiDocumentLinkFieldFilterConfig {
  condition: MultiSelectFilterCondition;
  value: MultiSelectFilterConditionValue;
}
export interface MultiDocumentLinkFieldFilter
  extends BaseFilter,
    MultiDocumentLinkFieldFilterConfig {}

export interface MultiLineTextFieldFilterConfig {
  condition: TextFilterCondition;
  value: TextFilterConditionValue;
}
export interface MultiLineTextFieldFilter
  extends BaseFilter,
    MultiLineTextFieldFilterConfig {}

export interface MultiSelectFieldFilterConfig {
  condition: MultiSelectFilterCondition;
  value: MultiSelectFilterConditionValue;
}
export interface MultiSelectFieldFilter
  extends BaseFilter,
    MultiSelectFieldFilterConfig {}

export interface NumberFieldFilterConfig {
  condition: NumberFilterCondition;
  value: NumberFilterConditionValue;
}
export interface NumberFieldFilter
  extends BaseFilter,
    NumberFieldFilterConfig {}

export interface PhoneNumberFieldFilterConfig {
  condition: TextFilterCondition;
  value: TextFilterConditionValue;
}
export interface PhoneNumberFieldFilter
  extends BaseFilter,
    PhoneNumberFieldFilterConfig {}

export interface SingleCollaboratorFieldFilterConfig {
  condition: SingleSelectFilterCondition;
  value: SingleSelectFilterConditionValue;
}
export interface SingleCollaboratorFieldFilter
  extends BaseFilter,
    SingleCollaboratorFieldFilterConfig {}

export interface SingleDocumentLinkFieldFilterConfig {
  condition: SingleSelectFilterCondition;
  value: SingleSelectFilterConditionValue;
}
export interface SingleDocumentLinkFieldFilter
  extends BaseFilter,
    SingleDocumentLinkFieldFilterConfig {}

export interface SingleLineTextFieldFilterConfig {
  condition: TextFilterCondition;
  value: TextFilterConditionValue;
}
export interface SingleLineTextFieldFilter
  extends BaseFilter,
    SingleLineTextFieldFilterConfig {}

export interface SingleSelectFieldFilterConfig {
  condition: SingleSelectFilterCondition;
  value: SingleSelectFilterConditionValue;
}
export interface SingleSelectFieldFilter
  extends BaseFilter,
    SingleSelectFieldFilterConfig {}

export interface URLFieldFilterConfig {
  condition: TextFilterCondition;
  value: TextFilterConditionValue;
}
export interface URLFieldFilter extends BaseFilter, URLFieldFilterConfig {}

export type TextFilterCondition =
  | 'contains'
  | 'doesNotContain'
  | 'is'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';
export type TextFilterConditionValue = string;

export type SingleSelectFilterCondition =
  | 'is'
  | 'isNot'
  | 'isAnyOf'
  | 'isNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';
export type SingleSelectFilterConditionValue = string | string[] | null;

export type MultiSelectFilterCondition =
  | 'hasAnyOf'
  | 'hasAllOf'
  | 'hasNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';
export type MultiSelectFilterConditionValue = string[];

export type DateFilterCondition =
  | 'is'
  | 'isWithin'
  | 'isBefore'
  | 'isAfter'
  | 'isOnOrBefore'
  | 'isOnOrAfter'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';
export type DateFilterConditionValue = Date | Interval | null;

export type NumberFilterCondition =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';
export type NumberFilterConditionValue = number | null;

export type BooleanFilterCondition = 'is';
export type BooleanFilterConditionValue = boolean;

export type FilterCondition =
  | DateFilterCondition
  | MultiSelectFilterCondition
  | NumberFilterCondition
  | SingleSelectFilterCondition
  | TextFilterCondition;

export type FilterConditionValue =
  | DateFilterConditionValue
  | MultiSelectFilterConditionValue
  | NumberFilterConditionValue
  | SingleSelectFilterConditionValue
  | TextFilterConditionValue;

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
      return { condition: 'is', value: false };
    case FieldType.Date:
      return { condition: 'is', value: null };
    case FieldType.SingleLineText:
    case FieldType.MultiLineText:
    case FieldType.URL:
    case FieldType.PhoneNumber:
    case FieldType.Email:
      return { condition: 'contains', value: '' };
    case FieldType.Number:
    case FieldType.Currency:
      return { condition: 'equal', value: null };
    case FieldType.MultiCollaborator:
    case FieldType.MultiDocumentLink:
    case FieldType.MultiSelect:
      return { condition: 'hasAnyOf', value: [] };
    case FieldType.SingleSelect:
    case FieldType.SingleDocumentLink:
    case FieldType.SingleCollaborator:
      return { condition: 'is', value: null };
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

  assertBooleanFilterCondition(filter.condition);
}

export function assertCurrencyFieldFilter(
  filter: Filter,
): asserts filter is CurrencyFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected CurrencyFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertNumberFilterCondition(filter.condition);
}

export function assertDateFieldFilter(
  filter: Filter,
): asserts filter is DateFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected DateFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertDateFilterCondition(filter.condition);
}

export function assertEmailFieldFilter(
  filter: Filter,
): asserts filter is EmailFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected EmailFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterCondition(filter.condition);
}

export function assertMultiCollaboratorFieldFilter(
  filter: Filter,
): asserts filter is MultiCollaboratorFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiCollaboratorFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertMultiSelectFilterCondition(filter.condition);
}

export function assertMultiDocumentLinkFieldFilter(
  filter: Filter,
): asserts filter is MultiDocumentLinkFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiDocumentLinkFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertMultiSelectFilterCondition(filter.condition);
}

export function assertMultiLineTextFieldFilter(
  filter: Filter,
): asserts filter is MultiLineTextFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiLineTextFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterCondition(filter.condition);
}

export function assertMultiSelectFieldFilter(
  filter: Filter,
): asserts filter is MultiSelectFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected MultiSelectFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertMultiSelectFilterCondition(filter.condition);
}

export function assertNumberFieldFilter(
  filter: Filter,
): asserts filter is NumberFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected NumberFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertNumberFilterCondition(filter.condition);
}

export function assertPhoneNumberFieldFilter(
  filter: Filter,
): asserts filter is PhoneNumberFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected PhoneNumberFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterCondition(filter.condition);
}

export function assertSingleCollaboratorFieldFilter(
  filter: Filter,
): asserts filter is SingleCollaboratorFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleCollaboratorFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertSingleSelectFilterCondition(filter.condition);
}
export function assertSingleDocumentLinkFieldFilter(
  filter: Filter,
): asserts filter is SingleDocumentLinkFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleDocumentLinkFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertSingleSelectFilterCondition(filter.condition);
}

export function assertSingleLineTextFieldFilter(
  filter: Filter,
): asserts filter is SingleLineTextFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleLineTextFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterCondition(filter.condition);
}

export function assertSingleSelectFieldFilter(
  filter: Filter,
): asserts filter is SingleSelectFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected SingleSelectFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertSingleSelectFilterCondition(filter.condition);
}

export function assertURLFieldFilter(
  filter: Filter,
): asserts filter is URLFieldFilter {
  if (typeof filter.value !== 'string') {
    throw new Error(
      `Expected URLFieldFilter to be string. Received ${filter.value}`,
    );
  }

  assertTextFilterCondition(filter.condition);
}

export function assertNumberFilterCondition(
  condition: FilterCondition,
): asserts condition is NumberFilterCondition {
  if (condition in numberFiltersByCondition) {
    return;
  }

  throw Error(
    `Expected one of valid NumberFilterCondition. Received ${condition}`,
  );
}

export function assertTextFilterCondition(
  condition: FilterCondition,
): asserts condition is TextFilterCondition {
  if (condition in textFiltersByCondition) {
    return;
  }

  throw Error(
    `Expected one of valid TextFilterCondition. Received ${condition}`,
  );
}

export function assertDateFilterCondition(
  condition: FilterCondition,
): asserts condition is DateFilterCondition {
  if (condition in dateFiltersByCondition) {
    return;
  }

  throw Error(
    `Expected one of valid DateFilterCondition. Received ${condition}`,
  );
}

export function assertMultiSelectFilterCondition(
  condition: FilterCondition,
): asserts condition is MultiSelectFilterCondition {
  if (condition in multiSelectFiltersByCondition) {
    return;
  }

  throw Error(
    `Expected one of valid MultiSelectFilterCondition. Received ${condition}`,
  );
}

export function assertSingleSelectFilterCondition(
  condition: FilterCondition,
): asserts condition is SingleSelectFilterCondition {
  if (condition in singleSelectFiltersByCondition) {
    return;
  }

  throw Error(
    `Expected one of valid SingleSelectFilterCondition. Received ${condition}`,
  );
}

export function assertBooleanFilterCondition(
  condition: FilterCondition,
): asserts condition is BooleanFilterCondition {
  if (condition in booleanFiltersByCondition) {
    return;
  }

  throw Error(
    `Expected one of valid BooleanFilterCondition. Received ${condition}`,
  );
}

export const textFiltersByCondition: {
  [condition in TextFilterCondition]: (
    value:
      | SingleLineTextFieldValue
      | MultiLineTextFieldValue
      | URLFieldValue
      | PhoneNumberFieldValue
      | EmailFieldValue,
    filterValue: TextFilterConditionValue,
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

export const numberFiltersByCondition: {
  [condition in NumberFilterCondition]: (
    value: CurrencyFieldValue | NumberFieldValue,
    filterValue: NumberFilterConditionValue,
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

export const dateFiltersByCondition: {
  [condition in DateFilterCondition]: (
    value: DateFieldValue,
    filterValue: DateFilterConditionValue,
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

export const singleSelectFiltersByCondition: {
  [condition in SingleSelectFilterCondition]: (
    value:
      | SingleCollaboratorFieldValue
      | SingleSelectFieldValue
      | SingleDocumentLinkFieldValue,
    filterValue: SingleSelectFilterConditionValue,
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

export const multiSelectFiltersByCondition: {
  [condition in MultiSelectFilterCondition]: (
    value:
      | MultiCollaboratorFieldValue
      | MultiDocumentLinkFieldValue
      | MultiSelectFieldValue,
    filterValue: MultiSelectFilterConditionValue,
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

export const booleanFiltersByCondition: {
  [condition in BooleanFilterCondition]: (
    value: CheckboxFieldValue,
    filterValue: BooleanFilterConditionValue,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    return value === filterValue;
  },
};
