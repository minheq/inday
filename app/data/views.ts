import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { viewsByIDFixtures } from './fixtures';
import { FieldType } from './constants';
import { FieldID, fieldQuery, Field } from './fields';
import {
  Document,
  DocumentFieldValue,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiSelectFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleSelectFieldValue,
  assertURLFieldValue,
} from './documents';
import { collectionDocumentsQuery } from './collections';
import {
  Filter,
  assertCheckboxFieldFilter,
  assertCurrencyFieldFilter,
  assertDateFieldFilter,
  assertEmailFieldFilter,
  assertMultiCollaboratorFieldFilter,
  assertMultiDocumentLinkFieldFilter,
  assertMultiLineTextFieldFilter,
  assertMultiSelectFieldFilter,
  assertNumberFieldFilter,
  assertPhoneNumberFieldFilter,
  assertSingleCollaboratorFieldFilter,
  assertSingleDocumentLinkFieldFilter,
  assertSingleLineTextFieldFilter,
  assertSingleSelectFieldFilter,
  assertURLFieldFilter,
  booleanFiltersByRule,
  dateFiltersByRule,
  multiSelectFiltersByRule,
  numberFiltersByRule,
  singleSelectFiltersByRule,
  textFiltersByRule,
  filtersQuery,
} from './filters';
import { last, isEmpty } from '../../lib/data_structures/arrays';

export type ViewID = string;

export enum Sort {
  Ascending,
  Descending,
}

interface BaseView {
  id: ViewID;
  name: string;
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
  stackFieldID: FieldID;
}

export interface BoardView extends BaseView, BoardViewConfig {}

export type View = ListView | BoardView;
export type ViewType = View['type'];

export type ViewsByIDState = { [viewID: string]: View | undefined };
export const viewsByIDState = atom<ViewsByIDState>({
  key: RecoilKey.ViewsByID,
  default: viewsByIDFixtures,
  persistence_UNSTABLE: { type: true },
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

export const viewFiltersQuery = selectorFamily<Filter[], string>({
  key: RecoilKey.ViewFilters,
  get: (viewID: string) => ({ get }) => {
    const view = get(viewQuery(viewID));
    let filters = get(filtersQuery);

    return filters
      .filter((f) => f.viewID === view.id)
      .sort((a, b) => a.group - b.group);
  },
});

export type FilterGroup = Filter[];

export const viewFilterGroupsQuery = selectorFamily<FilterGroup[], string>({
  key: RecoilKey.ViewFilters,
  get: (viewID: string) => ({ get }) => {
    const filters = get(viewFiltersQuery(viewID));

    const filterGroups: Filter[][] = [];

    let currentGroup = 1;

    for (const filter of filters) {
      if (filter.group === currentGroup && filterGroups[currentGroup - 1]) {
        filterGroups[currentGroup - 1].push(filter);
      } else {
        filterGroups.push([filter]);
        currentGroup++;
      }
    }

    return filterGroups;
  },
});

export const viewFiltersGroupMaxQuery = selectorFamily<number, string>({
  key: RecoilKey.ViewFilters,
  get: (viewID: string) => ({ get }) => {
    const filterGroups = get(viewFilterGroupsQuery(viewID));

    if (isEmpty(filterGroups)) {
      return 0;
    }

    const lastFilterGroup = last(filterGroups);

    return lastFilterGroup[0].group;
  },
});

export const viewDocumentsQuery = selectorFamily<Document[], string>({
  key: RecoilKey.ViewDocuments,
  get: (viewID: string) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const documents = get(collectionDocumentsQuery(view.collectionID));
    const filterGroups = get(viewFilterGroupsQuery(viewID));

    function getField(fieldID: string) {
      return get(fieldQuery(fieldID));
    }

    let finalDocuments = documents;

    finalDocuments = filterDocumentsByView(
      filterGroups,
      finalDocuments,
      getField,
    );
    // TODO: Apply sorting
    // TODO: Apply view. List, Board, Calendar
    // TODO: Apply grouping

    return finalDocuments;
  },
});

export function filterDocumentsByView(
  filterGroups: FilterGroup[],
  documents: Document[],
  getField: (fieldID: string) => Field,
) {
  let filteredDocuments = documents;

  filteredDocuments = filteredDocuments.filter((doc) => {
    return filterGroups.some((filterGroup) => {
      return filterGroup.every((filter) => {
        const field = getField(filter.fieldID);
        const applyFilter = filtersByFieldType[field.type];

        return applyFilter(doc.fields[filter.fieldID], filter);
      });
    });
  });

  return filteredDocuments;
}

const filtersByFieldType: {
  [fieldType in FieldType]: (
    value: DocumentFieldValue,
    filter: Filter,
  ) => boolean;
} = {
  [FieldType.Checkbox]: (value, filter) => {
    assertCheckboxFieldValue(value);
    assertCheckboxFieldFilter(filter);

    const applyFilter = booleanFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.Currency]: (value, filter) => {
    assertCurrencyFieldValue(value);
    assertCurrencyFieldFilter(filter);

    const applyFilter = numberFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.Date]: (value, filter) => {
    assertDateFieldValue(value);
    assertDateFieldFilter(filter);

    const applyFilter = dateFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.Email]: (value, filter) => {
    assertEmailFieldValue(value);
    assertEmailFieldFilter(filter);

    const applyFilter = textFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiCollaborator]: (value, filter) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorFieldFilter(filter);

    const applyFilter = multiSelectFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiDocumentLink]: (value, filter) => {
    assertMultiDocumentLinkFieldValue(value);
    assertMultiDocumentLinkFieldFilter(filter);

    const applyFilter = multiSelectFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiLineText]: (value, filter) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextFieldFilter(filter);

    const applyFilter = textFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.MultiSelect]: (value, filter) => {
    assertMultiSelectFieldValue(value);
    assertMultiSelectFieldFilter(filter);

    const applyFilter = multiSelectFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.Number]: (value, filter) => {
    assertNumberFieldValue(value);
    assertNumberFieldFilter(filter);

    const applyFilter = numberFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.PhoneNumber]: (value, filter) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberFieldFilter(filter);

    const applyFilter = textFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.SingleCollaborator]: (value, filter) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorFieldFilter(filter);

    const applyFilter = singleSelectFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },

  [FieldType.SingleDocumentLink]: (value, filter) => {
    assertSingleDocumentLinkFieldValue(value);
    assertSingleDocumentLinkFieldFilter(filter);

    const applyFilter = singleSelectFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.SingleLineText]: (value, filter) => {
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextFieldFilter(filter);

    const applyFilter = textFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },

  [FieldType.SingleSelect]: (value, filter) => {
    assertSingleSelectFieldValue(value);
    assertSingleSelectFieldFilter(filter);

    const applyFilter = singleSelectFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
  [FieldType.URL]: (value, filter) => {
    assertURLFieldValue(value);
    assertURLFieldFilter(filter);

    const applyFilter = textFiltersByRule[filter.rule];

    return applyFilter(value, filter.value);
  },
};
