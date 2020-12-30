import { useCallback, useMemo } from 'react';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback,
  Loadable,
} from 'recoil';

import { useEventEmitter, EventConfig, Event } from './events';
import { Collection, CollectionID } from './collections';

import { Space, SpaceID } from './spaces';
import {
  View,
  ViewID,
  assertListView,
  FieldWithListViewConfig,
  ListViewFieldConfig,
} from './views';
import { Field, FieldConfig, FieldID, FieldValue, FieldType } from './fields';
import { Document, DocumentFieldValues, DocumentID } from './documents';
import {
  Filter,
  FilterConfig,
  updateFilterGroup,
  FilterID,
  deleteFilter,
  FilterGroup,
} from './filters';
import { useLogger } from '../../lib/logger';
import {
  workspaceState,
  spacesByIDState,
  collectionsByIDState,
  viewsByIDState,
  filtersByIDState,
  FiltersByIDState,
  ViewsByIDState,
  fieldsByIDState,
  documentsByIDState,
  sortsByIDState,
  eventsState,
  SortsByIDState,
  groupsByIDState,
  GroupsByIDState,
  SpacesByIDState,
  collaboratorsByIDState,
  CollaboratorsByIDState,
  DocumentsByIDState,
  CollectionsByIDState,
} from './atoms';
import {
  spaceQuery,
  spaceCollectionsQuery,
  collectionQuery,
  collectionFieldsQuery,
  collectionDocumentsQuery,
  collectionFieldsByIDQuery,
  collectionViewsQuery,
  viewQuery,
  viewDocumentsQuery,
  viewFilterGroupsQuery,
  viewFiltersQuery,
  viewFiltersGroupMaxQuery,
  fieldQuery,
  documentQuery,
  viewSortsQuery,
  filterQuery,
  sortQuery,
  viewSortsSequenceMaxQuery,
  viewGroupsSequenceMaxQuery,
  viewGroupsQuery,
  groupQuery,
  collectionDocumentsByIDQuery,
  documentFieldValueQuery,
  collaboratorsQuery,
  collaboratorQuery,
  sortGettersQuery,
  documentFieldsEntriesQuery,
} from './queries';
import { SortConfig, Sort, SortID, deleteSort, SortGetters } from './sorts';
import { Group, GroupID, deleteGroup } from './groups';
import { Workspace } from './workspace';
import { Collaborator, CollaboratorID } from './collaborators';
import { keyedBy } from '../../lib/array_utils';
import { assertUnreached, map } from '../../lib/lang_utils';

export function useGetWorkspace(): Workspace {
  const workspace = useRecoilValue(workspaceState);

  if (workspace === null) {
    throw new Error('Workspace not found');
  }

  return workspace;
}

export function useEmitEvent(): (eventConfig: EventConfig) => void {
  const logger = useLogger();
  const eventEmitter = useEventEmitter();
  const workspace = useGetWorkspace();
  const setEvents = useSetRecoilState(eventsState);

  return useCallback(
    (eventConfig: EventConfig) => {
      const event: Event = {
        ...eventConfig,
        createdAt: new Date(),
        workspaceID: workspace.id,
      };

      setEvents((prevEvents) => [...prevEvents, event]);

      logger.debug('Emit event', event);

      eventEmitter.emit(event);
    },
    [workspace, setEvents, eventEmitter, logger],
  );
}

export function useGetSpaces(): SpacesByIDState {
  return useRecoilValue(spacesByIDState);
}

export function useGetSpaceCallback(): (spaceID: SpaceID) => Space {
  const spaces = useGetSpaces();

  return useCallback(
    (spaceID: SpaceID) => {
      const space = spaces[spaceID];

      if (space === undefined) {
        throw new Error('Space not found');
      }

      return space;
    },
    [spaces],
  );
}

export function useGetSpace(spaceID: SpaceID): Space {
  const space = useRecoilValue(spaceQuery(spaceID));

  if (space === null) {
    throw new Error('Space not found');
  }

  return space;
}

