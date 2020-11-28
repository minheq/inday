import { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil';

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
import { Field, FieldConfig, FieldID, FieldValue } from './fields';
import { Record, RecordID } from './records';
import {
  Filter,
  FilterConfig,
  updateFilterGroup,
  FilterID,
  deleteFilter,
  FilterGroup,
} from './filters';
import { useLogger } from '../../lib/logger/logger';
import {
  workspaceState,
  spacesByIDState,
  collectionsByIDState,
  viewsByIDState,
  filtersByIDState,
  FiltersByIDState,
  ViewsByIDState,
  fieldsByIDState,
  recordsByIDState,
  sortsByIDState,
  eventsState,
  SortsByIDState,
  groupsByIDState,
  GroupsByIDState,
  SpacesByIDState,
  collaboratorsByIDState,
  CollaboratorsByIDState,
  RecordsByIDState,
  CollectionsByIDState,
} from './atoms';
import {
  spaceQuery,
  spaceCollectionsQuery,
  collectionQuery,
  collectionFieldsQuery,
  collectionRecordsQuery,
  collectionFieldsByIDQuery,
  collectionViewsQuery,
  viewQuery,
  viewRecordsQuery,
  viewFilterGroupsQuery,
  viewFiltersQuery,
  viewFiltersGroupMaxQuery,
  fieldQuery,
  recordQuery,
  viewSortsQuery,
  filterQuery,
  sortQuery,
  viewSortsSequenceMaxQuery,
  viewGroupsSequenceMaxQuery,
  viewGroupsQuery,
  groupQuery,
  collectionRecordsByIDQuery,
  recordFieldValueQuery,
  collaboratorsQuery,
  collaboratorQuery,
} from './queries';
import { SortConfig, Sort, SortID, deleteSort } from './sorts';
import { GroupConfig, Group, GroupID, deleteGroup } from './groups';
import { Workspace } from './workspace';
import { Collaborator } from './collaborators';
import { UserID } from './user';

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
      id: SpaceID(),
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

export function useGetCollaborator(collaboratorID: UserID): Collaborator {
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

export function useGetCollectionRecords(collectionID: CollectionID): Record[] {
  return useRecoilValue(collectionRecordsQuery(collectionID));
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
        id: CollectionID(),
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

export function useUpdateRecordFieldValue<T extends FieldValue>(): (
  recordID: RecordID,
  fieldID: FieldID,
  nextValue: T,
) => void {
  const emitEvent = useEmitEvent();
  const setRecordsByID = useSetRecoilState(recordsByIDState);
  const getRecord = useGetRecordCallback();

  return useCallback(
    (recordID, fieldID, nextValue) => {
      const prevRecord = getRecord(recordID);
      const prevValue = prevRecord.fields[fieldID];

      const nextRecord: Record = {
        ...prevRecord,
        fields: {
          ...prevRecord.fields,
          [fieldID]: nextValue,
        },
      };

      setRecordsByID((previousRecordsByID) => ({
        ...previousRecordsByID,
        [nextRecord.id]: nextRecord,
      }));

      emitEvent({
        name: 'RecordFieldValueUpdated',
        fieldID,
        prevValue,
        nextValue,
      });
    },
    [emitEvent, getRecord, setRecordsByID],
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
    ({ snapshot }) => async (viewID: ViewID) => {
      return snapshot.getPromise(viewQuery(viewID));
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

export function useGetViewRecords(viewID: ViewID): Record[] {
  return useRecoilValue(viewRecordsQuery(viewID));
}

export function useGetCollectionRecordsByID(
  collectionID: CollectionID,
): RecordsByIDState {
  return useRecoilValue(collectionRecordsByIDQuery(collectionID));
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

export function useGetViewFilters(viewID: ViewID) {
  return useRecoilValue(viewFiltersQuery(viewID));
}

export function useGetViewSorts(viewID: ViewID): Sort[] {
  return useRecoilValue(viewSortsQuery(viewID));
}

export function useGetViewGroups(viewID: ViewID) {
  return useRecoilValue(viewGroupsQuery(viewID));
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
        id: FilterID(),
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
        id: SortID(),
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
  groupConfig: GroupConfig,
) => Group {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);

  return useCallback(
    (viewID: ViewID, sequence: number, groupConfig: GroupConfig) => {
      const newGroup: Group = {
        id: GroupID(),
        viewID,
        sequence,
        ...groupConfig,
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

export function useUpdateGroupConfig() {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);
  const getGroup = useGetGroupCallback();

  return useCallback(
    async (groupID: GroupID, groupConfig: GroupConfig) => {
      const prevGroup = await getGroup(groupID);

      const nextGroup: Group = {
        ...prevGroup,
        ...groupConfig,
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

export function useUpdateListViewFieldConfig() {
  const emitEvent = useEmitEvent();
  const getView = useGetViewCallback();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  return useCallback(
    async (viewID: ViewID, fieldID: FieldID, config: ListViewFieldConfig) => {
      const prevView = await getView(viewID);

      assertListView(prevView);

      const nextView: View = {
        ...prevView,
        fieldsConfig: {
          ...prevView.fieldsConfig,
          [fieldID]: config,
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

export function useCreateView() {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  return useCallback(
    (collectionID: CollectionID) => {
      const newView: View = {
        id: ViewID(),
        name: '',
        type: 'list',
        fixedFieldCount: 1,
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

export function useGetFieldCallback() {
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

export function useGetRecordFieldValue(
  recordID: RecordID,
  fieldID: FieldID,
): FieldValue {
  const params = useMemo(() => ({ recordID, fieldID }), [recordID, fieldID]);

  return useRecoilValue(recordFieldValueQuery(params));
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

export function useGetRecordCallback() {
  const records = useRecoilValue(recordsByIDState);

  return useCallback(
    (recordID: RecordID) => {
      const record = records[recordID];

      if (record === undefined) {
        throw new Error('Record not found');
      }

      return record;
    },
    [records],
  );
}

export function useGetRecord(recordID: RecordID) {
  const record = useRecoilValue(recordQuery(recordID));

  if (record === null) {
    throw new Error('Record not found');
  }

  return record;
}

export function useCreateRecord() {
  const emitEvent = useEmitEvent();
  const setRecords = useSetRecoilState(recordsByIDState);

  return useCallback(
    (collectionID: CollectionID) => {
      const newRecord: Record = {
        id: RecordID(),
        fields: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        collectionID,
      };

      setRecords((previousRecords) => ({
        ...previousRecords,
        [newRecord.id]: newRecord,
      }));

      emitEvent({
        name: 'RecordCreated',
        record: newRecord,
      });

      return newRecord;
    },
    [emitEvent, setRecords],
  );
}

export function useDeleteRecord() {
  const emitEvent = useEmitEvent();
  const setRecords = useSetRecoilState(recordsByIDState);

  return useCallback(
    (record: Record) => {
      setRecords((previousRecords) => {
        const updatedRecords = { ...previousRecords };

        delete updatedRecords[record.id];

        return updatedRecords;
      });

      emitEvent({
        name: 'RecordDeleted',
        record,
      });
    },
    [emitEvent, setRecords],
  );
}

export interface UpdateRecordNameInput {
  recordID: RecordID;
}

export function useUpdateRecordName() {
  const emitEvent = useEmitEvent();
  const getRecord = useGetRecordCallback();
  const setRecords = useSetRecoilState(recordsByIDState);

  return useCallback(
    (input: UpdateRecordNameInput) => {
      const { recordID } = input;
      const prevRecord = getRecord(recordID);

      const nextRecord: Record = {
        ...prevRecord,
      };

      setRecords((previousRecords) => ({
        ...previousRecords,
        [nextRecord.id]: nextRecord,
      }));

      emitEvent({
        name: 'RecordNameUpdated',
        prevRecord,
        nextRecord,
      });
    },
    [getRecord, setRecords, emitEvent],
  );
}
