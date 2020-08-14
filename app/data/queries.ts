import { selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';
import {
  documentsByIDState,
  collectionsByIDState,
  fieldsByIDState,
  filtersByIDState,
  spacesByIDState,
  viewsByIDState,
} from './atoms';
import { Document } from './documents';
import { Collection, CollectionID } from './collections';
import { Field } from './fields';
import { Filter, FilterGroup } from './filters';
import { Space, SpaceID } from './spaces';
import { View, filterDocumentsByView } from './views';
import { isEmpty, last } from '../../lib/data_structures/arrays';

export const spaceQuery = selectorFamily<Space | null, SpaceID>({
  key: RecoilKey.Space,
  get: (spaceID: SpaceID) => ({ get }) => {
    const spacesByID = get(spacesByIDState);
    const space = spacesByID[spaceID];

    if (space === undefined) {
      return null;
    }

    return space;
  },
});

export const spaceCollectionsQuery = selectorFamily<Collection[], SpaceID>({
  key: RecoilKey.Space,
  get: (spaceID: SpaceID) => ({ get }) => {
    const collections = get(collectionsQuery);

    return collections.filter((c) => c.spaceID === spaceID);
  },
});

export const spacesQuery = selector({
  key: RecoilKey.Spaces,
  get: ({ get }) => {
    const spacesByID = get(spacesByIDState);

    return Object.values(spacesByID) as Space[];
  },
});

export const documentsQuery = selector({
  key: RecoilKey.Documents,
  get: ({ get }) => {
    const documentsByID = get(documentsByIDState);

    return Object.values(documentsByID) as Document[];
  },
});

export const documentQuery = selectorFamily<Document, string>({
  key: RecoilKey.Document,
  get: (documentID: string) => ({ get }) => {
    const documentsByID = get(documentsByIDState);
    const document = documentsByID[documentID];

    if (document === undefined) {
      throw new Error('Document not found');
    }

    return document;
  },
});

export const collectionDocumentsQuery = selectorFamily<Document[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const documents = get(documentsQuery);

    return documents.filter((doc) => doc.collectionID === collectionID);
  },
});

export const collectionsQuery = selector({
  key: RecoilKey.Collections,
  get: ({ get }) => {
    const collectionsByID = get(collectionsByIDState);

    return Object.values(collectionsByID) as Collection[];
  },
});

export const collectionQuery = selectorFamily<Collection | null, string>({
  key: RecoilKey.Collection,
  get: (collectionID: CollectionID) => ({ get }) => {
    const collectionsByID = get(collectionsByIDState);
    const collection = collectionsByID[collectionID];

    if (collection === undefined) {
      return null;
    }

    return collection;
  },
});

export const fieldsQuery = selector({
  key: RecoilKey.Fields,
  get: ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    return Object.values(fieldsByID) as Field[];
  },
});

export const fieldQuery = selectorFamily<Field, string>({
  key: RecoilKey.Field,
  get: (fieldID: string) => ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    const field = fieldsByID[fieldID];

    if (field === undefined) {
      throw new Error('Field not found');
    }

    return field;
  },
});

export const collectionFieldsByIDQuery = selectorFamily<
  { [fieldID: string]: Field },
  string
>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    const fieldsByID: { [fieldID: string]: Field } = {};

    for (const field of fields) {
      if (field.collectionID === collectionID) {
        fieldsByID[field.id] = field;
      }
    }

    return fieldsByID;
  },
});

export const collectionFieldsQuery = selectorFamily<Field[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    return fields.filter((f) => f.collectionID === collectionID);
  },
});

export const filtersQuery = selector({
  key: RecoilKey.Filters,
  get: ({ get }) => {
    const viewsByID = get(filtersByIDState);

    return Object.values(viewsByID) as Filter[];
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

export const collectionViewsQuery = selectorFamily<View[], string>({
  key: RecoilKey.Collection,
  get: (collectionID: string) => ({ get }) => {
    const views = get(viewsQuery);

    return views.filter((v) => v.collectionID === collectionID);
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
