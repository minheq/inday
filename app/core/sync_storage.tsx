import React from 'react';
import {
  useEventEmitter,
  ListCreatedEvent,
  ListDeletedEvent,
  ListNameUpdatedEvent,
  ListGroupCreatedEvent,
  ListGroupDeletedEvent,
  ListGroupNameUpdatedEvent,
  WorkspaceUpdatedEvent,
} from '../data/events';
import {
  Event,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteUpdatedEvent,
} from '../data/events';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKeyPrefix } from '../data/constants';

export function SyncStorage() {
  const eventEmitter = useEventEmitter();

  const handleWorkspaceUpdated = React.useCallback(
    async (event: WorkspaceUpdatedEvent) => {
      const { nextWorkspace } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Workspace}:${nextWorkspace.id}`,
        JSON.stringify(nextWorkspace),
      );
    },
    [],
  );

  const handleNoteCreated = React.useCallback(
    async (event: NoteCreatedEvent) => {
      const { note } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Note}:${note.id}`,
        JSON.stringify(note),
      );
    },
    [],
  );

  const handleNoteDeleted = React.useCallback(
    async (event: NoteDeletedEvent) => {
      const { note } = event;

      await AsyncStorage.removeItem(`${StorageKeyPrefix.Note}:${note.id}`);
    },
    [],
  );

  const handleNoteUpdated = React.useCallback(
    async (event: NoteUpdatedEvent) => {
      const { nextNote } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Note}:${nextNote.id}`,
        JSON.stringify(nextNote),
      );
    },
    [],
  );

  const handleListCreated = React.useCallback(
    async (event: ListCreatedEvent) => {
      const { list } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.List}:${list.id}`,
        JSON.stringify(list),
      );
    },
    [],
  );

  const handleListDeleted = React.useCallback(
    async (event: ListDeletedEvent) => {
      const { list } = event;

      await AsyncStorage.removeItem(`${StorageKeyPrefix.List}:${list.id}`);
    },
    [],
  );

  const handleListNameUpdated = React.useCallback(
    async (event: ListNameUpdatedEvent) => {
      const { nextList } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.List}:${nextList.id}`,
        JSON.stringify(nextList),
      );
    },
    [],
  );

  const handleListGroupCreated = React.useCallback(
    async (event: ListGroupCreatedEvent) => {
      const { listGroup } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.ListGroup}:${listGroup.id}`,
        JSON.stringify(listGroup),
      );
    },
    [],
  );

  const handleListGroupDeleted = React.useCallback(
    async (event: ListGroupDeletedEvent) => {
      const { listGroup } = event;

      await AsyncStorage.removeItem(
        `${StorageKeyPrefix.ListGroup}:${listGroup.id}`,
      );
    },
    [],
  );

  const handleListGroupNameUpdated = React.useCallback(
    async (event: ListGroupNameUpdatedEvent) => {
      const { nextListGroup } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.ListGroup}:${nextListGroup.id}`,
        JSON.stringify(nextListGroup),
      );
    },
    [],
  );

  const handleEvent = React.useCallback(
    (event: Event) => {
      switch (event.name) {
        case 'WorkspaceUpdated':
          return handleWorkspaceUpdated(event);
        case 'NoteCreated':
          return handleNoteCreated(event);
        case 'NoteDeleted':
          return handleNoteDeleted(event);
        case 'NoteUpdated':
          return handleNoteUpdated(event);
        case 'ListCreated':
          return handleListCreated(event);
        case 'ListDeleted':
          return handleListDeleted(event);
        case 'ListNameUpdated':
          return handleListNameUpdated(event);
        case 'ListGroupCreated':
          return handleListGroupCreated(event);
        case 'ListGroupDeleted':
          return handleListGroupDeleted(event);
        case 'ListGroupNameUpdated':
          return handleListGroupNameUpdated(event);
        default:
          break;
      }
    },
    [
      handleNoteCreated,
      handleNoteDeleted,
      handleNoteUpdated,
      handleListCreated,
      handleListDeleted,
      handleListNameUpdated,
      handleListGroupCreated,
      handleListGroupDeleted,
      handleListGroupNameUpdated,
    ],
  );

  React.useEffect(() => {
    eventEmitter.subscribe(handleEvent);

    return () => {
      eventEmitter.unsubscribe(handleEvent);
    };
  }, [eventEmitter, handleEvent]);

  return null;
}
