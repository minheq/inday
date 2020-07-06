import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';
import { useEventEmitter, eventsState, Event } from './events';
import {
  allNotesQuery,
  noteQuery,
  notesByIDState,
  Note,
  Content,
  Preview,
} from './notes';
import { workspaceState, Workspace, allListsQuery } from './workspace';

export function useGetAllNotes() {
  return useRecoilValue(allNotesQuery);
}

export function useGetNote(noteID: string) {
  return useRecoilValue(noteQuery(noteID));
}

export function useGetLists() {
  return useRecoilValue(allListsQuery);
}

export function useGetWorkspace() {
  const workspace = useRecoilValue(workspaceState);

  if (workspace === null) {
    throw new Error('Workspace not found');
  }

  return workspace;
}

function useEmitEvent() {
  const eventEmitter = useEventEmitter();
  const setEvents = useSetRecoilState(eventsState);

  const emitEvent = React.useCallback(
    (event: Event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
      eventEmitter.emit(event);
    },
    [setEvents, eventEmitter],
  );

  return emitEvent;
}

export function useCreateNote() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const createNote = React.useCallback(() => {
    const note: Note = {
      id: v4(),
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
      preview: {
        title: '',
        description: '',
        imageURL: '',
      },
      reminder: null,
      task: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      inbox: false,
      listID: null,
      scheduledAt: null,
      workspaceID: workspace.id,
      typename: 'Note',
    };

    const nextWorkspace: Workspace = {
      ...workspace,
      all: [...workspace.all, note.id],
    };

    emitEvent({
      name: 'NoteCreated',
      note,
      workspace: nextWorkspace,
      createdAt: new Date(),
      workspaceID: workspace.id,
      typename: 'Event',
    });

    return note;
  }, [emitEvent, workspace]);

  return createNote;
}

export function useDeleteNote() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const deleteNote = React.useCallback(
    (note: Note) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        all: [...workspace.all, note.id],
      };

      emitEvent({
        name: 'NoteDeleted',
        note,
        workspace: nextWorkspace,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });
    },
    [workspace, emitEvent],
  );

  return deleteNote;
}

export interface UpdateNoteContentInput {
  id: string;
  content: Content;
}

export function useUpdateNoteContent() {
  const notesByID = useRecoilValue(notesByIDState);
  const workspace = useGetWorkspace();
  const emitEvent = useEmitEvent();

  const updateNoteContent = React.useCallback(
    (input: UpdateNoteContentInput) => {
      const { id, content } = input;
      const prevNote = notesByID[id];
      const preview = toPreview(content);
      const nextNote: Note = {
        ...prevNote,
        content,
        preview,
      };

      emitEvent({
        name: 'NoteUpdated',
        prevNote,
        nextNote,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });
    },
    [notesByID, emitEvent],
  );

  return updateNoteContent;
}

function toPreview(content: Content): Preview {
  let title = '';
  const firstNode = content[0];
  const type = firstNode.type as BlockType;

  switch (type) {
    case 'paragraph':
      title = firstNode.children[0].text as string;
      break;

    default:
      title = firstNode.children[0].text as string;
      break;
  }

  return {
    title,
    description: '',
    imageURL: '',
  };
}
