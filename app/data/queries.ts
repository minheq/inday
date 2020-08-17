import { selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';
import {
  documentsByIDState,
  collectionsByIDState,
  fieldsByIDState,
  filtersByIDState,
  spacesByIDState,
  viewsByIDState,
  sortsByIDState,
  collaboratorsByIDState,
} from './atoms';
import { Document, DocumentID } from './documents';
import { Collection, CollectionID } from './collections';
import { Field, FieldID } from './fields';
import {
  Filter,
  FilterGroup,
  FilterID,
  filterDocuments,
  FilterGetters,
} from './filters';
import { Space, SpaceID } from './spaces';
import { View, ViewID } from './views';
import { isEmpty, last } from '../../lib/data_structures/arrays';
import { Sort, SortID, sortDocuments, SortGetters } from './sorts';
import { CollaboratorID, Collaborator } from './collaborators';

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

export const collectionQuery = selectorFamily<Collection, string>({
  key: RecoilKey.Collection,
  get: (collectionID: CollectionID) => ({ get }) => {
    const collectionsByID = get(collectionsByIDState);
    const collection = collectionsByID[collectionID];

    if (collection === undefined) {
      throw new Error('Collection not found');
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
  key: RecoilKey.CollectionFieldsByID,
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
  key: RecoilKey.CollectionFields,
  get: (collectionID: string) => ({ get }) => {
    const fields = get(fieldsQuery);

    return fields.filter((f) => f.collectionID === collectionID);
  },
});

export const filtersQuery = selector({
  key: RecoilKey.Filters,
  get: ({ get }) => {
    const filtersByID = get(filtersByIDState);

    return Object.values(filtersByID) as Filter[];
  },
});

export const filterQuery = selectorFamily<Filter, FilterID>({
  key: RecoilKey.Filter,
  get: (filterID: FilterID) => ({ get }) => {
    const filtersByID = get(filtersByIDState);

    const filter = filtersByID[filterID];

    if (filter === undefined) {
      throw new Error('Filter not found');
    }

    return filter;
  },
});

export const sortsQuery = selector({
  key: RecoilKey.Sorts,
  get: ({ get }) => {
    const sortsByID = get(sortsByIDState);

    return Object.values(sortsByID) as Sort[];
  },
});

export const sortQuery = selectorFamily<Sort, SortID>({
  key: RecoilKey.Sort,
  get: (sortID: SortID) => ({ get }) => {
    const sortsByID = get(sortsByIDState);

    const sort = sortsByID[sortID];

    if (sort === undefined) {
      throw new Error('Sort not found');
    }

    return sort;
  },
});

export const viewsQuery = selector({
  key: RecoilKey.Views,
  get: ({ get }) => {
    const viewsByID = get(viewsByIDState);

    return Object.values(viewsByID) as View[];
  },
});

export const viewQuery = selectorFamily<View, ViewID>({
  key: RecoilKey.View,
  get: (viewID: ViewID) => ({ get }) => {
    const viewsByID = get(viewsByIDState);
    const view = viewsByID[viewID];

    if (view === undefined) {
      throw new Error('View not found');
    }

    return view;
  },
});

export const viewFiltersQuery = selectorFamily<Filter[], ViewID>({
  key: RecoilKey.ViewFilters,
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const filters = get(filtersQuery);

    return filters
      .filter((f) => f.viewID === view.id)
      .sort((a, b) => a.group - b.group);
  },
});

export const viewSortsQuery = selectorFamily<Sort[], ViewID>({
  key: RecoilKey.ViewSorts,
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    let sorts = get(sortsQuery);

    return sorts
      .filter((f) => f.viewID === view.id)
      .sort((a, b) => a.sequence - b.sequence);
  },
});

export const viewFilterGroupsQuery = selectorFamily<FilterGroup[], ViewID>({
  key: RecoilKey.ViewFilterGroups,
  get: (viewID: ViewID) => ({ get }) => {
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

export const viewFiltersGroupMaxQuery = selectorFamily<number, ViewID>({
  key: RecoilKey.ViewFiltersGroupMax,
  get: (viewID: ViewID) => ({ get }) => {
    const filterGroups = get(viewFilterGroupsQuery(viewID));

    if (isEmpty(filterGroups)) {
      return 0;
    }

    const lastFilterGroup = last(filterGroups);

    return lastFilterGroup[0].group;
  },
});

export const viewSortsSequenceMaxQuery = selectorFamily<number, ViewID>({
  key: RecoilKey.ViewFilters,
  get: (viewID: ViewID) => ({ get }) => {
    const sorts = get(viewSortsQuery(viewID));

    if (isEmpty(sorts)) {
      return 0;
    }

    return Math.max(...sorts.map((s) => s.sequence));
  },
});

export const collectionViewsQuery = selectorFamily<View[], string>({
  key: RecoilKey.CollectionViews,
  get: (collectionID: string) => ({ get }) => {
    const views = get(viewsQuery);

    return views.filter((v) => v.collectionID === collectionID);
  },
});

export const collaboratorQuery = selectorFamily<Collaborator, CollaboratorID>({
  key: RecoilKey.Collaborator,
  get: (collaboratorID: CollaboratorID) => ({ get }) => {
    const collaboratorsByID = get(collaboratorsByIDState);
    const collaborator = collaboratorsByID[collaboratorID];

    if (collaborator === undefined) {
      throw new Error('Collaborator not found');
    }

    return collaborator;
  },
});

export const viewDocumentsQuery = selectorFamily<Document[], string>({
  key: RecoilKey.ViewDocuments,
  get: (viewID: string) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const documents = get(collectionDocumentsQuery(view.collectionID));
    const filterGroups = get(viewFilterGroupsQuery(viewID));
    const sorts = get(viewSortsQuery(viewID));

    const getField = (fieldID: FieldID) => {
      return get(fieldQuery(fieldID));
    };

    const getDocument = (documentID: DocumentID) => {
      return get(documentQuery(documentID));
    };

    const getCollaborator = (collaboratorID: CollaboratorID) => {
      return get(collaboratorQuery(collaboratorID));
    };

    const getCollection = (collectionID: CollectionID) => {
      return get(collectionQuery(collectionID));
    };

    const filterGetters: FilterGetters = {
      getField,
    };

    const sortGetters: SortGetters = {
      getField,
      getDocument,
      getCollaborator,
      getCollection,
    };

    let finalDocuments = documents;

    finalDocuments = filterDocuments(
      filterGroups,
      finalDocuments,
      filterGetters,
    );
    finalDocuments = sortDocuments(sorts, finalDocuments, sortGetters);

    return finalDocuments;
  },
});
