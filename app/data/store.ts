import { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil';

import { useEventEmitter, EventConfig, Event } from './events';
import { Collection } from './collections';

import { Space } from './spaces';
import {
  View,
  ViewID,
  assertListView,
  FieldWithListViewConfig,
  ListViewFieldConfig,
} from './views';
import { Field, FieldConfig, FieldID } from './fields';
import { Record } from './records';
import { generateID } from '../../lib/id/id';
import {
  Filter,
  FilterConfig,
  updateFilterGroup,
  FilterID,
  deleteFilter,
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
} from './queries';
import { SortConfig, Sort, SortID, deleteSort } from './sorts';
import { GroupConfig, Group, GroupID, deleteGroup } from './groups';

export function useGetWorkspace() {
  const workspace = useRecoilValue(workspaceState);

  if (workspace === null) {
    throw new Error('Workspace not found');
  }

  return workspace;
}

export function useEmitEvent() {
  const logger = useLogger();
  const eventEmitter = useEventEmitter();
  const workspace = useGetWorkspace();
  const setEvents = useSetRecoilState(eventsState);

  const emitEvent = useCallback(
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

  return emitEvent;
}

export function useGetSpaces() {
  return useRecoilValue(spacesByIDState);
}

export function useGetSpaceCallback() {
  const spaces = useGetSpaces();

  const getSpace = useCallback(
    (spaceID: string) => {
      const space = spaces[spaceID];

      if (space === undefined) {
        throw new Error('Space not found');
      }

      return space;
    },
    [spaces],
  );

  return getSpace;
}

export function useGetSpace(spaceID: string) {
  const space = useRecoilValue(spaceQuery(spaceID));

  if (space === null) {
    throw new Error('Space not found');
  }

  return space;
}

export function useGetSpaceCollections(spaceID: string): Collection[] {
  const collections = useRecoilValue(spaceCollectionsQuery(spaceID));

  return collections;
}

export function useCreateSpace() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setSpaces = useSetRecoilState(spacesByIDState);
  const createCollection = useCreateCollection();

  const createSpace = useCallback(() => {
    const newSpace: Space = {
      id: generateID(),
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

  return createSpace;
}

export function useDeleteSpace() {
  const emitEvent = useEmitEvent();
  const setSpaces = useSetRecoilState(spacesByIDState);

  const deleteSpace = useCallback(
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

  return deleteSpace;
}

export interface UpdateSpaceNameInput {
  spaceID: string;
  name: string;
}

export function useUpdateSpaceName() {
  const emitEvent = useEmitEvent();
  const getSpace = useGetSpaceCallback();
  const setSpaces = useSetRecoilState(spacesByIDState);

  const updateSpaceName = useCallback(
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

  return updateSpaceName;
}

export function useGetCollections() {
  return useRecoilValue(collectionsByIDState);
}

export function useGetCollectionCallback() {
  const collections = useGetCollections();

  const getCollection = useCallback(
    (collectionID: string) => {
      const collection = collections[collectionID];

      if (collection === undefined) {
        throw new Error('Collection not found');
      }

      return collection;
    },
    [collections],
  );

  return getCollection;
}

export function useGetCollection(collectionID: string) {
  const collection = useRecoilValue(collectionQuery(collectionID));

  if (collection === null) {
    throw new Error('Collection not found');
  }

  return collection;
}

export function useGetCollectionFields(collectionID: string) {
  const fields = useRecoilValue(collectionFieldsQuery(collectionID));

  return fields;
}

export function useGetCollectionRecords(collectionID: string) {
  const records = useRecoilValue(collectionRecordsQuery(collectionID));

  return records;
}

export function useGetCollectionFieldsByID(collectionID: string) {
  const fieldsByID = useRecoilValue(collectionFieldsByIDQuery(collectionID));

  return fieldsByID;
}

export function useGetCollectionViews(collectionID: string) {
  const views = useRecoilValue(collectionViewsQuery(collectionID));

  return views;
}

export function useCreateCollection() {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsByIDState);
  const createView = useCreateView();

  const createCollection = useCallback(
    (spaceID: string) => {
      let newCollection: Collection = {
        id: generateID(),
        name: '',
        // TODO: create field
        mainFieldID: '',
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

  return createCollection;
}

export function useDeleteCollection() {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsByIDState);

  const deleteCollection = useCallback(
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

  return deleteCollection;
}

export interface UpdateCollectionNameInput {
  collectionID: string;
  name: string;
}

export function useUpdateCollectionName() {
  const emitEvent = useEmitEvent();
  const getCollection = useGetCollectionCallback();
  const setCollections = useSetRecoilState(collectionsByIDState);

  const updateCollectionName = useCallback(
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

  return updateCollectionName;
}

export function useGetViewCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: ViewID) => {
      const view = await snapshot.getPromise(viewQuery(viewID));

      return view;
    },
    [],
  );
}

export function useGetGroupCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (groupID: GroupID) => {
      const group = await snapshot.getPromise(groupQuery(groupID));

      return group;
    },
    [],
  );
}

export function useGetView(viewID: string) {
  const view = useRecoilValue(viewQuery(viewID));

  if (view === null) {
    throw new Error('View not found');
  }

  return view;
}

export function useGetViewRecords(viewID: string) {
  const records = useRecoilValue(viewRecordsQuery(viewID));

  return records;
}

export function useGetFiltersByID() {
  const filtersByID = useRecoilValue(filtersByIDState);

  return filtersByID;
}

export function useGetFilterCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (filterID: FilterID) => {
      const filter = await snapshot.getPromise(filterQuery(filterID));

      return filter;
    },
    [],
  );
}

export function useGetSortCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (sortID: SortID) => {
      const sort = await snapshot.getPromise(sortQuery(sortID));

      return sort;
    },
    [],
  );
}

