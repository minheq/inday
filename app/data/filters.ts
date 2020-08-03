import { isSameDay, isWithinInterval, isBefore, isAfter } from 'date-fns';
import {
  hasAnyOf,
  hasAllOf,
  hasNoneOf,
} from '../../lib/data_structures/arrays';

export type TextFilterCondition =
  | 'contains'
  | 'doesNotContain'
  | 'is'
  | 'isNot'
  | 'isEmpty'
  | 'isNotEmpty';

export interface SingleLineTextFieldFilter {
  condition: TextFilterCondition;
  value: string;
}

export interface MultiLineTextFieldFilter {
  condition: TextFilterCondition;
  value: string;
}

export type SingleSelectFilterCondition =
  | 'is'
  | 'isNot'
  | 'isAnyOf'
  | 'isNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';

export interface SingleSelectFieldFilter {
  condition: SingleSelectFilterCondition;
  value: string | string[];
}

export type MultiSelectFilterCondition =
  | 'hasAnyOf'
  | 'hasAllOf'
  | 'hasNoneOf'
  | 'isEmpty'
  | 'isNotEmpty';

export interface MultiSelectFieldFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

export interface SingleCollaboratorFieldFilter {
  condition: SingleSelectFilterCondition;
  value: string | string[];
}

export interface MultiCollaboratorFieldFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

export interface SingleDocumentLinkFieldFilter {
  condition: SingleSelectFilterCondition;
  value: string | string[];
}

export interface MultiDocumentLinkFieldFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

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

export interface DateFieldFilter {
  condition: DateFilterCondition;
  value: Date | Interval;
}

export interface PhoneNumberFieldFilter {
  condition: TextFilterCondition;
  value: string;
}

export interface EmailFieldFilter {
  condition: TextFilterCondition;
  value: string;
}

export interface URLFieldFilter {
  condition: TextFilterCondition;
  value: string;
}

export type NumberFilterCondition =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';

export interface NumberFieldFilter {
  condition: NumberFilterCondition;
  value: number;
}

export interface CurrencyFieldFilter {
  condition: NumberFilterCondition;
  value: number;
}

export type BooleanFilterCondition = 'is';

export interface CheckboxFieldFilter {
  condition: BooleanFilterCondition;
  value: boolean;
}

export type FilterCondition =
  | NumberFilterCondition
  | TextFilterCondition
  | DateFilterCondition
  | MultiSelectFilterCondition
  | SingleSelectFilterCondition;

export type Filter =
  | SingleLineTextFieldFilter
  | MultiLineTextFieldFilter
  | SingleSelectFieldFilter
  | MultiSelectFieldFilter
  | SingleCollaboratorFieldFilter
  | MultiCollaboratorFieldFilter
  | SingleDocumentLinkFieldFilter
  | MultiDocumentLinkFieldFilter
  | DateFieldFilter
  | PhoneNumberFieldFilter
  | EmailFieldFilter
  | URLFieldFilter
  | NumberFieldFilter
  | CurrencyFieldFilter
  | CheckboxFieldFilter;

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

export const numberFiltersByCondition: {
  [condition in NumberFilterCondition]: (
    value: number | null,
    filterValue: number,
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

    return value < filterValue;
  },
  greaterThan: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return value > filterValue;
  },
  lessThanOrEqual: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return value <= filterValue;
  },
  greaterThanOrEqual: (value, filterValue) => {
    if (value === null) {
      return false;
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

export const textFiltersByCondition: {
  [condition in TextFilterCondition]: (
    value: string | null,
    filterValue: string,
  ) => boolean;
} = {
  contains: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return value.includes(filterValue);
  },
  doesNotContain: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return !value.includes(filterValue);
  },
  is: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return value === filterValue;
  },
  isNot: (value, filterValue) => {
    if (value === null) {
      return false;
    }

    return value !== filterValue;
  },
  isEmpty: (value) => {
    return value === null || value === '';
  },
  isNotEmpty: (value) => {
    return value !== null && value !== '';
  },
};

export const dateFiltersByCondition: {
  [condition in DateFilterCondition]: (
    value: Date | null,
    filterValue: Date | Interval,
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
    value: string | null,
    filterValue: string | string[],
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
    value: string[] | null,
    filterValue: string[],
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
    return value === null;
  },
  isNotEmpty: (value) => {
    return value !== null;
  },
};

export const booleanFiltersByCondition: {
  [condition in BooleanFilterCondition]: (
    value: boolean | null,
    filterValue: boolean | Interval,
  ) => boolean;
} = {
  is: (value, filterValue) => {
    return value === filterValue;
  },
};