export function useGetSpaceCollections(spaceID: SpaceID): Collection[] {
  return useRecoilValue(spaceCollectionsQuery(spaceID));
}

export function useCreateSpace(): () => Space {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setSpaces = useSetRecoilState(spacesByIDState);
  const createCollection = useCreateCollection();

  return useCallback(() => {
    const newSpace: Space = {
      id: Space.generateID(),
      name: '',
      workspaceID: workspace.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSpaces((previousSpaces) => ({
      ...previousSpaces,
      [newSpace.id]: newSpace,
    }));

    emitEvent({
      name: 'SpaceCreated',
      space: newSpace,
    });

    createCollection(newSpace.id);

    return newSpace;
  }, [emitEvent, workspace, setSpaces, createCollection]);
}

export function useDeleteSpace(): (space: Space) => void {
  const emitEvent = useEmitEvent();
  const setSpaces = useSetRecoilState(spacesByIDState);

  return useCallback(
    (space: Space) => {
      setSpaces((previousSpaces) => {
        const updatedSpaces = { ...previousSpaces };

        delete updatedSpaces[space.id];

        return updatedSpaces;
      });

      emitEvent({
        name: 'SpaceDeleted',
        space,
      });
    },
    [emitEvent, setSpaces],
  );
}

export interface UpdateSpaceNameInput {
  spaceID: SpaceID;
  name: string;
}

export function useUpdateSpaceName(): (input: UpdateSpaceNameInput) => void {
  const emitEvent = useEmitEvent();
  const getSpace = useGetSpaceCallback();
  const setSpaces = useSetRecoilState(spacesByIDState);

  return useCallback(
    (input: UpdateSpaceNameInput) => {
      const { spaceID, name } = input;
      const prevSpace = getSpace(spaceID);

      const nextSpace: Space = {
        ...prevSpace,
        name,
      };

      setSpaces((previousSpaces) => ({
        ...previousSpaces,
        [nextSpace.id]: nextSpace,
      }));

      emitEvent({
        name: 'SpaceNameUpdated',
        prevSpace,
        nextSpace,
      });
    },
    [emitEvent, setSpaces, getSpace],
  );
}

export function useGetCollaboratorsByID(): CollaboratorsByIDState {
  return useRecoilValue(collaboratorsByIDState);
}

export function useGetCollaborators(): Collaborator[] {
  return useRecoilValue(collaboratorsQuery);
}

export function useGetCollaborator(
  collaboratorID: CollaboratorID,
): Collaborator {
  return useRecoilValue(collaboratorQuery(collaboratorID));
}

export function useGetCollectionsByID(): CollectionsByIDState {
  return useRecoilValue(collectionsByIDState);
}

export function useGetCollectionCallback(): (
  collectionID: CollectionID,
) => Collection {
  const collections = useGetCollectionsByID();

  return useCallback(
    (collectionID) => {
      const collection = collections[collectionID];

      if (collection === undefined) {
        throw new Error('Collection not found');
      }

      return collection;
    },
    [collections],
  );
}

export function useGetCollection(collectionID: CollectionID): Collection {
  const collection = useRecoilValue(collectionQuery(collectionID));

  if (collection === null) {
    throw new Error('Collection not found');
  }

  return collection;
}

export function useGetCollectionFields(collectionID: CollectionID): Field[] {
  return useRecoilValue(collectionFieldsQuery(collectionID));
}

export function useGetCollectionFieldsCallback(): (
  collectionID: CollectionID,
) => Loadable<Field[]> {
  return useRecoilCallback(
    ({ snapshot }) => (collectionID: CollectionID) => {
      return snapshot.getLoadable(collectionFieldsQuery(collectionID));
    },
    [],
  );
}

export function useGetCollectionDocuments(
  collectionID: CollectionID,
): Document[] {
  return useRecoilValue(collectionDocumentsQuery(collectionID));
}

export function useGetCollectionFieldsByID(
  collectionID: CollectionID,
): {
  [fieldID: string]: Field;
} {
  return useRecoilValue(collectionFieldsByIDQuery(collectionID));
}

export function useGetCollectionViews(collectionID: CollectionID): View[] {
  return useRecoilValue(collectionViewsQuery(collectionID));
}

export function useCreateCollection(): (spaceID: SpaceID) => Collection {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsByIDState);
  const createView = useCreateView();

  return useCallback(
    (spaceID: SpaceID) => {
      const newCollection: Collection = {
        id: Collection.generateID(),
        name: '',
        primaryFieldID: Field.generateID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        spaceID,
      };

      setCollections((previousCollections) => ({
        ...previousCollections,
        [newCollection.id]: newCollection,
      }));

      emitEvent({
        name: 'CollectionCreated',
        collection: newCollection,
      });

      createView(newCollection.id);

      return newCollection;
    },
    [emitEvent, setCollections, createView],
  );
}