export function useGetViewFiltersGroups(viewID: string) {
  const filterGroups = useRecoilValue(viewFilterGroupsQuery(viewID));

  return filterGroups;
}

export function useGetViewFilters(viewID: string) {
  const filters = useRecoilValue(viewFiltersQuery(viewID));

  return filters;
}

export function useGetViewSorts(viewID: string) {
  const sorts = useRecoilValue(viewSortsQuery(viewID));

  return sorts;
}

export function useGetViewGroups(viewID: string) {
  const groups = useRecoilValue(viewGroupsQuery(viewID));

  return groups;
}

export function useGetViewFiltersCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: string) => {
      const filters = await snapshot.getPromise(viewFiltersQuery(viewID));

      return filters;
    },
    [],
  );
}

export function useGetViewSortsCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: string) => {
      const sorts = await snapshot.getPromise(viewSortsQuery(viewID));

      return sorts;
    },
    [],
  );
}

export function useGetViewGroupsCallback() {
  return useRecoilCallback(
    ({ snapshot }) => async (viewID: string) => {
      const groups = await snapshot.getPromise(viewGroupsQuery(viewID));

      return groups;
    },
    [],
  );
}

export function useGetFiltersGroupMax(viewID: string) {
  const groupMax = useRecoilValue(viewFiltersGroupMaxQuery(viewID));

  return groupMax;
}

export function useGetSortsSequenceMax(viewID: string) {
  const sequenceMax = useRecoilValue(viewSortsSequenceMaxQuery(viewID));

  return sequenceMax;
}

export function useGetGroupsSequenceMax(viewID: string) {
  const sequenceMax = useRecoilValue(viewGroupsSequenceMaxQuery(viewID));

  return sequenceMax;
}

