import React from 'react';

import {
  useEventEmitter,
  Event,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteContentUpdatedEvent,
  TagCreatedEvent,
  TagDeletedEvent,
  TagNameUpdatedEvent,
} from '../data/events';
import { useGetWorkspace, useGetMenu } from '../data/api';
import { useStorage } from '../data/storage';

export function SyncStorage() {
  const eventEmitter = useEventEmitter();
  const storage = useStorage();
  const workspace = useGetWorkspace();
  const menu = useGetMenu();

  const handleWorkspaceCreated = React.useCallback(async () => {
    await storage.saveWorkspaceID(workspace);
    await storage.saveWorkspace(workspace);
  }, [storage, workspace]);

  const handleNoteCreated = React.useCallback(
    async (event: NoteCreatedEvent) => {
      const { note } = event;

      await storage.saveNote(note);
    },
    [storage],
  );

  const handleNoteDeleted = React.useCallback(
    async (event: NoteDeletedEvent) => {
      const { note } = event;

      await storage.removeNote(note);
    },
    [storage],
  );

  const handleNoteContentUpdated = React.useCallback(
    async (event: NoteContentUpdatedEvent) => {
      const { note } = event;

      await storage.saveNote(note);
    },
    [storage],
  );

  const handleTagCreated = React.useCallback(
    async (event: TagCreatedEvent) => {
      const { tag } = event;

      await storage.saveTag(tag);
    },
    [storage],
  );

  const handleTagDeleted = React.useCallback(
    async (event: TagDeletedEvent) => {
      const { tag } = event;
      await storage.removeTag(tag);
    },
    [storage],
  );

  const handleTagNameUpdated = React.useCallback(
    async (event: TagNameUpdatedEvent) => {
      const { tag } = event;

      await storage.saveTag(tag);
    },
    [storage],
  );

  const handleTagExpanded = React.useCallback(async () => {
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
        case 'TagCreated':
          return handleTagCreated(event);
        case 'TagDeleted':
          return handleTagDeleted(event);
        case 'TagNameUpdated':
          return handleTagNameUpdated(event);
        case 'TagExpanded':
          return handleTagExpanded();
        default:
          throw new Error(`Unhandled event ${event}`);
      }
    },
    [
      handleWorkspaceCreated,
      handleNoteCreated,
      handleNoteDeleted,
      handleNoteContentUpdated,
      handleTagCreated,
      handleTagDeleted,
      handleTagNameUpdated,
      handleTagExpanded,
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