export function useUpdateDocumentFieldValue<T extends FieldValue>(): (
  documentID: DocumentID,
  fieldID: FieldID,
  nextValue: T,
) => void {
  const emitEvent = useEmitEvent();
  const setDocumentsByID = useSetRecoilState(documentsByIDState);
  const getDocument = useGetDocumentCallback();

  return useCallback(
    (documentID, fieldID, nextValue) => {
      const prevDocument = getDocument(documentID);
      const prevValue = prevDocument.fields[fieldID];

      const nextDocument: Document = {
        ...prevDocument,
        fields: {
          ...prevDocument.fields,
          [fieldID]: nextValue,
        },
      };

      setDocumentsByID((previousDocumentsByID) => ({
        ...previousDocumentsByID,
        [nextDocument.id]: nextDocument,
      }));

      emitEvent({
        name: 'DocumentFieldValueUpdated',
        fieldID,
        prevValue,
        nextValue,
      });
    },
    [emitEvent, getDocument, setDocumentsByID],
  );
}

export function useDeleteCollection() {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsByIDState);

  return useCallback(
    (collection: Collection) => {
      setCollections((previousCollections) => {
        const updatedCollections = { ...previousCollections };

        delete updatedCollections[collection.id];

        return updatedCollections;
      });

      emitEvent({
        name: 'CollectionDeleted',
        collection,
      });
    },
    [emitEvent, setCollections],
  );
}

export interface UpdateCollectionNameInput {
  collectionID: CollectionID;
  name: string;
}

export function useUpdateCollectionName() {
  const emitEvent = useEmitEvent();
  const getCollection = useGetCollectionCallback();
  const setCollections = useSetRecoilState(collectionsByIDState);

  return useCallback(
    (input: UpdateCollectionNameInput) => {
      const { collectionID, name } = input;
      const prevCollection = getCollection(collectionID);

      const nextCollection: Collection = {
        ...prevCollection,
        name,
      };

      setCollections((previousCollections) => ({
        ...previousCollections,
        [nextCollection.id]: nextCollection,
      }));

      emitEvent({
        name: 'CollectionNameUpdated',
        prevCollection,
        nextCollection,
      });
    },
    [getCollection, setCollections, emitEvent],
  );
}

export function useGetViewCallback() {
  return useRecoilCallback(
    ({ snapshot }) => (viewID: ViewID) => {
      return snapshot.getLoadable(viewQuery(viewID));
    },
    [],
  );
}

export function useGetGroupCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (groupID: GroupID) => {
      return snapshot.getPromise(groupQuery(groupID));
    },
    [],
  );
}

export function useGetView(viewID: ViewID): View {
  return useRecoilValue(viewQuery(viewID));
}

export function useGetViewDocuments(viewID: ViewID): Document[] {
  return useRecoilValue(viewDocumentsQuery(viewID));
}

export function useGetCollectionDocumentsByID(
  collectionID: CollectionID,
): DocumentsByIDState {
  return useRecoilValue(collectionDocumentsByIDQuery(collectionID));
}

