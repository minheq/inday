import { useRecoilValue } from 'recoil';
import { Collaborator, CollaboratorID } from '../../models/collaborators';
import { Collection, CollectionID } from '../../models/collections';
import { Space, SpaceID } from '../../models/spaces';
import { Workspace } from '../../models/workspace';
import { Field, FieldID, FieldValue, FieldConfig } from '../../models/fields';
import {
  collaboratorsByIDState,
  CollaboratorsByIDState,
  collectionsByIDState,
  CollectionsByIDState,
  documentsByIDState,
  DocumentsByIDState,
  FieldsByIDState,
  fieldsByIDState,
  FiltersByIDState,
  filtersByIDState,
  spacesByIDState,
  SpacesByIDState,
  workspaceState,
} from './atoms';
import {
  collaboratorQuery,
  collaboratorsQuery,
  collectionDocumentsByIDQuery,
  collectionDocumentsQuery,
  collectionFieldsByIDQuery,
  collectionFieldsQuery,
  collectionQuery,
  collectionViewsQuery,
  documentFieldsEntriesQuery,
  documentFieldValueQuery,
  documentQuery,
  fieldQuery,
  filterQuery,
  groupQuery,
  sortQuery,
  spaceCollectionsQuery,
  spaceQuery,
  viewFilterGroupsQuery,
  viewFiltersGroupMaxQuery,
  viewFiltersQuery,
  viewGroupsQuery,
  viewGroupsSequenceMaxQuery,
  viewQuery,
  viewSortsQuery,
  viewSortsSequenceMaxQuery,
  workspaceQuery,
} from './selectors';
import { Document, DocumentID } from '../../models/documents';
import {
  assertListView,
  FieldWithListViewConfig,
  ListViewFieldConfig,
  View,
  ViewID,
} from '../../models/views';
import { Sort, sortDocuments, SortGetters, SortID } from '../../models/sorts';
import { Group, GroupID } from '../../models/groups';
import { useCallback, useMemo } from 'react';
import {
  Filter,
  filterDocuments,
  FilterGetters,
  FilterGroup,
  FilterID,
} from '../../models/filters';

export function useSpacesByIDQuery(): SpacesByIDState {
  return useRecoilValue(spacesByIDState);
}

export function useSpaceQuery(spaceID: SpaceID): Space {
  const space = useRecoilValue(spaceQuery(spaceID));

  if (space === null) {
    throw new Error('Space not found');
  }

  return space;
}

export function useSpaceCollectionsQuery(spaceID: SpaceID): Collection[] {
  return useRecoilValue(spaceCollectionsQuery(spaceID));
}

export function useWorkspaceQuery(): Workspace {
  const workspace = useRecoilValue(workspaceQuery);

  if (workspace === null) {
    throw new Error('Workspace not found');
  }

  return workspace;
}

export function useCollaboratorsByIDQuery(): CollaboratorsByIDState {
  return useRecoilValue(collaboratorsByIDState);
}

export function useCollaboratorsQuery(): Collaborator[] {
  return useRecoilValue(collaboratorsQuery);
}

export function useCollaboratorQuery(
  collaboratorID: CollaboratorID,
): Collaborator {
  return useRecoilValue(collaboratorQuery(collaboratorID));
}

export function useCollectionsByIDQuery(): CollectionsByIDState {
  return useRecoilValue(collectionsByIDState);
}

export function useFieldsByIDQuery(): FieldsByIDState {
  return useRecoilValue(fieldsByIDState);
}

export function useDocumentsByIDQuery(): DocumentsByIDState {
  return useRecoilValue(documentsByIDState);
}

export function useCollectionQuery(collectionID: CollectionID): Collection {
  const collection = useRecoilValue(collectionQuery(collectionID));

  if (collection === null) {
    throw new Error('Collection not found');
  }

  return collection;
}

export function useCollectionFieldsQuery(collectionID: CollectionID): Field[] {
  return useRecoilValue(collectionFieldsQuery(collectionID));
}

export function useCollectionDocumentsQuery(
  collectionID: CollectionID,
): Document[] {
  return useRecoilValue(collectionDocumentsQuery(collectionID));
}

export function useCollectionFieldsByIDQuery(
  collectionID: CollectionID,
): {
  [fieldID: string]: Field;
} {
  return useRecoilValue(collectionFieldsByIDQuery(collectionID));
}

export function useCollectionViewsQuery(collectionID: CollectionID): View[] {
  return useRecoilValue(collectionViewsQuery(collectionID));
}

export function useViewQuery(viewID: ViewID): View {
  return useRecoilValue(viewQuery(viewID));
}

function useFieldQueryCallback() {
  const fieldsByID = useFieldsByIDQuery();

  return useCallback(
    (fieldID: FieldID) => {
      const field = fieldsByID[fieldID];

      if (field === undefined) {
        throw new Error(`Field not found for fieldID=${fieldID}`);
      }

      return field;
    },
    [fieldsByID],
  );
}

function useDocumentQueryCallback() {
  const documentsByID = useDocumentsByIDQuery();

  return useCallback(
    (documentID: DocumentID) => {
      const document = documentsByID[documentID];
      if (document === undefined) {
        throw new Error(`Document not found for documentID=${documentID}`);
      }

      return document;
    },
    [documentsByID],
  );
}

function useCollaboratorQueryCallback() {
  const collaboratorsByID = useCollaboratorsByIDQuery();

  return useCallback(
    (collaboratorID: CollaboratorID) => {
      const collaborator = collaboratorsByID[collaboratorID];

      if (collaborator === undefined) {
        throw new Error(
          `Collaborator not found for collaboratorID=${collaboratorID}`,
        );
      }

      return collaborator;
    },
    [collaboratorsByID],
  );
}