export function useCreateFilter() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);

  const createFilter = useCallback(
    (viewID: string, group: number, filterConfig: FilterConfig) => {
      let newFilter: Filter = {
        id: generateID(),
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

  return createFilter;
}

export function useUpdateFilterConfig() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);
  const getFilter = useGetFilterCallback();

  const updateFilterConfig = useCallback(
    async (filterID: string, group: number, filterConfig: FilterConfig) => {
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

  return updateFilterConfig;
}

export function useUpdateFilterGroup() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState(filtersByIDState);
  const getViewFilters = useGetViewFiltersCallback();
  const getFilter = useGetFilterCallback();

  const callback = useCallback(
    async (filterID: string, value: 'and' | 'or') => {
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

  return callback;
}

export function useDeleteFilter() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState<FiltersByIDState>(filtersByIDState);
  const getViewFilter = useGetViewFiltersCallback();

  const callback = useCallback(
    async (filter: Filter) => {
      const prevFilters = await getViewFilter(filter.viewID);
      const nextFilters = deleteFilter(filter, prevFilters);

      setFilters((prevFilters) => {
        const clonedPreviousFilters: FiltersByIDState = {
          ...prevFilters,
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

  return callback;
}

export function useCreateSort() {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState(sortsByIDState);

  const callback = useCallback(
    (viewID: string, sequence: number, sortConfig: SortConfig) => {
      let newSort: Sort = {
        id: generateID(),
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

  return callback;
}

export function useUpdateSortConfig() {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState(sortsByIDState);
  const getSort = useGetSortCallback();

  const callback = useCallback(
    async (sortID: string, sortConfig: SortConfig) => {
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

  return callback;
}

export function useDeleteSort() {
  const emitEvent = useEmitEvent();
  const setSorts = useSetRecoilState<SortsByIDState>(sortsByIDState);
  const getViewSorts = useGetViewSortsCallback();

  const callback = useCallback(
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

  return callback;
}

export function useCreateGroup() {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);

  const callback = useCallback(
    (viewID: string, sequence: number, groupConfig: GroupConfig) => {
      let newGroup: Group = {
        id: generateID(),
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

  return callback;
}

export function useUpdateGroupConfig() {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState(groupsByIDState);
  const getGroup = useGetGroupCallback();

  const callback = useCallback(
    async (groupID: string, groupConfig: GroupConfig) => {
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

  return callback;
}

export function useDeleteGroup() {
  const emitEvent = useEmitEvent();
  const setGroups = useSetRecoilState<GroupsByIDState>(groupsByIDState);
  const getViewGroups = useGetViewGroupsCallback();

  const callback = useCallback(
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

  return callback;
}

export function useGetSortedFieldsWithListViewConfig(
  viewID: string,
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

  const callback = useCallback(
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

  return callback;
}

export function useCreateView() {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  const callback = useCallback(
    (collectionID: string) => {
      let newView: View = {
        id: generateID(),
        name: '',
        type: 'list',
        frozenFieldCount: 1,
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

  return callback;
}

export function useDeleteView() {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState(viewsByIDState);

  const deleteView = useCallback(
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

  return deleteView;
}

export interface UpdateViewNameInput {
  viewID: string;
  name: string;
}

export function useUpdateViewName() {
  const emitEvent = useEmitEvent();
  const getView = useGetViewCallback();
  const setViews = useSetRecoilState(viewsByIDState);

  const callback = useCallback(
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

  return callback;
}

export function useGetFieldCallback() {
  const fields = useRecoilValue(fieldsByIDState);

  const getField = useCallback(
    (fieldID: string) => {
      const field = fields[fieldID];

      if (field === undefined) {
        throw new Error('Field not found');
      }

      return field;
    },
    [fields],
  );

  return getField;
}

export function useGetField(fieldID: string) {
  const field = useRecoilValue(fieldQuery(fieldID));

  if (field === null) {
    throw new Error('Field not found');
  }

  return field;
}

export function useCreateField() {
  const emitEvent = useEmitEvent();
  const setFields = useSetRecoilState(fieldsByIDState);

  const createField = useCallback(
    (
      collectionID: string,
      name: string,
      description: string,
      fieldConfig: FieldConfig,
    ) => {
      let newField: Field = {
        id: generateID(),
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

  return createField;
}

export function useDeleteField() {
  const emitEvent = useEmitEvent();
  const setFields = useSetRecoilState(fieldsByIDState);

  const deleteField = useCallback(
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

  return deleteField;
}

export interface UpdateFieldNameInput {
  fieldID: string;
  name: string;
}

export function useUpdateFieldName() {
  const emitEvent = useEmitEvent();
  const getField = useGetFieldCallback();
  const setFields = useSetRecoilState(fieldsByIDState);

  const updateFieldName = useCallback(
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

  return updateFieldName;
}

export function useGetRecordCallback() {
  const records = useRecoilValue(recordsByIDState);

  const getRecord = useCallback(
    (recordID: string) => {
      const record = records[recordID];

      if (record === undefined) {
        throw new Error('Record not found');
      }

      return record;
    },
    [records],
  );

  return getRecord;
}

export function useGetRecord(recordID: string) {
  const record = useRecoilValue(recordQuery(recordID));

  if (record === null) {
    throw new Error('Record not found');
  }

  return record;
}

export function useCreateRecord() {
  const emitEvent = useEmitEvent();
  const setRecords = useSetRecoilState(recordsByIDState);

  const createRecord = useCallback(
    (collectionID: string) => {
      let newRecord: Record = {
        id: generateID(),
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

  return createRecord;
}

export function useDeleteRecord() {
  const emitEvent = useEmitEvent();
  const setRecords = useSetRecoilState(recordsByIDState);

  const deleteRecord = useCallback(
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

  return deleteRecord;
}

export interface UpdateRecordNameInput {
  recordID: string;
}

export function useUpdateRecordName() {
  const emitEvent = useEmitEvent();
  const getRecord = useGetRecordCallback();
  const setRecords = useSetRecoilState(recordsByIDState);

  const updateRecordName = useCallback(
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

  return updateRecordName;
}