export function useGetFiltersByID() {
  return useRecoilValue(filtersByIDState);
}

export function useGetFilterCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (filterID: FilterID) => {
      return snapshot.getPromise(filterQuery(filterID));
    },
    [],
  );
}

export function useGetSortCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (sortID: SortID) => {
      return snapshot.getPromise(sortQuery(sortID));
    },
    [],
  );
}

export function useGetViewFiltersGroups(viewID: ViewID): FilterGroup[] {
  return useRecoilValue(viewFilterGroupsQuery(viewID));
}

export function useGetDocumentPrimaryFieldValueCallback(): (
  documentID: DocumentID,
) => [field: Field, value: FieldValue] {
  const getDocument = useGetDocumentCallback();
  const getCollection = useGetCollectionCallback();
  const getField = useGetFieldCallback();

  return useCallback(
    (documentID: DocumentID) => {
      const document = getDocument(documentID);
      const collection = getCollection(document.collectionID);
      const field = getField(collection.primaryFieldID);

      return [field, document.fields[collection.primaryFieldID]];
    },
    [getDocument, getCollection, getField],
  );
}

export function useGetDocumentPrimaryFieldValue(
  documentID: DocumentID,
): [field: Field, value: FieldValue] {
  const getDocument = useGetDocumentCallback();
  const getCollection = useGetCollectionCallback();
  const getField = useGetFieldCallback();

  const document = getDocument(documentID);
  const collection = getCollection(document.collectionID);

  const field = getField(collection.primaryFieldID);

  return [field, document.fields[collection.primaryFieldID]];
}

export function useGetViewFilters(viewID: ViewID) {
  return useRecoilValue(viewFiltersQuery(viewID));
}

export function useGetDocumentFieldValuesEntries(
  documentID: DocumentID,
): [Field, FieldValue][] {
  return useRecoilValue(documentFieldsEntriesQuery(documentID));
}

export function useGetViewSorts(viewID: ViewID): Sort[] {
  return useRecoilValue(viewSortsQuery(viewID));
}

export function useGetViewGroups(viewID: ViewID): Group[] {
  return useRecoilValue(viewGroupsQuery(viewID));
}

export function useGetSortGetters(): SortGetters {
  return useRecoilValue(sortGettersQuery);
}

export function useGetViewFiltersCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: ViewID) => {
      return snapshot.getPromise(viewFiltersQuery(viewID));
    },
    [],
  );
}

export function useGetViewSortsCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: ViewID) => {
      return snapshot.getPromise(viewSortsQuery(viewID));
    },
    [],
  );
}

export function useGetViewGroupsCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: ViewID) => {
      return snapshot.getPromise(viewGroupsQuery(viewID));
    },
    [],
  );
}

export function useGetFiltersGroupMax(viewID: ViewID) {
  return useRecoilValue(viewFiltersGroupMaxQuery(viewID));
}

export function useGetSortsSequenceMax(viewID: ViewID) {
  return useRecoilValue(viewSortsSequenceMaxQuery(viewID));
}

export function useGetGroupsSequenceMax(viewID: ViewID) {
  return useRecoilValue(viewGroupsSequenceMaxQuery(viewID));
}

export function useCreateFilter() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);

  return useCallback(
    (viewID: ViewID, group: number, filterConfig: FilterConfig) => {
      const newFilter: Filter = {
        id: Filter.generateID(),
        viewID,
        group,
        ...filterConfig,
      };

      setFilters((prevFilters) => ({
        ...prevFilters,
        [newFilter.id]: newFilter,
      }));

      emitEvent({
        name: 'FilterCreated',
        filter: newFilter,
      });

      return newFilter;
    },
    [emitEvent, setFilters],
  );
}

