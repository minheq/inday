import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useEventEmitter, eventsState, EventConfig, Event } from './events';
import {
  Collection,
  collectionQuery,
  collectionsByIDState,
  collectionFieldsQuery,
  collectionDocumentsQuery,
  collectionViewsQuery,
  collectionFieldsByIDQuery,
} from './collections';
import { workspaceState } from './workspace';
import {
  spacesByIDState,
  Space,
  spaceQuery,
  spaceCollectionsQuery,
} from './spaces';
import { viewsByIDState, View, viewQuery } from './views';
import { Field, fieldsByIDState, fieldQuery, FieldConfig } from './fields';
import { documentsByIDState, documentQuery, Document } from './documents';
import { generateID } from '../../lib/id/id';

export function useGetWorkspace() {
  const workspace = useRecoilValue(workspaceState);

  if (workspace === null) {
    throw new Error('Workspace not found');
  }

  return workspace;
}

export function useEmitEvent() {
  const eventEmitter = useEventEmitter();
  const workspace = useGetWorkspace();
  const setEvents = useSetRecoilState(eventsState);

  const emitEvent = React.useCallback(
    (eventConfig: EventConfig) => {
      const event: Event = {
        ...eventConfig,
        createdAt: new Date(),
        workspaceID: workspace.id,
      };

      setEvents((prevEvents) => [...prevEvents, event]);
      eventEmitter.emit(event);
    },
    [workspace, setEvents, eventEmitter],
  );

  return emitEvent;
}

export function useGetSpaces() {
  return useRecoilValue(spacesByIDState);
}

export function useGetSpaceCallback() {
  const spaces = useGetSpaces();

  const getSpace = React.useCallback(
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

  const createSpace = React.useCallback(() => {
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

  const deleteSpace = React.useCallback(
    (space: Space) => {
      setSpaces((previousSpaces) => {
        const nextSpaces = { ...previousSpaces };

        delete nextSpaces[space.id];

        return nextSpaces;
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

  const updateSpaceName = React.useCallback(
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
        space: nextSpace,
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

  const getCollection = React.useCallback(
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

  const createCollection = React.useCallback(
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

  const deleteCollection = React.useCallback(
    (collection: Collection) => {
      setCollections((previousCollections) => {
        const nextCollections = { ...previousCollections };

        delete nextCollections[collection.id];

        return nextCollections;
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

  const updateCollectionName = React.useCallback(
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
        collection: nextCollection,
      });
    },
    [getCollection, setCollections, emitEvent],
  );

  return updateCollectionName;
}

export function useGetViewCallback() {
  const views = useRecoilValue(viewsByIDState);

  const getView = React.useCallback(
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

export function useCreateView() {
  const emitEvent = useEmitEvent();
  const setViews = useSetRecoilState(viewsByIDState);

  const createView = React.useCallback(
    (collectionID: string) => {
      let newView: View = {
        id: generateID(),
        name: '',
        type: 'list',
        filters: [],
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

  const deleteView = React.useCallback(
    (view: View) => {
      setViews((previousViews) => {
        const nextViews = { ...previousViews };

        delete nextViews[view.id];

        return nextViews;
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

  const updateViewName = React.useCallback(
    (input: UpdateViewNameInput) => {
      const { viewID, name } = input;
      const prevView = getView(viewID);

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
        view: nextView,
      });
    },
    [getView, setViews, emitEvent],
  );

  return updateViewName;
}

export function useGetFieldCallback() {
  const fields = useRecoilValue(fieldsByIDState);

  const getField = React.useCallback(
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

  const createField = React.useCallback(
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

  const deleteField = React.useCallback(
    (field: Field) => {
      setFields((previousFields) => {
        const nextFields = { ...previousFields };

        delete nextFields[field.id];

        return nextFields;
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

  const updateFieldName = React.useCallback(
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
        field: nextField,
      });
    },
    [getField, setFields, emitEvent],
  );

  return updateFieldName;
}

export function useGetDocumentCallback() {
  const documents = useRecoilValue(documentsByIDState);

  const getDocument = React.useCallback(
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

  const createDocument = React.useCallback(
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

  const deleteDocument = React.useCallback(
    (document: Document) => {
      setDocuments((previousDocuments) => {
        const nextDocuments = { ...previousDocuments };

        delete nextDocuments[document.id];

        return nextDocuments;
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

  const updateDocumentName = React.useCallback(
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
        document: nextDocument,
      });
    },
    [getDocument, setDocuments, emitEvent],
  );

  return updateDocumentName;
}
