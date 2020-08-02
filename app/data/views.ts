import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { view1, view2 } from './fake_data';
import { FieldType } from './constants';
import { FieldID, fieldQuery } from './fields';
import {
  SingleLineTextFieldValue,
  Document,
  DocumentFieldValue,
} from './documents';
import { collectionDocumentsQuery } from './collections';

type TextFilterCondition =
  | 'contains'
  | 'does_not_contain'
  | 'is'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

interface SingleLineTextFilter {
  condition: TextFilterCondition;
  value: string;
}

interface MultiLineTextFilter {
  condition: TextFilterCondition;
  value: string;
}

type SingleSelectFilterCondition =
  | 'is'
  | 'is_not'
  | 'is_any_of'
  | 'is_none_of'
  | 'is_empty'
  | 'is_not_empty';

interface SingleSelectFilter {
  condition: SingleSelectFilterCondition;
  value: string;
}

type MultiSelectFilterCondition =
  | 'has_any_of'
  | 'has_all_of'
  | 'is_exactly'
  | 'has_none_of'
  | 'is_empty'
  | 'is_not_empty';

interface MultiSelectFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

interface SingleCollaboratorFilter {
  condition: SingleSelectFilterCondition;
  value: string;
}

interface MultiCollaboratorFilter {
  condition: MultiSelectFilterCondition;
  value: string[];
}

type DocumentLinkFilterCondition =
  | 'contains'
  | 'does_not_contain'
  | 'is_empty'
  | 'is_not_empty';

interface SingleDocumentLinkFilter {
  condition: DocumentLinkFilterCondition;
  value: string;
}

interface MultiDocumentLinkFilter {
  condition: DocumentLinkFilterCondition;
  value: string;
}

type DateFilterCondition =
  | 'is'
  | 'is_within'
  | 'is_before'
  | 'is_after'
  | 'is_on_or_before'
  | 'is_on_or_after'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

interface DateFilter {
  condition: DateFilterCondition;
  value: Date;
}

interface PhoneNumberFilter {
  condition: TextFilterCondition;
  value: string;
}

interface EmailFilter {
  condition: TextFilterCondition;
  value: string;
}

interface URLFilter {
  condition: TextFilterCondition;
  value: string;
}

type NumberFilterCondition =
  | 'equal'
  | 'not_equal'
  | 'less_than'
  | 'greater_than'
  | 'less_than_or_equal'
  | 'greater_than_or_equal'
  | 'is_empty'
  | 'is_not_empty';

interface NumberFilter {
  condition: NumberFilterCondition;
  value: number;
}

interface CurrencyFilter {
  condition: NumberFilterCondition;
  value: {
    amount: number;
    currency: string;
  };
}

interface CheckboxFilter {
  value: boolean;
}

type Filter =
  | SingleLineTextFilter
  | MultiLineTextFilter
  | SingleSelectFilter
  | MultiSelectFilter
  | SingleCollaboratorFilter
  | MultiCollaboratorFilter
  | SingleDocumentLinkFilter
  | MultiDocumentLinkFilter
  | DateFilter
  | PhoneNumberFilter
  | EmailFilter
  | URLFilter
  | NumberFilter
  | CurrencyFilter
  | CheckboxFilter;

interface FieldFilter {
  fieldID: string;
  value: Filter;
}

export type ViewID = string;

interface BaseView {
  id: ViewID;
  name: string;
  filters: FieldFilter[];
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

    let filteredDocuments = documents;

    for (const filter of filters) {
      const { fieldID } = filter;
      const field = get(fieldQuery(fieldID));

      filteredDocuments = filteredDocuments.filter((doc) => {
        if (field.type === FieldType.SingleLineText) {
          const fieldValue = getDocumentSingleTextValue(doc.fields[fieldID]);
          const filterValue = getSingleTextFilter(filter.value);

          if (filterValue.condition === 'contains') {
            return fieldValue.includes(filterValue.value);
          } else if (filterValue.condition === 'does_not_contain') {
            return !fieldValue.includes(filterValue.value);
          } else if (filterValue.condition === 'is') {
            return fieldValue === filterValue.value;
          } else if (filterValue.condition === 'is_empty') {
            return fieldValue === '';
          } else if (filterValue.condition === 'is_not') {
            return fieldValue !== filterValue.value;
          } else if (filterValue.condition === 'is_not_empty') {
            return fieldValue !== '';
          }

          return false;
        }
      });
    }

    return filteredDocuments;
  },
});

function getDocumentSingleTextValue(
  value: DocumentFieldValue,
): SingleLineTextFieldValue {
  if (typeof value !== 'string') {
    throw new Error('');
  }

  return value;
}

function getSingleTextFilter(value: Filter): SingleLineTextFilter {
  if (typeof value !== 'string') {
    throw new Error('');
  }

  return value;
}