export function useUpdateFilterConfig() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);
  const getFilter = useGetFilterCallback();

  return useCallback(
    async (filterID: FilterID, group: number, filterConfig: FilterConfig) => {
      const prevFilter = await getFilter(filterID);

      const nextFilter: Filter = {
        ...prevFilter,
        ...filterConfig,
        group,
      };
      setFilters((prevFilters) => ({
        ...prevFilters,
        [nextFilter.id]: nextFilter,
      }));

      emitEvent({
        name: 'FilterConfigUpdated',
        prevFilter,
        nextFilter,
      });

      return nextFilter;
    },
    [emitEvent, setFilters, getFilter],
  );
}

export function useUpdateFilterGroup() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);
  const getViewFilters = useGetViewFiltersCallback();
  const getFilter = useGetFilterCallback();

  return useCallback(
    async (filterID: FilterID, value: 'and' | 'or') => {
      const prevFilter = await getFilter(filterID);
      const prevFilters = await getViewFilters(prevFilter.viewID);

      const nextFilters = updateFilterGroup(prevFilter, value, prevFilters);

      setFilters((previousFilters) => ({
        ...previousFilters,
        ...nextFilters,
      }));

      emitEvent({
        name: 'FilterGroupUpdated',
        prevFilters,
        nextFilters: Object.values(nextFilters),
      });

      return nextFilters[filterID];
    },
    [emitEvent, setFilters, getFilter, getViewFilters],
  );
}

export function useDeleteFilter() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState<FiltersByIDState>(filtersByIDState);
  const getViewFilter = useGetViewFiltersCallback();

  return useCallback(
    async (filter: Filter) => {
      const prevFilters = await getViewFilter(filter.viewID);
      const nextFilters = deleteFilter(filter, prevFilters);

      setFilters((_prevFilters) => {
        const clonedPreviousFilters: FiltersByIDState = {
          ..._prevFilters,
        };

        delete clonedPreviousFilters[filter.id];

        return {
          ...clonedPreviousFilters,
          ...nextFilters,
        };
      });

      emitEvent({
        name: 'FilterDeleted',
        prevFilters,
        nextFilters: Object.values(nextFilters),
      });
    },
    [emitEvent, setFilters, getViewFilter],
  );
}

export function useCreateSort() {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState(sortsByIDState);

  return useCallback(
    (viewID: ViewID, sequence: number, sortConfig: SortConfig) => {
      const newSort: Sort = {
        id: Sort.generateID(),
        viewID,
        sequence,
        ...sortConfig,
      };

      setSorts((previousSorts) => ({
        ...previousSorts,
        [newSort.id]: newSort,
      }));

      emitEvent({
        name: 'SortCreated',
        sort: newSort,
      });

      return newSort;
    },
    [emitEvent, setSorts],
  );
}

export function useUpdateSortConfig() {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState(sortsByIDState);
  const getSort = useGetSortCallback();

  return useCallback(
    async (sortID: SortID, sortConfig: SortConfig) => {
      const prevSort = await getSort(sortID);

      const nextSort: Sort = {
        ...prevSort,
        ...sortConfig,
      };

      setSorts((previousSorts) => ({
        ...previousSorts,
        [nextSort.id]: nextSort,
      }));

      emitEvent({
        name: 'SortConfigUpdated',
        prevSort,
        nextSort,
      });

      return nextSort;
    },
    [emitEvent, setSorts, getSort],
  );
}

export function useDeleteSort() {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState<SortsByIDState>(sortsByIDState);
  const getViewSorts = useGetViewSortsCallback();

  return useCallback(
    async (sort: Sort) => {
      const prevSorts = await getViewSorts(sort.viewID);
      const nextSorts = deleteSort(sort, prevSorts);

      setSorts((previousSorts) => {
        const clonedPreviousSorts: SortsByIDState = {
          ...previousSorts,
        };

        delete clonedPreviousSorts[sort.id];

        return {
          ...clonedPreviousSorts,
          ...nextSorts,
        };
      });

      emitEvent({
        name: 'SortDeleted',
        prevSorts,
        nextSorts: Object.values(nextSorts),
      });
    },
    [emitEvent, setSorts, getViewSorts],
  );
}

