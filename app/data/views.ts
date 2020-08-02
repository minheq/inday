import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { view1, view2 } from './fake_data';
import { FieldType } from './constants';
import { FieldID, fieldQuery } from './fields';
import {
  assertNumberFieldValue,
  assertSingleLineTextFieldValue,
  SingleLineTextFieldValue,
  Document,
  DocumentFieldValue,
  NumberFieldValue,
  assertMultiLineTextFieldValue,
  MultiLineTextFieldValue,
  PhoneNumberFieldValue,
  MultiDocumentLinkFieldValue,
  SingleDocumentLinkFieldValue,
  MultiCollaboratorFieldValue,
  SingleSelectFieldValue,
  SingleCollaboratorFieldValue,
  MultiSelectFieldValue,
  CurrencyFieldValue,
  URLFieldValue,
  EmailFieldValue,
  DateFieldValue,
  assertSingleSelectFieldValue,
  assertMultiSelectFieldValue,
  assertSingleCollaboratorFieldValue,
  assertMultiCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertDateFieldValue,
  assertPhoneNumberFieldValue,
  assertEmailFieldValue,
  assertURLFieldValue,
  assertCurrencyFieldValue,
  assertCheckboxFieldValue,
} from './documents';
import { collectionDocumentsQuery } from './collections';
import {
  Filter,
  TextFilterCondition,
  assertNumberFieldFilter,
  assertSingleLineTextFieldFilter,
  SingleLineTextFieldFilter,
  NumberFieldFilter,
  NumberFilterCondition,
  assertMultiLineTextFieldFilter,
  MultiLineTextFieldFilter,
  PhoneNumberFieldFilter,
  MultiDocumentLinkFieldFilter,
  SingleDocumentLinkFieldFilter,
  MultiCollaboratorFieldFilter,
  SingleSelectFieldFilter,
  SingleCollaboratorFieldFilter,
  MultiSelectFieldFilter,
  CurrencyFieldFilter,
  CheckboxFieldFilter,
  URLFieldFilter,
  EmailFieldFilter,
  DateFieldFilter,
  assertSingleSelectFieldFilter,
  assertMultiSelectFieldFilter,
  assertSingleCollaboratorFieldFilter,
  assertMultiCollaboratorFieldFilter,
  assertSingleDocumentLinkFieldFilter,
  assertMultiDocumentLinkFieldFilter,
  assertDateFieldFilter,
  assertPhoneNumberFieldFilter,
  assertEmailFieldFilter,
  assertURLFieldFilter,
  assertCurrencyFieldFilter,
  assertCheckboxFieldFilter,
} from './filters';

export type ViewID = string;

interface BaseView {
  id: ViewID;
  name: string;
  filters: [FieldID, Filter][];
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

export interface ListViewFieldConfig {
  visible: boolean;
  width: number;
}

interface ListViewConfig {
  type: 'list';
  fieldsOrder: FieldID[];
  fieldsConfig: {
    [fieldID: string]: ListViewFieldConfig;
  };
}

export interface ListView extends BaseView, ListViewConfig {}

interface BoardViewConfig {
  type: 'board';
}

export interface BoardView extends BaseView, BoardViewConfig {}

export type View = ListView | BoardView;
export type ViewType = View['type'];

export type ViewsByIDState = { [viewID: string]: View | undefined };
export const viewsByIDState = atom<ViewsByIDState>({
  key: RecoilKey.ViewsByID,
  default: {
    [view1.id]: view1,
    [view2.id]: view2,
  },
});

export const viewsQuery = selector({
  key: RecoilKey.Views,
  get: ({ get }) => {
    const viewsByID = get(viewsByIDState);

    return Object.values(viewsByID) as View[];
  },
});

export const viewQuery = selectorFamily<View, string>({
  key: RecoilKey.View,
  get: (viewID: string) => ({ get }) => {
    const viewsByID = get(viewsByIDState);
    const view = viewsByID[viewID];

    if (view === undefined) {
      throw new Error('View not found');
    }

    return view;
  },
});

export const viewDocumentsQuery = selectorFamily<Document[], string>({
  key: RecoilKey.Collection,
  get: (viewID: string) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const documents = get(collectionDocumentsQuery(view.collectionID));
    const { filters } = view;

    let finalDocuments = documents;

    // TODO: Apply view. List, Board, Calendar

    // Apply filters
    for (const [fieldID, filter] of filters) {
      const field = get(fieldQuery(fieldID));

      finalDocuments = finalDocuments.filter((doc) => {
        const applyFilter = filtersByFieldType[field.type];

        return applyFilter(doc.fields[fieldID], filter);
      });
    }

    // TODO: Apply sorting

    // TODO: Apply grouping

    return finalDocuments;
  },
});

