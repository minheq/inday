import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  Note,
  Content,
  Preview,
  Event,
  Workspace,
  ListID,
  List,
} from './types';
import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';
import { useEventEmitter, eventsState } from './events';
import { allNotesQuery, noteQuery, notesByIDState } from './notes';
import { workspaceState } from './workspace';

export function useGetAllNotes() {
  return useRecoilValue(allNotesQuery);
}

export function useGetNote(noteID: string) {
  return useRecoilValue(noteQuery(noteID));
}

export function useGetList(listID: ListID): List {
  let name = '';
  switch (listID) {
    case 'all':
      name = 'All';
      break;
    case 'inbox':
      name = 'Inbox';
      break;

    default:
      name = listID;
      break;
  }

  return {
    id: listID,
    name,
  };
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
