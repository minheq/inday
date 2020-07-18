import React from 'react';

import {
  useEventEmitter,
  Event,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteContentUpdatedEvent,
  ListCreatedEvent,
  ListDeletedEvent,
  ListNameUpdatedEvent,
  ListGroupCreatedEvent,
  ListGroupDeletedEvent,
  ListGroupNameUpdatedEvent,
} from '../data/events';
import {
  useGetWorkspace,
  useGetListCallback,
  useGetListGroupCallback,
  useGetMenu,
} from '../data/api';
import { useStorage } from '../data/storage';

export function SyncStorage() {
  const eventEmitter = useEventEmitter();
  const storage = useStorage();
  const workspace = useGetWorkspace();
  const getList = useGetListCallback();
  const getListGroup = useGetListGroupCallback();
  const menu = useGetMenu();

  const handleWorkspaceCreated = React.useCallback(async () => {
    await storage.saveWorkspaceID(workspace);
    await storage.saveWorkspace(workspace);
  }, [storage, workspace]);

  const handleNoteCreated = React.useCallback(
    async (event: NoteCreatedEvent) => {
      const { note } = event;

      await storage.saveNote(note);

      // Note added to workspace `allNoteIDs` and/or `inboxNoteIDs` field
      await storage.saveWorkspace(workspace);

      // Note added to list's `noteIDs` field
      if (note.listID !== null) {
        const list = getList(note.listID);
        await storage.saveList(list);
      }
    },
    [storage, getList, workspace],
  );

  const handleNoteDeleted = React.useCallback(
    async (event: NoteDeletedEvent) => {
      const { note } = event;

      await storage.removeNote(note);

      // Remove occurrences in workspace `allNoteIDs` and/or `inboxNoteIDs` field
      await storage.saveWorkspace(workspace);

      // Remove occurrences in list's `noteIDs` field
      if (note.listID !== null) {
        const list = getList(note.listID);
        await storage.saveList(list);
      }
    },
    [storage, workspace, getList],
  );

  const handleNoteContentUpdated = React.useCallback(
    async (event: NoteContentUpdatedEvent) => {
      const { note } = event;

      await storage.saveNote(note);
    },
    [storage],
  );

  const handleListCreated = React.useCallback(
    async (event: ListCreatedEvent) => {
      const { list } = event;

      await storage.saveList(list);

      if (list.listGroupID !== null) {
        const listGroup = getListGroup(list.listGroupID);
        await storage.saveListGroup(listGroup);
      } else {
        // List added to workspace `listOrListGroupIDs` field
        await storage.saveWorkspace(workspace);
      }
    },
    [storage, workspace, getListGroup],
  );

  const handleListDeleted = React.useCallback(
    async (event: ListDeletedEvent) => {
      const { list } = event;

      await storage.removeList(list);

      if (list.listGroupID !== null) {
        const listGroup = getListGroup(list.listGroupID);
        await storage.saveListGroup(listGroup);
      } else {
        // List added to workspace `listOrListGroupIDs` field
        await storage.saveWorkspace(workspace);
      }
    },
    [storage, getListGroup, workspace],
  );

  const handleListNameUpdated = React.useCallback(
    async (event: ListNameUpdatedEvent) => {
      const { list } = event;

      await storage.saveList(list);
    },
    [storage],
  );

  const handleListGroupCreated = React.useCallback(
    async (event: ListGroupCreatedEvent) => {
      const { listGroup } = event;

      await storage.saveListGroup(listGroup);

      // ListGroup added to workspace `listOrListGroupIDs` field
      await storage.saveWorkspace(workspace);
    },
    [storage, workspace],
  );

  const handleListGroupDeleted = React.useCallback(
    async (event: ListGroupDeletedEvent) => {
      const { listGroup } = event;

      await storage.removeListGroup(listGroup);

      // ListGroup removed from workspace `listOrListGroupIDs` field
      await storage.saveWorkspace(workspace);
    },
    [storage, workspace],
  );

  const handleListGroupNameUpdated = React.useCallback(
    async (event: ListGroupNameUpdatedEvent) => {
      const { listGroup } = event;

      await storage.saveListGroup(listGroup);
    },
    [storage],
  );

  const handleListGroupExpanded = React.useCallback(async () => {
    await storage.saveMenuState(menu);
  }, [storage, menu]);

  const handleEvent = React.useCallback(
    (event: Event) => {
      switch (event.name) {
        case 'WorkspaceCreated':
          return handleWorkspaceCreated();
        case 'NoteCreated':
          return handleNoteCreated(event);
        case 'NoteDeleted':
          return handleNoteDeleted(event);
        case 'NoteContentUpdatedEvent':
          return handleNoteContentUpdated(event);
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
        case 'ListGroupExpanded':
          return handleListGroupExpanded();
        default:
          throw new Error(`Unhandled event ${event}`);
      }
    },
    [
      handleWorkspaceCreated,
      handleNoteCreated,
      handleNoteDeleted,
      handleNoteContentUpdated,
      handleListCreated,
      handleListDeleted,
      handleListNameUpdated,
      handleListGroupCreated,
      handleListGroupDeleted,
      handleListGroupNameUpdated,
      handleListGroupExpanded,
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
