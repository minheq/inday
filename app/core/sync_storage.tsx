import React from 'react';
import { useEventEmitter } from '../data/events';
import {
  Event,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteUpdatedEvent,
} from '../data/types';
import AsyncStorage from '@react-native-community/async-storage';
import { StorageKeyPrefix } from '../data/constants';

export function SyncStorage() {
  const eventEmitter = useEventEmitter();

  const handleNoteCreated = React.useCallback(
    async (event: NoteCreatedEvent) => {
      const { note, workspace } = event;

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Note}:${note.id}`,
        JSON.stringify(note),
      );

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Workspace}:${workspace.id}`,
        JSON.stringify(workspace),
      );
    },
    [],
  );

  const handleNoteDeleted = React.useCallback(
    async (event: NoteDeletedEvent) => {
      const { note, workspace } = event;

      await AsyncStorage.removeItem(`${StorageKeyPrefix.Note}:${note.id}`);

      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Workspace}:${workspace.id}`,
        JSON.stringify(workspace),
      );
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

  const handleEvent = React.useCallback(
    (event: Event) => {
      switch (event.name) {
        case 'NoteCreated':
          return handleNoteCreated(event);
        case 'NoteDeleted':
          return handleNoteDeleted(event);
        case 'NoteUpdated':
          return handleNoteUpdated(event);
        default:
          break;
      }
    },
    [handleNoteCreated, handleNoteDeleted, handleNoteUpdated],
  );

  React.useEffect(() => {
    eventEmitter.subscribe(handleEvent);

    return () => {
      eventEmitter.unsubscribe(handleEvent);
    };
  }, [eventEmitter, handleEvent]);

  return null;
}
