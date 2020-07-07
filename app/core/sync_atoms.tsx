import React from 'react';
import {
  useEventEmitter,
  ListCreatedEvent,
  ListNameUpdatedEvent,
  ListDeletedEvent,
  ListGroupNameUpdatedEvent,
  ListGroupDeletedEvent,
  ListGroupCreatedEvent,
  WorkspaceUpdatedEvent,
} from '../data/events';
import {
  Event,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteUpdatedEvent,
} from '../data/events';
import { useSetRecoilState } from 'recoil';
import { notesState } from '../data/notes';
import { workspaceState } from '../data/workspace';
import { listsState } from '../data/list';
import { listGroupsState } from '../data/list_group';

export function SyncAtoms() {
  const eventEmitter = useEventEmitter();
  const setNotes = useSetRecoilState(notesState);
  const setLists = useSetRecoilState(listsState);
  const setListGroups = useSetRecoilState(listGroupsState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const handleWorkspaceUpdated = React.useCallback(
    (event: WorkspaceUpdatedEvent) => {
      const { nextWorkspace } = event;

      setWorkspace(nextWorkspace);
    },
    [setWorkspace],
  );

  const handleNoteCreated = React.useCallback(
    (event: NoteCreatedEvent) => {
      const { note } = event;

      setNotes((previousNotes) => ({
        ...previousNotes,
        [note.id]: note,
      }));
    },
    [setNotes],
  );

  const handleNoteDeleted = React.useCallback(
    (event: NoteDeletedEvent) => {
      const { note } = event;

      setNotes((previousNotes) => {
        const nextNotes = { ...previousNotes };

        delete nextNotes[note.id];

        return nextNotes;
      });
    },
    [setNotes],
  );

  const handleNoteUpdated = React.useCallback(
    (event: NoteUpdatedEvent) => {
      const { nextNote } = event;

      setNotes((previousNotes) => ({
        ...previousNotes,
        [nextNote.id]: nextNote,
      }));
    },
    [setNotes],
  );

  const handleListCreated = React.useCallback(
    (event: ListCreatedEvent) => {
      const { list } = event;

      setLists((previousLists) => ({
        ...previousLists,
        [list.id]: list,
      }));
    },
    [setLists],
  );

  const handleListDeleted = React.useCallback(
    (event: ListDeletedEvent) => {
      const { list } = event;

      setLists((previousLists) => {
        const nextLists = { ...previousLists };

        delete nextLists[list.id];

        return nextLists;
      });
    },
    [setLists],
  );

  const handleListNameUpdated = React.useCallback(
    (event: ListNameUpdatedEvent) => {
      const { nextList } = event;

      setLists((previousLists) => ({
        ...previousLists,
        [nextList.id]: nextList,
      }));
    },
    [setLists],
  );

  const handleListGroupCreated = React.useCallback(
    (event: ListGroupCreatedEvent) => {
      const { listGroup } = event;

      setListGroups((previousListGroups) => ({
        ...previousListGroups,
        [listGroup.id]: listGroup,
      }));
    },
    [setListGroups],
  );

  const handleListGroupDeleted = React.useCallback(
    (event: ListGroupDeletedEvent) => {
      const { listGroup } = event;

      setListGroups((previousListGroupsByID) => {
        const nextListGroups = { ...previousListGroupsByID };

        delete nextListGroups[listGroup.id];

        return nextListGroups;
      });
    },
    [setListGroups],
  );

  const handleListGroupNameUpdated = React.useCallback(
    (event: ListGroupNameUpdatedEvent) => {
      const { nextListGroup } = event;

      setListGroups((previousListGroupsByID) => ({
        ...previousListGroupsByID,
        [nextListGroup.id]: nextListGroup,
      }));
    },
    [setListGroups],
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
      handleWorkspaceUpdated,
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
