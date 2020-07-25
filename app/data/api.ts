import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { v4 } from 'uuid';
import {
  useEventEmitter,
  eventsState,
  Event,
  EventWithMetadata,
  EventMetadata,
} from './events';
import {
  Collection,
  collectionQuery,
  collectionListQuery,
  collectionsState,
} from './collections';
import { workspaceState } from './workspace';
import { spacesState, Space, spaceQuery } from './spaces';

export function useGetCollections() {
  return useRecoilValue(collectionListQuery);
}

export function useGetSpaces() {
  return useRecoilValue(spacesState);
}

export function useGetCollection(collectionID: string) {
  const collection = useRecoilValue(collectionQuery(collectionID));

  if (collection === null) {
    throw new Error('Collection not found');
  }

  return collection;
}

export function useGetSpace(spaceID: string) {
  const space = useRecoilValue(spaceQuery(spaceID));

  if (space === null) {
    throw new Error('Space not found');
  }

  return space;
}

export function useGetCollectionCallback() {
  const collections = useRecoilValue(collectionsState);

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
    (event: Event) => {
      const metadata: EventMetadata = {
        createdAt: new Date(),
        typename: 'Event',
        workspaceID: workspace.id,
      };

      const eventWithMetadata: EventWithMetadata = {
        ...event,
        ...metadata,
      };

      setEvents((prevEvents) => [...prevEvents, eventWithMetadata]);
      eventEmitter.emit(eventWithMetadata);
    },
    [workspace, setEvents, eventEmitter],
  );

  return emitEvent;
}

export function useCreateCollection() {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsState);

  const createCollection = React.useCallback(
    (spaceID: string) => {
      let newCollection: Collection = {
        id: v4(),
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        spaceID,
        typename: 'Collection',
      };

      setCollections((previousCollections) => ({
        ...previousCollections,
        [newCollection.id]: newCollection,
      }));

      emitEvent({
        name: 'CollectionCreated',
        collection: newCollection,
      });

      return newCollection;
    },
    [emitEvent, setCollections],
  );

  return createCollection;
}

export function useDeleteCollection() {
  const emitEvent = useEmitEvent();
  const setCollections = useSetRecoilState(collectionsState);

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
  const setCollections = useSetRecoilState(collectionsState);

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

export function useCreateSpace() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setSpaces = useSetRecoilState(spacesState);

  const createSpace = React.useCallback(() => {
    const newSpace: Space = {
      id: v4(),
      name: '',
      workspaceID: workspace.id,
      typename: 'Space',
    };

    setSpaces((previousSpaces) => ({
      ...previousSpaces,
      [newSpace.id]: newSpace,
    }));

    emitEvent({
      name: 'SpaceCreated',
      space: newSpace,
    });

    return newSpace;
  }, [emitEvent, workspace, setSpaces]);

  return createSpace;
}

export function useDeleteSpace() {
  const emitEvent = useEmitEvent();
  const setSpaces = useSetRecoilState(spacesState);

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
  const setSpaces = useSetRecoilState(spacesState);

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
