export type TextFilterCondition =
  | 'contains'
  | 'does_not_contain'
  | 'is'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

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
  | 'is_not'
  | 'is_any_of'
  | 'is_none_of'
  | 'is_empty'
  | 'is_not_empty';

export interface SingleSelectFieldFilter {
  condition: SingleSelectFilterCondition;
  value: string;
}

export type MultiSelectFilterCondition =
  | 'has_any_of'
  | 'has_all_of'
  | 'is_exactly'
  | 'has_none_of'
  | 'is_empty'
  | 'is_not_empty';

export interface MultiSelectFieldFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

export interface SingleCollaboratorFieldFilter {
  condition: SingleSelectFilterCondition;
  value: string;
}

export interface MultiCollaboratorFieldFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

export type DocumentLinkFilterCondition =
  | 'contains'
  | 'does_not_contain'
  | 'is_empty'
  | 'is_not_empty';

export interface SingleDocumentLinkFieldFilter {
  condition: DocumentLinkFilterCondition;
  value: string;
}

export interface MultiDocumentLinkFieldFilter {
  condition: DocumentLinkFilterCondition;
  value: string[];
}

export type DateFilterCondition =
  | 'is'
  | 'is_within'
  | 'is_before'
  | 'is_after'
  | 'is_on_or_before'
  | 'is_on_or_after'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

export interface DateFieldFilter {
  condition: DateFilterCondition;
  value: Date;
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
  | 'not_equal'
  | 'less_than'
  | 'greater_than'
  | 'less_than_or_equal'
  | 'greater_than_or_equal'
  | 'is_empty'
  | 'is_not_empty';

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
  | DocumentLinkFilterCondition
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
  if (
    condition === 'equal' ||
    condition === 'not_equal' ||
    condition === 'less_than' ||
    condition === 'greater_than' ||
    condition === 'less_than_or_equal' ||
    condition === 'greater_than_or_equal' ||
    condition === 'is_empty' ||
    condition === 'is_not_empty'
  ) {
    return;
  }

  throw Error(
    `Expected one of valid NumberFilterCondition. Received ${condition}`,
  );
}

export function assertTextFilterCondition(
  condition: FilterCondition,
): asserts condition is TextFilterCondition {
  if (
    condition === 'contains' ||
    condition === 'does_not_contain' ||
    condition === 'is' ||
    condition === 'is_not' ||
    condition === 'is_empty' ||
    condition === 'is_not_empty'
  ) {
    return;
  }

  throw Error(
    `Expected one of valid TextFilterCondition. Received ${condition}`,
  );
}

export function assertDateFilterCondition(
  condition: FilterCondition,
): asserts condition is DateFilterCondition {
  if (
    condition === 'is' ||
    condition === 'is_within' ||
    condition === 'is_before' ||
    condition === 'is_after' ||
    condition === 'is_on_or_before' ||
    condition === 'is_on_or_after' ||
    condition === 'is_not' ||
    condition === 'is_empty' ||
    condition === 'is_not_empty'
  ) {
    return;
  }

  throw Error(
    `Expected one of valid DateFilterCondition. Received ${condition}`,
  );
}

export function assertDocumentLinkFilterCondition(
  condition: FilterCondition,
): asserts condition is DocumentLinkFilterCondition {
  if (
    condition === 'contains' ||
    condition === 'does_not_contain' ||
    condition === 'is_empty' ||
    condition === 'is_not_empty'
  ) {
    return;
  }

  throw Error(
    `Expected one of valid DocumentLinkFilterCondition. Received ${condition}`,
  );
}

export function assertMultiSelectFilterCondition(
  condition: FilterCondition,
): asserts condition is MultiSelectFilterCondition {
  if (
    condition === 'has_any_of' ||
    condition === 'has_all_of' ||
    condition === 'is_exactly' ||
    condition === 'has_none_of' ||
    condition === 'is_empty' ||
    condition === 'is_not_empty'
  ) {
    return;
  }

  throw Error(
    `Expected one of valid MultiSelectFilterCondition. Received ${condition}`,
  );
}

export function assertSingleSelectFilterCondition(
  condition: FilterCondition,
): asserts condition is SingleSelectFilterCondition {
  if (
    condition === 'is' ||
    condition === 'is_not' ||
    condition === 'is_any_of' ||
    condition === 'is_none_of' ||
    condition === 'is_empty' ||
    condition === 'is_not_empty'
  ) {
    return;
  }

  throw Error(
    `Expected one of valid SingleSelectFilterCondition. Received ${condition}`,
  );
}

export function assertBooleanFilterCondition(
  condition: FilterCondition,
): asserts condition is BooleanFilterCondition {
  if (condition === 'is') {
    return;
  }

  throw Error(
    `Expected one of valid BooleanFilterCondition. Received ${condition}`,
  );
}
