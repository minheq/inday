import { selectorFamily, selector } from 'recoil';
import {
  documentsByIDState,
  collectionsByIDState,
  fieldsByIDState,
  filtersByIDState,
  spacesByIDState,
  viewsByIDState,
  sortsByIDState,
  collaboratorsByIDState,
  groupsByIDState,
  DocumentsByIDState,
} from './atoms';
import { Document, DocumentID } from './documents';
import { Collection, CollectionID } from './collections';
import { Field, FieldID, FieldValue } from './fields';
import {
  Filter,
  FilterGroup,
  FilterID,
  filterDocuments,
  FilterGetters,
} from './filters';
import { Space, SpaceID } from './spaces';
import { View, ViewID } from './views';
import { Sort, SortID, sortDocuments, SortGetters } from './sorts';
import { Collaborator, CollaboratorID } from './collaborators';
import { Group, GroupID } from './groups';
import { keyedBy, last } from '../../lib/array_utils';
import { isEmpty } from '../../lib/lang_utils';
import { getKeyValue, keysOf } from '../../lib/object_utils';

export const spaceQuery = selectorFamily<Space | null, SpaceID>({
  key: 'SpaceQuery',
  get: (spaceID: SpaceID) => ({ get }) => {
    const spacesByID = get(spacesByIDState);
    const space = getKeyValue(spacesByID, spaceID);

    if (space === undefined) {
      return null;
    }

    return space;
  },
});

export const spaceCollectionsQuery = selectorFamily<Collection[], SpaceID>({
  key: 'SpaceCollectionsQuery',
  get: (spaceID: SpaceID) => ({ get }) => {
    const collections = get(collectionsQuery);

    return collections.filter((c) => c.spaceID === spaceID);
  },
});

export const spacesQuery = selector<Space[]>({
  key: 'SpacesQuery',
  get: ({ get }) => {
    const spacesByID = get(spacesByIDState);

    return Object.values(spacesByID);
  },
});

export const documentsQuery = selector<Document[]>({
  key: 'DocumentsQuery',
  get: ({ get }) => {
    const documentsByID = get(documentsByIDState);

    return Object.values(documentsByID);
  },
});

export const documentQuery = selectorFamily<Document, DocumentID>({
  key: 'DocumentQuery',
  get: (documentID: DocumentID) => ({ get }) => {
    const documentsByID = get(documentsByIDState);
    const document = getKeyValue(documentsByID, documentID);

    if (document === undefined) {
      throw new Error('Document not found');
    }

    return document;
  },
});

export const collectionDocumentsQuery = selectorFamily<
  Document[],
  CollectionID
>({
  key: 'CollectionDocumentsQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const documents = get(documentsQuery);

    return documents.filter(
      (document) => document.collectionID === collectionID,
    );
  },
});

export const collectionsQuery = selector<Collection[]>({
  key: 'CollectionsQuery',
  get: ({ get }) => {
    const collectionsByID = get(collectionsByIDState);

    return Object.values(collectionsByID);
  },
});

export const collectionQuery = selectorFamily<Collection, CollectionID>({
  key: 'CollectionQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const collectionsByID = get(collectionsByIDState);
    const collection = getKeyValue(collectionsByID, collectionID);

    if (collection === undefined) {
      throw new Error('Collection not found');
    }

    return collection;
  },
});

export const fieldsQuery = selector<Field[]>({
  key: 'FieldsQuery',
  get: ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    return Object.values(fieldsByID);
  },
});

export const fieldQuery = selectorFamily<Field, FieldID>({
  key: 'FieldQuery',
  get: (fieldID: FieldID) => ({ get }) => {
    const fieldsByID = get(fieldsByIDState);

    const field = getKeyValue(fieldsByID, fieldID);

    if (field === undefined) {
      throw new Error('Field not found');
    }

    return field;
  },
});

export const collectionFieldsByIDQuery = selectorFamily<
  { [fieldID: string]: Field },
  CollectionID
