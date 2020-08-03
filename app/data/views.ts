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
  assertNumberFieldFilter,
  assertSingleLineTextFieldFilter,
  assertMultiLineTextFieldFilter,
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
  textFiltersByCondition,
  singleSelectFiltersByCondition,
  multiSelectFiltersByCondition,
  dateFiltersByCondition,
  numberFiltersByCondition,
  booleanFiltersByCondition,
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

    // Apply filters
    for (const [fieldID, filter] of filters) {
      const field = get(fieldQuery(fieldID));
      const applyFilter = filtersByFieldType[field.type];

      finalDocuments = finalDocuments.filter((doc) => {
        return applyFilter(doc.fields[fieldID], filter);
      });
    }

    // TODO: Apply sorting

    // TODO: Apply view. List, Board, Calendar

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

    const applyFilter = textFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiLineText]: (value, filter) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextFieldFilter(filter);

    const applyFilter = textFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.SingleSelect]: (value, filter) => {
    assertSingleSelectFieldValue(value);
    assertSingleSelectFieldFilter(filter);

    const applyFilter = singleSelectFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiSelect]: (value, filter) => {
    assertMultiSelectFieldValue(value);
    assertMultiSelectFieldFilter(filter);

    const applyFilter = multiSelectFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.SingleCollaborator]: (value, filter) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorFieldFilter(filter);

    const applyFilter = singleSelectFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiCollaborator]: (value, filter) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorFieldFilter(filter);

    const applyFilter = multiSelectFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.SingleDocumentLink]: (value, filter) => {
    assertSingleDocumentLinkFieldValue(value);
    assertSingleDocumentLinkFieldFilter(filter);

    const applyFilter = singleSelectFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiDocumentLink]: (value, filter) => {
    assertMultiDocumentLinkFieldValue(value);
    assertMultiDocumentLinkFieldFilter(filter);

    const applyFilter = multiSelectFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.Date]: (value, filter) => {
    assertDateFieldValue(value);
    assertDateFieldFilter(filter);

    const applyFilter = dateFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.PhoneNumber]: (value, filter) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberFieldFilter(filter);

    const applyFilter = textFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.Email]: (value, filter) => {
    assertEmailFieldValue(value);
    assertEmailFieldFilter(filter);

    const applyFilter = textFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.URL]: (value, filter) => {
    assertURLFieldValue(value);
    assertURLFieldFilter(filter);

    const applyFilter = textFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.Number]: (value, filter) => {
    assertNumberFieldValue(value);
    assertNumberFieldFilter(filter);

    const applyFilter = numberFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.Currency]: (value, filter) => {
    assertCurrencyFieldValue(value);
    assertCurrencyFieldFilter(filter);

    const applyFilter = numberFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
  [FieldType.Checkbox]: (value, filter) => {
    assertCheckboxFieldValue(value);
    assertCheckboxFieldFilter(filter);

    const applyFilter = booleanFiltersByCondition[filter.condition];

    return applyFilter(value, filter.value);
  },
};