function useCollectionQueryCallback() {
  const collectionsByID = useCollectionsByIDQuery();

  return useCallback(
    (collectionID: CollectionID) => {
      const collection = collectionsByID[collectionID];

      if (collection === undefined) {
        throw new Error(
          `Collection not found for collectionID=${collectionID}`,
        );
      }

      return collection;
    },
    [collectionsByID],
  );
}

export function useSortGettersQuery(): SortGetters {
  const getField = useFieldQueryCallback();
  const getDocument = useDocumentQueryCallback();
  const getCollaborator = useCollaboratorQueryCallback();
  const getCollection = useCollectionQueryCallback();

  return {
    getField,
    getDocument,
    getCollaborator,
    getCollection,
  };
}

export function useFilterGettersQuery(): FilterGetters {
  const getField = useFieldQueryCallback();

  return {
    getField,
  };
}

export function useViewDocumentsQuery(viewID: ViewID): Document[] {
  const view = useViewQuery(viewID);
  const filterGroups = useViewFiltersGroupsQuery(viewID);
  const sorts = useViewSortsQuery(viewID);
  const documents = useCollectionDocumentsQuery(view.collectionID);
  const sortGetters = useSortGettersQuery();
  const filterGetters = useFilterGettersQuery();

  let finalDocuments = documents;

  finalDocuments = filterDocuments(filterGroups, finalDocuments, filterGetters);
  finalDocuments = sortDocuments(sorts, finalDocuments, sortGetters);

  return finalDocuments;
}

export function useCollectionDocumentsByIDQuery(
  collectionID: CollectionID,
): DocumentsByIDState {
  return useRecoilValue(collectionDocumentsByIDQuery(collectionID));
}

export function useFiltersByIDQuery(): FiltersByIDState {
  return useRecoilValue(filtersByIDState);
}

export function useFilterQuery(filterID: FilterID): Filter {
  return useRecoilValue(filterQuery(filterID));
}

export function useSortQuery(sortID: SortID): Sort {
  return useRecoilValue(sortQuery(sortID));
}

export function useDocumentPrimaryFieldValueQuery(
  documentID: DocumentID,
): [field: Field, value: FieldValue] {
  const document = useDocumentQuery(documentID);
  const collection = useCollectionQuery(document.collectionID);
  const field = useFieldQuery(collection.primaryFieldID);

  return [field, document.fields[collection.primaryFieldID]];
}

export function useViewFiltersQuery(viewID: ViewID): Filter[] {
  return useRecoilValue(viewFiltersQuery(viewID));
}

export function useDocumentFieldValuesEntriesQuery(
  documentID: DocumentID,
): [Field, FieldValue][] {
  return useRecoilValue(documentFieldsEntriesQuery(documentID));
}

export function useViewSortsQuery(viewID: ViewID): Sort[] {
  return useRecoilValue(viewSortsQuery(viewID));
}

export function useViewGroupsQuery(viewID: ViewID): Group[] {
  return useRecoilValue(viewGroupsQuery(viewID));
}

export function useGroupQuery(groupID: GroupID): Group {
  return useRecoilValue(groupQuery(groupID));
}

export function useFiltersGroupMaxQuery(viewID: ViewID): number {
  return useRecoilValue(viewFiltersGroupMaxQuery(viewID));
}

export function useSortsSequenceMaxQuery(viewID: ViewID): number {
  return useRecoilValue(viewSortsSequenceMaxQuery(viewID));
}

export function useGroupsSequenceMaxQuery(viewID: ViewID): number {
  return useRecoilValue(viewGroupsSequenceMaxQuery(viewID));
}

export function useListViewFieldConfigQuery(
  viewID: ViewID,
  fieldID: FieldID,
): ListViewFieldConfig {
  const view = useViewQuery(viewID);

  assertListView(view);

  return view.fieldsConfig[fieldID];
}

export function useSortedFieldsWithListViewConfigQuery(
  viewID: ViewID,
): FieldWithListViewConfig[] {
  const view = useViewQuery(viewID);

  assertListView(view);

  const fields = useCollectionFieldsQuery(view.collectionID);

  return useMemo(() => {
    return fields
      .slice(0)
      .sort((a, b) => {
        const fieldConfigA = view.fieldsConfig[a.id];
        const fieldConfigB = view.fieldsConfig[b.id];

        if (fieldConfigA.order < fieldConfigB.order) {
          return -1;
        } else if (fieldConfigA.order > fieldConfigB.order) {
          return 1;
        }

        return 0;
      })
      .map((f) => {
        const config = view.fieldsConfig[f.id];

        return {
          ...f,
          config,
        };
      });
  }, [fields, view]);
}

export function useFieldQuery(fieldID: FieldID): Field {
  const field = useRecoilValue(fieldQuery(fieldID));

  if (field === null) {
    throw new Error('Field not found');
  }

  return field;
}

export function useFieldConfigQuery(fieldID: FieldID): FieldConfig {
  const field = useRecoilValue(fieldQuery(fieldID));

  if (field === null) {
    throw new Error('Field config not found');
  }

  return field;
}

export function useDocumentFieldValueQuery(
  documentID: DocumentID,
  fieldID: FieldID,
): FieldValue {
  const params = useMemo(() => ({ documentID, fieldID }), [
    documentID,
    fieldID,
  ]);

  return useRecoilValue(documentFieldValueQuery(params));
}

export function useDocumentQuery(documentID: DocumentID): Document {
  const document = useRecoilValue(documentQuery(documentID));

  if (document === null) {
    throw new Error('Document not found');
  }

  return document;
}

export function useViewFiltersGroupsQuery(viewID: ViewID): FilterGroup[] {
  return useRecoilValue(viewFilterGroupsQuery(viewID));
}