const filtersByFieldType: {
  [fieldType in FieldType]: (
    value: DocumentFieldValue | null,
    filter: Filter,
  ) => boolean;
} = {
  [FieldType.SingleLineText]: (value, filter) => {
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextFieldFilter(filter);

    return bySingleLineTextField(value, filter);
  },
  [FieldType.MultiLineText]: (value, filter) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextFieldFilter(filter);

    return byMultiLineTextField(value, filter);
  },
  [FieldType.Number]: (value, filter) => {
    assertNumberFieldValue(value);
    assertNumberFieldFilter(filter);

    return byNumberField(value, filter);
  },
  [FieldType.SingleSelect]: (value, filter) => {
    assertSingleSelectFieldValue(value);
    assertSingleSelectFieldFilter(filter);

    return bySingleSelectField(value, filter);
  },
  [FieldType.MultiSelect]: (value, filter) => {
    assertMultiSelectFieldValue(value);
    assertMultiSelectFieldFilter(filter);

    return byMultiSelectField(value, filter);
  },
  [FieldType.SingleCollaborator]: (value, filter) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorFieldFilter(filter);

    return bySingleCollaboratorField(value, filter);
  },
  [FieldType.MultiCollaborator]: (value, filter) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorFieldFilter(filter);

    return byMultiCollaboratorField(value, filter);
  },
  [FieldType.SingleDocumentLink]: (value, filter) => {
    assertSingleDocumentLinkFieldValue(value);
    assertSingleDocumentLinkFieldFilter(filter);

    return bySingleDocumentLinkField(value, filter);
  },
  [FieldType.MultiDocumentLink]: (value, filter) => {
    assertMultiDocumentLinkFieldValue(value);
    assertMultiDocumentLinkFieldFilter(filter);

    return byMultiDocumentLinkField(value, filter);
  },
  [FieldType.Date]: (value, filter) => {
    assertDateFieldValue(value);
    assertDateFieldFilter(filter);

    return byDateField(value, filter);
  },
  [FieldType.PhoneNumber]: (value, filter) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberFieldFilter(filter);

    return byPhoneNumberField(value, filter);
  },
  [FieldType.Email]: (value, filter) => {
    assertEmailFieldValue(value);
    assertEmailFieldFilter(filter);

    return byEmailField(value, filter);
  },
  [FieldType.URL]: (value, filter) => {
    assertURLFieldValue(value);
    assertURLFieldFilter(filter);

    return byURLField(value, filter);
  },
  [FieldType.Currency]: (value, filter) => {
    assertCurrencyFieldValue(value);
    assertCurrencyFieldFilter(filter);

    return byCurrencyField(value, filter);
  },
  [FieldType.Checkbox]: (value, filter) => {
    assertCheckboxFieldValue(value);
    assertCheckboxFieldFilter(filter);

    return byCheckboxField(value, filter);
  },
};

function bySingleLineTextField(
  value: SingleLineTextFieldValue | null,
  filter: SingleLineTextFieldFilter,
) {
  return byTextFilterCondition(value, filter.condition, filter.value);
}

function byMultiLineTextField(
  value: MultiLineTextFieldValue | null,
  filter: MultiLineTextFieldFilter,
) {
  return byTextFilterCondition(value, filter.condition, filter.value);
}

function bySingleSelectField(
  value: SingleSelectFieldValue | null,
  filter: SingleSelectFieldFilter,
) {
  return bySingleSelectFilterCondition(value, filter.condition, filter.value);
}