export function useCreateGroup(): (
  viewID: ViewID,
  sequence: number,
  sortConfig: SortConfig,
) => Group {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);

  return useCallback(
    (viewID: ViewID, sequence: number, sortConfig: SortConfig) => {
      const newGroup: Group = {
        id: Group.generateID(),
        viewID,
        sequence,
        ...sortConfig,
      };

      setGroups((previousGroups) => ({
        ...previousGroups,
        [newGroup.id]: newGroup,
      }));

      emitEvent({
        name: 'GroupCreated',
        group: newGroup,
      });

      return newGroup;
    },
    [emitEvent, setGroups],
  );
}

export function useUpdateGroupSortConfig() {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);
  const getGroup = useGetGroupCallback();

  return useCallback(
    async (groupID: GroupID, sortConfig: SortConfig) => {
      const prevGroup = await getGroup(groupID);

      const nextGroup: Group = {
        ...prevGroup,
        ...sortConfig,
      };

      setGroups((previousGroups) => ({
        ...previousGroups,
        [nextGroup.id]: nextGroup,
      }));

      emitEvent({
        name: 'GroupConfigUpdated',
        prevGroup,
        nextGroup,
      });

      return nextGroup;
    },
    [emitEvent, setGroups, getGroup],
  );
}

export function useDeleteGroup() {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState<GroupsByIDState>(groupsByIDState);
  const getViewGroups = useGetViewGroupsCallback();

  return useCallback(
    async (group: Group) => {
      const prevGroups = await getViewGroups(group.viewID);
      const nextGroups = deleteGroup(group, prevGroups);

      setGroups((previousGroups) => {
        const clonedPreviousGroups: GroupsByIDState = {
          ...previousGroups,
        };

        delete clonedPreviousGroups[group.id];

        return {
          ...clonedPreviousGroups,
          ...nextGroups,
        };
      });

      emitEvent({
        name: 'GroupDeleted',
        prevGroups,
        nextGroups: Object.values(nextGroups),
      });
    },
    [emitEvent, setGroups, getViewGroups],
  );
}

export function useGetListViewFieldConfig(
  viewID: ViewID,
  fieldID: FieldID,
): ListViewFieldConfig {
  const view = useGetView(viewID);

  assertListView(view);

  return view.fieldsConfig[fieldID];
}

