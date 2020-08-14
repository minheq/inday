import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil';

import { useEventEmitter, eventsState, EventConfig, Event } from './events';
import { Collection } from './collections';

import { Space } from './spaces';
import { View } from './views';
import { Field, FieldConfig } from './fields';
import { Document } from './documents';
import { generateID } from '../../lib/id/id';
import { Filter, FilterConfig, updateFilterGroup } from './filters';
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
  documentsByIDState,
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
} from './queries';

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

      logger.info('Emit event', event);

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

      const updatedSpace: Space = {
        ...prevSpace,
        name,
      };

      setSpaces((previousSpaces) => ({
        ...previousSpaces,
        [updatedSpace.id]: updatedSpace,
      }));

      emitEvent({
        name: 'SpaceNameUpdated',
        space: updatedSpace,
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

export function useGetCollectionDocuments(collectionID: string) {
  const documents = useRecoilValue(collectionDocumentsQuery(collectionID));

  return documents;
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

      const updatedCollection: Collection = {
        ...prevCollection,
        name,
      };

      setCollections((previousCollections) => ({
        ...previousCollections,
        [updatedCollection.id]: updatedCollection,
      }));

      emitEvent({
        name: 'CollectionNameUpdated',
        collection: updatedCollection,
      });
    },
    [getCollection, setCollections, emitEvent],
  );

  return updateCollectionName;
}

export function useGetViewCallback() {
  const views = useRecoilValue(viewsByIDState);

  const getView = useCallback(
    (viewID: string) => {
      const view = views[viewID];

      if (view === undefined) {
        throw new Error('View not found');
      }

      return view;
    },
    [views],
  );

  return getView;
}

export function useGetView(viewID: string) {
  const view = useRecoilValue(viewQuery(viewID));

  if (view === null) {
    throw new Error('View not found');
  }

  return view;
}

export function useGetViewDocuments(viewID: string) {
  const documents = useRecoilValue(viewDocumentsQuery(viewID));

  return documents;
}

export function useGetFiltersByID() {
  const filtersByID = useRecoilValue(filtersByIDState);

  return filtersByID;
}

export function useGetFilterCallback() {
  const filtersByID = useGetFiltersByID();

  const getFilter = useCallback(
    (filterID: string) => {
      const filter = filtersByID[filterID];

      if (filter === undefined) {
        throw new Error('Filter not found');
      }

      return filter;
    },
    [filtersByID],
  );

  return getFilter;
}

export function useGetViewFiltersGroups(viewID: string) {
  const filterGroups = useRecoilValue(viewFilterGroupsQuery(viewID));

  return filterGroups;
}

export function useGetViewFilters(viewID: string) {
  const filters = useRecoilValue(viewFiltersQuery(viewID));

  return filters;
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

export function useGetFiltersGroupMax(viewID: string) {
  const groupMax = useRecoilValue(viewFiltersGroupMaxQuery(viewID));

  return groupMax;
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

      setFilters((previousFilters) => ({
        ...previousFilters,
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
    (filterID: string, group: number, filterConfig: FilterConfig) => {
      const prevFilter = getFilter(filterID);

      const updatedFilter: Filter = {
        ...prevFilter,
        ...filterConfig,
        group,
      };
      setFilters((previousFilters) => ({
        ...previousFilters,
        [updatedFilter.id]: updatedFilter,
      }));

      emitEvent({
        name: 'FilterConfigUpdated',
        filter: updatedFilter,
      });

      return updatedFilter;
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
      const prevFilter = getFilter(filterID);
      const filters = await getViewFilters(prevFilter.viewID);

      const updatedFilters = updateFilterGroup(prevFilter, value, filters);

      setFilters((previousFilters) => ({
        ...previousFilters,
        ...updatedFilters,
      }));

      emitEvent({
        name: 'FilterGroupUpdated',
        filters: Object.values(updatedFilters),
      });

      return updatedFilters[filterID];
    },
    [emitEvent, setFilters, getFilter, getViewFilters],
  );

  return callback;
}

export function useDeleteFilter() {
  const emitEvent = useEmitEvent();
  const setFilters = useSetRecoilState<FiltersByIDState>(filtersByIDState);

  const deleteFilter = useCallback(
    (filter: Filter) => {
      setFilters((previousFilters) => {
        const updatedFilters = { ...previousFilters };

        delete updatedFilters[filter.id];

        return updatedFilters;
      });

      emitEvent({
        name: 'FilterDeleted',
        filter,
      });
    },
    [emitEvent, setFilters],
  );

  return deleteFilter;
}

export function useCreateView() {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState<ViewsByIDState>(viewsByIDState);

  const createView = useCallback(
    (collectionID: string) => {
      let newView: View = {
        id: generateID(),
        name: '',
        type: 'list',
        fieldsConfig: {},
        fieldsOrder: [],
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

  return createView;
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

  const updateViewName = useCallback(
    (input: UpdateViewNameInput) => {
      const { viewID, name } = input;
      const prevView = getView(viewID);

      const updatedView: View = {
        ...prevView,
        name,
      };

      setViews((previousViews) => ({
        ...previousViews,
        [updatedView.id]: updatedView,
      }));

      emitEvent({
        name: 'ViewNameUpdated',
        view: updatedView,
      });
    },
    [getView, setViews, emitEvent],
  );

  return updateViewName;
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

      const updatedField: Field = {
        ...prevField,
        name,
      };

      setFields((previousFields) => ({
        ...previousFields,
        [updatedField.id]: updatedField,
      }));

      emitEvent({
        name: 'FieldNameUpdated',
        field: updatedField,
      });
    },
    [getField, setFields, emitEvent],
  );

  return updateFieldName;
}

export function useGetDocumentCallback() {
  const documents = useRecoilValue(documentsByIDState);

  const getDocument = useCallback(
    (documentID: string) => {
      const document = documents[documentID];

      if (document === undefined) {
        throw new Error('Document not found');
      }

      return document;
    },
    [documents],
  );

  return getDocument;
}

export function useGetDocument(documentID: string) {
  const document = useRecoilValue(documentQuery(documentID));

  if (document === null) {
    throw new Error('Document not found');
  }

  return document;
}

export function useCreateDocument() {
  const emitEvent = useEmitEvent();
  const setDocuments = useSetRecoilState(documentsByIDState);

  const createDocument = useCallback(
    (collectionID: string) => {
      let newDocument: Document = {
        id: generateID(),
        fields: {},
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
    [emitEvent, setDocuments],
  );

  return createDocument;
}

export function useDeleteDocument() {
  const emitEvent = useEmitEvent();
  const setDocuments = useSetRecoilState(documentsByIDState);

  const deleteDocument = useCallback(
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

  return deleteDocument;
}

export interface UpdateDocumentNameInput {
  documentID: string;
}

export function useUpdateDocumentName() {
  const emitEvent = useEmitEvent();
  const getDocument = useGetDocumentCallback();
  const setDocuments = useSetRecoilState(documentsByIDState);

  const updateDocumentName = useCallback(
    (input: UpdateDocumentNameInput) => {
      const { documentID } = input;
      const prevDocument = getDocument(documentID);

      const updatedDocument: Document = {
        ...prevDocument,
      };

      setDocuments((previousDocuments) => ({
        ...previousDocuments,
        [updatedDocument.id]: updatedDocument,
      }));

      emitEvent({
        name: 'DocumentNameUpdated',
        document: updatedDocument,
      });
    },
    [getDocument, setDocuments, emitEvent],
  );

  return updateDocumentName;
}