>({
  key: 'CollectionFieldsByIDQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
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

export const collectionFieldsQuery = selectorFamily<Field[], CollectionID>({
  key: 'CollectionFieldsQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const fields = get(fieldsQuery);

    return fields.filter((f) => f.collectionID === collectionID);
  },
});

export const filtersQuery = selector<Filter[]>({
  key: 'FiltersQuery',
  get: ({ get }) => {
    const filtersByID = get(filtersByIDState);

    return Object.values(filtersByID);
  },
});

export const filterQuery = selectorFamily<Filter, FilterID>({
  key: 'FilterQuery',
  get: (filterID: FilterID) => ({ get }) => {
    const filtersByID = get(filtersByIDState);

    const filter = getKeyValue(filtersByID, filterID);

    if (filter === undefined) {
      throw new Error('Filter not found');
    }

    return filter;
  },
});

export const sortsQuery = selector<Sort[]>({
  key: 'SortsQuery',
  get: ({ get }) => {
    const sortsByID = get(sortsByIDState);

    return Object.values(sortsByID);
  },
});

export const sortQuery = selectorFamily<Sort, SortID>({
  key: 'SortQuery',
  get: (sortID: SortID) => ({ get }) => {
    const sortsByID = get(sortsByIDState);

    const sort = getKeyValue(sortsByID, sortID);

    if (sort === undefined) {
      throw new Error('Sort not found');
    }

    return sort;
  },
});

export const groupsQuery = selector<Group[]>({
  key: 'GroupsQuery',
  get: ({ get }) => {
    const groupsByID = get(groupsByIDState);

    return Object.values(groupsByID);
  },
});

export const groupQuery = selectorFamily<Group, GroupID>({
  key: 'GroupQuery',
  get: (groupID: GroupID) => ({ get }) => {
    const groupsByID = get(groupsByIDState);

    const group = getKeyValue(groupsByID, groupID);

    if (group === undefined) {
      throw new Error('Sort not found');
    }

    return group;
  },
});

export const viewsQuery = selector<View[]>({
  key: 'ViewsQuery',
  get: ({ get }) => {
    const viewsByID = get(viewsByIDState);

    return Object.values(viewsByID);
  },
});

export const viewQuery = selectorFamily<View, ViewID>({
  key: 'ViewQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const viewsByID = get(viewsByIDState);
    const view = getKeyValue(viewsByID, viewID);

    if (view === undefined) {
      throw new Error('View not found');
    }

    return view;
  },
});

export const viewFiltersQuery = selectorFamily<Filter[], ViewID>({
  key: 'ViewFiltersQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const filters = get(filtersQuery);

    return filters
      .slice(0)
      .filter((f) => f.viewID === viewID)
      .sort((a, b) => a.group - b.group);
  },
});

export const viewSortsQuery = selectorFamily<Sort[], ViewID>({
  key: 'ViewSortsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const sorts = get(sortsQuery);

    return sorts
      .slice(0)
      .filter((f) => f.viewID === viewID)
      .sort((a, b) => a.sequence - b.sequence);
  },
});

export const viewGroupsQuery = selectorFamily<Group[], ViewID>({
  key: 'ViewGroupsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const groups = get(groupsQuery);

    return groups
      .slice(0)
      .filter((f) => f.viewID === viewID)
      .sort((a, b) => a.sequence - b.sequence);
  },
});

export const viewFilterGroupsQuery = selectorFamily<FilterGroup[], ViewID>({
  key: 'ViewFilterGroupsQuery',
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
  key: 'ViewFiltersGroupMaxQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const filterGroups = get(viewFilterGroupsQuery(viewID));

    const lastFilterGroup = last(filterGroups);

    if (lastFilterGroup === undefined) {
      return 0;
    }

    return lastFilterGroup[0].group;
  },
});

export const viewSortsSequenceMaxQuery = selectorFamily<number, ViewID>({
  key: 'ViewSortsSequenceMaxQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const sorts = get(viewSortsQuery(viewID));

    if (isEmpty(sorts)) {
      return 0;
    }

    return Math.max(...sorts.map((s) => s.sequence));
  },
});