export function useGetSortedFieldsWithListViewConfig(
  viewID: ViewID,
): FieldWithListViewConfig[] {
  const view = useGetView(viewID);

  assertListView(view);

  const fields = useGetCollectionFields(view.collectionID);

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

export function useUpdateListViewFieldConfig(): (
  viewID: ViewID,
  fieldID: FieldID,
  config: Partial<ListViewFieldConfig>,
) => void {
  const emitEvent = useEmitEvent();
  const getView = useGetViewCallback();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  return useCallback(
    (
      viewID: ViewID,
      fieldID: FieldID,
      config: Partial<ListViewFieldConfig>,
    ) => {
      const prevView = getView(viewID).getValue();

      assertListView(prevView);

      const nextConfig: ListViewFieldConfig = {
        order: config.order || prevView.fieldsConfig[fieldID].order,
        width: config.width || prevView.fieldsConfig[fieldID].width,
        visible: config.visible || prevView.fieldsConfig[fieldID].visible,
      };

      const nextView: View = {
        ...prevView,
        fieldsConfig: {
          ...prevView.fieldsConfig,
          [fieldID]: nextConfig,
        },
      };

      setViews((previousViews) => ({
        ...previousViews,
        [nextView.id]: nextView,
      }));

      emitEvent({
        name: 'ListViewFieldConfigUpdated',
        prevView,
        nextView,
      });
    },
    [emitEvent, setViews, getView],
  );
}

export function useCreateView(): (collectionID: CollectionID) => View {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  return useCallback(
    (collectionID: CollectionID) => {
      const newView: View = {
        id: View.generateID(),
        name: '',
        type: 'list',
        fixedFieldCount: 1,
        groupsConfig: {},
        fieldsConfig: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        collectionID,
      };

      setViews((previousViews) => ({
        ...previousViews,
        [newView.id]: newView,
      }));

      emitEvent({
        name: 'ViewCreated',
        view: newView,
      });

      return newView;
    },
    [emitEvent, setViews],
  );
}

export function useDeleteView() {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState(viewsByIDState);

  return useCallback(
    (view: View) => {
      setViews((previousViews) => {
        const updatedViews = { ...previousViews };

        delete updatedViews[view.id];

        return updatedViews;
      });

      emitEvent({
        name: 'ViewDeleted',
        view,
      });
    },
    [emitEvent, setViews],
  );
}

export interface UpdateViewNameInput {
  viewID: ViewID;
  name: string;
}

export function useUpdateViewName() {
  const emitEvent = useEmitEvent();
  const getView = useGetViewCallback();
  const setViews = useSetRecoilState(viewsByIDState);

  return useCallback(
    async (input: UpdateViewNameInput) => {
      const { viewID, name } = input;
      const prevView = await getView(viewID);

      const nextView: View = {
        ...prevView,
        name,
      };

      setViews((previousViews) => ({
        ...previousViews,
        [nextView.id]: nextView,
      }));

      emitEvent({
        name: 'ViewNameUpdated',
        prevView,
        nextView,
      });
    },
    [getView, setViews, emitEvent],
  );
}

export function useGetFieldCallback(): (fieldID: FieldID) => Field {
  const fields = useRecoilValue(fieldsByIDState);

  return useCallback(
    (fieldID: FieldID) => {
      const field = fields[fieldID];

      if (field === undefined) {
        throw new Error('Field not found');
      }

      return field;
    },
    [fields],
  );
}

export function useGetField(fieldID: FieldID) {
  const field = useRecoilValue(fieldQuery(fieldID));

  if (field === null) {
    throw new Error('Field not found');
  }

  return field;
}

export function useGetFieldConfig(fieldID: FieldID): FieldConfig {
  const field = useRecoilValue(fieldQuery(fieldID));

  if (field === null) {
    throw new Error('Field config not found');
  }

  return field;
}

export function useGetDocumentFieldValue(
  documentID: DocumentID,
  fieldID: FieldID,
): FieldValue {
  const params = useMemo(() => ({ documentID, fieldID }), [
    documentID,
    fieldID,
  ]);

  return useRecoilValue(documentFieldValueQuery(params));
}

export function useCreateField() {
  const emitEvent = useEmitEvent();
  const setFields = useSetRecoilState(fieldsByIDState);

  return useCallback(
    (
      collectionID: CollectionID,
      name: string,
      description: string,
      fieldConfig: FieldConfig,
    ) => {
      const newField: Field = {
        id: Field.generateID(),
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        collectionID,
        ...fieldConfig,
      };

      setFields((previousFields) => ({
        ...previousFields,
        [newField.id]: newField,
      }));

      emitEvent({
        name: 'FieldCreated',
        field: newField,
      });

      return newField;
    },
    [emitEvent, setFields],
  );
}

export function useDeleteField() {
  const emitEvent = useEmitEvent();
  const setFields = useSetRecoilState(fieldsByIDState);

  return useCallback(
    (field: Field) => {
      setFields((previousFields) => {
        const updatedFields = { ...previousFields };

        delete updatedFields[field.id];

        return updatedFields;
      });

      emitEvent({
        name: 'FieldDeleted',
        field,
      });
    },
    [emitEvent, setFields],
  );
}

export interface UpdateFieldNameInput {
  fieldID: FieldID;
  name: string;
}

export function useUpdateFieldName() {
  const emitEvent = useEmitEvent();
  const getField = useGetFieldCallback();
  const setFields = useSetRecoilState(fieldsByIDState);

  return useCallback(
    (input: UpdateFieldNameInput) => {
      const { fieldID, name } = input;
      const prevField = getField(fieldID);

      const nextField: Field = {
        ...prevField,
        name,
      };

      setFields((previousFields) => ({
        ...previousFields,
        [nextField.id]: nextField,
      }));

      emitEvent({
        name: 'FieldNameUpdated',
        prevField,
        nextField,
      });
    },
    [getField, setFields, emitEvent],
  );
}

export function useGetDocumentCallback(): (documentID: DocumentID) => Document {
  const documents = useRecoilValue(documentsByIDState);

  return useCallback(
    (documentID: DocumentID) => {
      const document = documents[documentID];

      if (document === undefined) {
        throw new Error('Document not found');
      }

      return document;
    },
    [documents],
  );
}

export function useGetDocument(documentID: DocumentID): Document {
  const document = useRecoilValue(documentQuery(documentID));

  if (document === null) {
    throw new Error('Document not found');
  }

  return document;
}

function getDefaultFieldValue(field: Field): FieldValue {
  switch (field.type) {
    case FieldType.Checkbox:
      return false;
    case FieldType.Currency:
    case FieldType.Number:
    case FieldType.Date:
    case FieldType.SingleCollaborator:
    case FieldType.SingleOption:
    case FieldType.SingleDocumentLink:
      return null;
    case FieldType.PhoneNumber:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.MultiLineText:
    case FieldType.SingleLineText:
      return '';
    case FieldType.MultiCollaborator:
    case FieldType.MultiOption:
    case FieldType.MultiDocumentLink:
      return [];
    default:
      assertUnreached(field);
  }
}

function getDefaultDocumentFieldValues(fields: Field[]): DocumentFieldValues {
  const fieldsByID = keyedBy(fields, (field) => field.id);
  return map(fieldsByID, getDefaultFieldValue);
}

export function useCreateDocument(): (
  collectionID: CollectionID,
  values?: DocumentFieldValues,
) => Document {
  const emitEvent = useEmitEvent();
  const setDocuments = useSetRecoilState(documentsByIDState);
  const getCollectionFields = useGetCollectionFieldsCallback();

  return useCallback(
    (collectionID: CollectionID, values?: DocumentFieldValues) => {
      const loadableFields = getCollectionFields(collectionID);

      const newDocument: Document = {
        id: Document.generateID(),
        fields: {
          ...getDefaultDocumentFieldValues(loadableFields.getValue()),
          ...values,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        collectionID,
      };

      setDocuments((previousDocuments) => ({
        ...previousDocuments,
        [newDocument.id]: newDocument,
      }));

      emitEvent({
        name: 'DocumentCreated',
        document: newDocument,
      });

      return newDocument;
    },
    [emitEvent, setDocuments, getCollectionFields],
  );
}

export function useDeleteDocument() {
  const emitEvent = useEmitEvent();
  const setDocuments = useSetRecoilState(documentsByIDState);

  return useCallback(
    (document: Document) => {
      setDocuments((previousDocuments) => {
        const updatedDocuments = { ...previousDocuments };

        delete updatedDocuments[document.id];

        return updatedDocuments;
      });

      emitEvent({
        name: 'DocumentDeleted',
        document,
      });
    },
    [emitEvent, setDocuments],
  );
}

export interface UpdateDocumentNameInput {
  documentID: DocumentID;
}

export function useUpdateDocumentName() {
  const emitEvent = useEmitEvent();
  const getDocument = useGetDocumentCallback();
  const setDocuments = useSetRecoilState(documentsByIDState);

  return useCallback(
    (input: UpdateDocumentNameInput) => {
      const { documentID } = input;
      const prevDocument = getDocument(documentID);

      const nextDocument: Document = {
        ...prevDocument,
      };

      setDocuments((previousDocuments) => ({
        ...previousDocuments,
        [nextDocument.id]: nextDocument,
      }));

      emitEvent({
        name: 'DocumentNameUpdated',
        prevDocument,
        nextDocument,
      });
    },
    [getDocument, setDocuments, emitEvent],
  );
}
