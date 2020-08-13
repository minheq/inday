import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { viewsByIDFixtures } from './fake_data';
import { FieldID, fieldQuery, Field } from './fields';
import { Document } from './documents';
import { collectionDocumentsQuery } from './collections';
import { Filter, filtersQuery, filtersByFieldType } from './filters';
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
  // @ts-ignore: will be stable
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
    if (isEmpty(filterGroups)) {
      return true;
    }

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

export function assertListView(view: View): asserts view is ListView {
  if (view.type !== 'list') {
    throw new Error(`Expected view to be list. Received ${view.type}`);
  }
}

export function assertBoardView(view: View): asserts view is ListView {
  if (view.type !== 'board') {
    throw new Error(`Expected view to be board. Received ${view.type}`);
  }
}