export const viewGroupsSequenceMaxQuery = selectorFamily<number, ViewID>({
  key: 'ViewGroupsSequenceMaxQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const group = get(viewGroupsQuery(viewID));

    if (isEmpty(group)) {
      return 0;
    }

    return Math.max(...group.map((s) => s.sequence));
  },
});

export const collectionViewsQuery = selectorFamily<View[], CollectionID>({
  key: 'CollectionViewsQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const views = get(viewsQuery);

    return views.filter((v) => v.collectionID === collectionID);
  },
});

export const collectionDocumentsByIDQuery = selectorFamily<
  DocumentsByIDState,
  CollectionID
>({
  key: 'CollectionDocumentsByIDQuery',
  get: (collectionID: CollectionID) => ({ get }) => {
    const documents = get(documentsQuery);

    const collectionDocuments = documents.filter(
      (r) => r.collectionID === collectionID,
    );

    return keyedBy(collectionDocuments, (r) => r.id);
  },
});

export const collaboratorQuery = selectorFamily<Collaborator, CollaboratorID>({
  key: 'CollaboratorQuery',
  get: (collaboratorID: CollaboratorID) => ({ get }) => {
    const collaboratorsByID = get(collaboratorsByIDState);
    const collaborator = getKeyValue(collaboratorsByID, collaboratorID);

    if (collaborator === undefined) {
      throw new Error('Collaborator not found');
    }

    return collaborator;
  },
});

export const collaboratorsQuery = selector<Collaborator[]>({
  key: 'Collaborators',
  get: ({ get }) => {
    const collaboratorsByID = get(collaboratorsByIDState);

    return Object.values(collaboratorsByID);
  },
});

export const documentFieldValueQuery = selectorFamily<
  FieldValue,
  { documentID: DocumentID; fieldID: FieldID }
>({
  key: 'DocumentFieldValueQuery',
  get: ({ documentID, fieldID }) => ({ get }) => {
    const documentsByID = get(documentsByIDState);
    const document = getKeyValue(documentsByID, documentID);

    if (document === undefined) {
      throw new Error('Document not found');
    }

    return getKeyValue(document.fields, fieldID);
  },
});

export const sortGettersQuery = selector<SortGetters>({
  key: 'SortGettersQuery',
  get: ({ get }) => {
    const getField = (fieldID: FieldID) => get(fieldQuery(fieldID));
    const getDocument = (documentID: DocumentID) =>
      get(documentQuery(documentID));
    const getCollaborator = (collaboratorID: CollaboratorID) =>
      get(collaboratorQuery(collaboratorID));
    const getCollection = (collectionID: CollectionID) =>
      get(collectionQuery(collectionID));

    return {
      getField,
      getDocument,
      getCollaborator,
      getCollection,
    };
  },
});

export const filterGettersQuery = selector<FilterGetters>({
  key: 'FilterGettersQuery',
  get: ({ get }) => {
    const getField = (fieldID: FieldID) => get(fieldQuery(fieldID));

    return { getField };
  },
});

export const viewDocumentsQuery = selectorFamily<Document[], ViewID>({
  key: 'ViewDocumentsQuery',
  get: (viewID: ViewID) => ({ get }) => {
    const view = get(viewQuery(viewID));
    const documents = get(collectionDocumentsQuery(view.collectionID));
    const filterGroups = get(viewFilterGroupsQuery(viewID));
    const sorts = get(viewSortsQuery(viewID));
    const sortGetters = get(sortGettersQuery);
    const filterGetters = get(filterGettersQuery);

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

export const documentFieldsEntriesQuery = selectorFamily<
  [Field, FieldValue][],
  DocumentID
>({
  key: 'DocumentFieldsEntriesQuery',
  get: (documentID: DocumentID) => ({ get }) => {
    const document = get(documentQuery(documentID));

    const fieldIDs = keysOf(document.fields);
    const fields = fieldIDs.map((fieldID) => get(fieldQuery(fieldID)));

    return fields.map((field) => {
      const value = getKeyValue(document.fields, field.id);

      return [field, value];
    });
  },
});
