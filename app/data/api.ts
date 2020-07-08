import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';
import { useEventEmitter, eventsState, Event } from './events';
import {
  allNotesQuery,
  noteQuery,
  notesState,
  Note,
  Content,
  Preview,
} from './notes';
import { workspaceState, Workspace, allListsQuery } from './workspace';
import { List, listsState } from './list';
import { ListGroup, listGroupsState, listGroupQuery } from './list_group';

export function useGetAllNotes() {
  return useRecoilValue(allNotesQuery);
}

export function useGetNote(noteID: string) {
  return useRecoilValue(noteQuery(noteID));
}

export function useGetLists() {
  return useRecoilValue(allListsQuery);
}

export function useGetListGroupLists(listGroupID: string) {
  return useRecoilValue(listGroupQuery(listGroupID));
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
      createdAt: new Date(),
      workspaceID: workspace.id,
      typename: 'Event',
    });

    emitEvent({
      name: 'WorkspaceUpdated',
      nextWorkspace: nextWorkspace,
      prevWorkspace: workspace,
      createdAt: new Date(),
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
        all: workspace.all.filter((id) => id !== note.id),
      };

      emitEvent({
        name: 'NoteDeleted',
        note,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });

      emitEvent({
        name: 'WorkspaceUpdated',
        nextWorkspace: nextWorkspace,
        prevWorkspace: workspace,
        createdAt: new Date(),
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
  const notes = useRecoilValue(notesState);
  const workspace = useGetWorkspace();
  const emitEvent = useEmitEvent();

  const updateNoteContent = React.useCallback(
    (input: UpdateNoteContentInput) => {
      const { id, content } = input;
      const prevNote = notes[id];
      if (prevNote === undefined) {
        throw new Error('Note not found');
      }
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
    [notes, emitEvent, workspace],
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

export function useCreateList() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const createList = React.useCallback(() => {
    const list: List = {
      id: v4(),
      name: '',
      workspaceID: workspace.id,
      typename: 'List',
    };

    const nextWorkspace: Workspace = {
      ...workspace,
      lists: [...workspace.lists, { type: 'List', id: list.id }],
    };

    emitEvent({
      name: 'ListCreated',
      list,
      createdAt: new Date(),
      workspaceID: workspace.id,
      typename: 'Event',
    });

    emitEvent({
      name: 'WorkspaceUpdated',
      nextWorkspace: nextWorkspace,
      prevWorkspace: workspace,
      createdAt: new Date(),
      typename: 'Event',
    });

    return list;
  }, [emitEvent, workspace]);

  return createList;
}

export function useDeleteList() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const deleteList = React.useCallback(
    (list: List) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        lists: workspace.lists.filter((l) => l.id !== list.id),
      };

      emitEvent({
        name: 'ListDeleted',
        list,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });

      emitEvent({
        name: 'WorkspaceUpdated',
        nextWorkspace: nextWorkspace,
        prevWorkspace: workspace,
        createdAt: new Date(),
        typename: 'Event',
      });
    },
    [workspace, emitEvent],
  );

  return deleteList;
}

export interface UpdateListNameInput {
  id: string;
  name: string;
}

export function useUpdateListName() {
  const lists = useRecoilValue(listsState);
  const workspace = useGetWorkspace();
  const emitEvent = useEmitEvent();

  const updateList = React.useCallback(
    (input: UpdateListNameInput) => {
      const { id, name } = input;
      const prevList = lists[id];

      if (prevList === undefined) {
        throw new Error('List not found');
      }

      const nextList: List = {
        ...prevList,
        name,
      };

      emitEvent({
        name: 'ListNameUpdated',
        prevList,
        nextList,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });
    },
    [lists, emitEvent, workspace],
  );

  return updateList;
}

export function useCreateListGroup() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const createListGroup = React.useCallback(() => {
    const listGroup: ListGroup = {
      id: v4(),
      name: '',
      listIDs: [],
      workspaceID: workspace.id,
      typename: 'ListGroup',
    };

    const nextWorkspace: Workspace = {
      ...workspace,
      lists: [...workspace.lists, { type: 'ListGroup', id: listGroup.id }],
    };

    emitEvent({
      name: 'ListGroupCreated',
      listGroup,
      createdAt: new Date(),
      workspaceID: workspace.id,
      typename: 'Event',
    });

    emitEvent({
      name: 'WorkspaceUpdated',
      nextWorkspace: nextWorkspace,
      prevWorkspace: workspace,
      createdAt: new Date(),
      typename: 'Event',
    });

    return listGroup;
  }, [emitEvent, workspace]);

  return createListGroup;
}

export function useDeleteListGroup() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();

  const deleteListGroup = React.useCallback(
    (listGroup: ListGroup) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        lists: workspace.lists.filter((l) => l.id !== listGroup.id),
      };

      emitEvent({
        name: 'ListGroupDeleted',
        listGroup,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });

      emitEvent({
        name: 'WorkspaceUpdated',
        nextWorkspace: nextWorkspace,
        prevWorkspace: workspace,
        createdAt: new Date(),
        typename: 'Event',
      });
    },
    [workspace, emitEvent],
  );

  return deleteListGroup;
}

export interface UpdateListGroupNameInput {
  id: string;
  name: string;
}

export function useUpdateListGroupName() {
  const listGroups = useRecoilValue(listGroupsState);
  const workspace = useGetWorkspace();
  const emitEvent = useEmitEvent();

  const updateListGroup = React.useCallback(
    (input: UpdateListGroupNameInput) => {
      const { id, name } = input;
      const prevListGroup = listGroups[id];
      if (prevListGroup === undefined) {
        throw new Error('ListGroup not found');
      }
      const nextListGroup: ListGroup = {
        ...prevListGroup,
        name,
      };

      emitEvent({
        name: 'ListGroupNameUpdated',
        prevListGroup,
        nextListGroup,
        createdAt: new Date(),
        workspaceID: workspace.id,
        typename: 'Event',
      });
    },
    [listGroups, emitEvent, workspace],
  );

  return updateListGroup;
}