function byMultiSelectField(
  value: MultiSelectFieldValue | null,
  filter: MultiSelectFieldFilter,
) {
  return byMultiSelectFilterCondition(value, filter.condition, filter.value);
}

function bySingleCollaboratorField(
  value: SingleCollaboratorFieldValue | null,
  filter: SingleCollaboratorFieldFilter,
) {
  return bySingleSelectFilterCondition(value, filter.condition, filter.value);
}

function byMultiCollaboratorField(
  value: MultiCollaboratorFieldValue | null,
  filter: MultiCollaboratorFieldFilter,
) {
  return byMultiSelectFilterCondition(value, filter.condition, filter.value);
}

function bySingleDocumentLinkField(
  value: SingleDocumentLinkFieldValue | null,
  filter: SingleDocumentLinkFieldFilter,
) {
  return bySingleSelectFilterCondition(value, filter.condition, filter.value);
}

function byMultiDocumentLinkField(
  value: MultiDocumentLinkFieldValue | null,
  filter: MultiDocumentLinkFieldFilter,
) {
  return byMultiSelectFilterCondition(value, filter.condition, filter.value);
}

function byDateField(value: DateFieldValue | null, filter: DateFieldFilter) {
  return byDateFilterCondition(value, filter.condition, filter.value);
}

function byPhoneNumberField(
  value: PhoneNumberFieldValue | null,
  filter: PhoneNumberFieldFilter,
) {
  return byTextFilterCondition(value, filter.condition, filter.value);
}

function byEmailField(value: EmailFieldValue | null, filter: EmailFieldFilter) {
  return byTextFilterCondition(value, filter.condition, filter.value);
}

function byURLField(value: URLFieldValue | null, filter: URLFieldFilter) {
  return byTextFilterCondition(value, filter.condition, filter.value);
}

function byNumberField(
  value: NumberFieldValue | null,
  filter: NumberFieldFilter,
) {
  return byNumberFilterCondition(value, filter.condition, filter.value);
}

function byCurrencyField(
  value: CurrencyFieldValue | null,
  filter: CurrencyFieldFilter,
) {
  return byNumberFilterCondition(value, filter.condition, filter.value);
}

function byCheckboxField(value: boolean, filter: CheckboxFieldFilter) {
  return byBooleanFilterCondition(value, filter.condition, filter.value);
}

function byNumberFilterCondition(
  value: number | null,
  condition: NumberFilterCondition,
  filterValue: number,
): boolean {
  if (value === null) {
    return condition === 'is_empty';
  }

  if (condition === 'equal') {
    return value === filterValue;
  } else if (condition === 'not_equal') {
    return value !== filterValue;
  } else if (condition === 'less_than') {
    return value < filterValue;
  } else if (condition === 'greater_than') {
    return value > filterValue;
  } else if (condition === 'less_than_or_equal') {
    return value <= filterValue;
  } else if (condition === 'greater_than_or_equal') {
    return value >= filterValue;
  }

  return false;
}

function byTextFilterCondition(
  value: string | null,
  condition: TextFilterCondition,
  filterValue: string,
): boolean {
  if (value === null) {
    return condition === 'is_empty';
  }

  if (condition === 'contains') {
    return value.includes(filterValue);
  } else if (condition === 'does_not_contain') {
    return !value.includes(filterValue);
  } else if (condition === 'is') {
    return value === filterValue;
  } else if (condition === 'is_empty') {
    return value === '';
  } else if (condition === 'is_not') {
    return value !== filterValue;
  }

  return false;
}

function byDateFilterCondition(
  value: Date | null,
  condition: DateFilterCondition,
  filterValue: Date,
): boolean {}

function byDocumentLinkFilterCondition(
  value: string | null,
  condition: DocumentLinkFilterCondition,
  filterValue: string,
): boolean {}

function byMultiSelectFilterCondition(
  value: string[] | null,
  condition: MultiSelectFilterCondition,
  filterValue: string[],
): boolean {}

function bySingleSelectFilterCondition(
  value: string | null,
  condition: SingleSelectFilterCondition,
  filterValue: string,
): boolean {}

function byBooleanFilterCondition(
  value: boolean,
  condition: BooleanFilterCondition,
  filterValue: boolean,
): boolean {}
