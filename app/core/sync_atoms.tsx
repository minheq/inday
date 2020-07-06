import React from 'react';
import { useEventEmitter } from '../data/events';
import {
  Event,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteUpdatedEvent,
} from '../data/events';
import { useSetRecoilState } from 'recoil';
import { notesByIDState } from '../data/notes';
import { workspaceState } from '../data/workspace';

export function SyncAtoms() {
  const eventEmitter = useEventEmitter();
  const setNotesByID = useSetRecoilState(notesByIDState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const handleNoteCreated = React.useCallback(
    (event: NoteCreatedEvent) => {
      const { note, workspace } = event;

      setNotesByID((previousNotesByID) => ({
        ...previousNotesByID,
        [note.id]: note,
      }));

      setWorkspace(workspace);
    },
    [setNotesByID, setWorkspace],
  );

  const handleNoteDeleted = React.useCallback(
    (event: NoteDeletedEvent) => {
      const { note, workspace } = event;

      setWorkspace(workspace);

      setNotesByID((previousNotesByID) => {
        const nextNotesByID = { ...previousNotesByID };

        delete nextNotesByID[note.id];

        return nextNotesByID;
      });
    },
    [setNotesByID, setWorkspace],
  );

  const handleNoteUpdated = React.useCallback(
    (event: NoteUpdatedEvent) => {
      const { nextNote } = event;

      setNotesByID((previousNotesByID) => ({
        ...previousNotesByID,
        [nextNote.id]: nextNote,
      }));
    },
    [setNotesByID],
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
