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
        const applyFilter = applyFilterMap[field.type];

        return applyFilter(doc.fields[fieldID], filter);
      });
    }

    // TODO: Apply sorting

    // TODO: Apply grouping

    return finalDocuments;
  },
});

const applyFilterMap: {
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
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextFieldFilter(filter);

    return bySingleLineTextField(value, filter);
  },
  [FieldType.Number]: (value, filter) => {
    assertNumberFieldValue(value);
    assertNumberFieldFilter(filter);

    return byNumberField(value, filter);
  },
  [FieldType.SingleSelect]: (value, filter) => {
    return true;
  },
  [FieldType.MultiSelect]: (value, filter) => {
    return true;
  },
  [FieldType.SingleCollaborator]: (value, filter) => {
    return true;
  },
  [FieldType.MultiCollaborator]: (value, filter) => {
    return true;
  },
  [FieldType.SingleDocumentLink]: (value, filter) => {
    return true;
  },
  [FieldType.MultiDocumentLink]: (value, filter) => {
    return true;
  },
  [FieldType.Date]: (value, filter) => {
    return true;
  },
  [FieldType.PhoneNumber]: (value, filter) => {
    return true;
  },
  [FieldType.Email]: (value, filter) => {
    return true;
  },
  [FieldType.URL]: (value, filter) => {
    return true;
  },
  [FieldType.Currency]: (value, filter) => {
    return true;
  },
  [FieldType.Checkbox]: (value, filter) => {
    return true;
  },
};

function byNumberField(
  value: NumberFieldValue | null,
  filter: NumberFieldFilter,
) {
  return byNumberFilterCondition(value, filter.condition, filter.value);
}

function byNumberFilterCondition(
  value: number | null,
  condition: NumberFilterCondition,
  filterValue: number,
): boolean {
  if (value !== null) {
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
    } else if (condition === 'is_not_empty') {
      return true;
    }
  } else {
    if (condition === 'is_empty') {
      return true;
    }
  }

  return false;
}

function bySingleLineTextField(
  value: SingleLineTextFieldValue | null,
  filter: SingleLineTextFieldFilter,
) {
  return byTextFilterCondition(value, filter.condition, filter.value);
}

function byTextFilterCondition(
  value: string | null,
  condition: TextFilterCondition,
  filterValue: string,
): boolean {
  if (value !== null) {
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
    } else if (condition === 'is_not_empty') {
      return value !== '';
    }
  } else {
    if (condition === 'is_empty') {
      return true;
    }
  }

  return false;
}
