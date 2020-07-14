import React from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';
import { useEventEmitter, eventsState, Event } from './events';
import {
  allNotesQuery,
  inboxNotesQuery,
  noteQuery,
  notesState,
  Note,
  Content,
  Preview,
} from './notes';
import { workspaceState, Workspace, allListsQuery } from './workspace';
import { List, listQuery, listsState, listNotesQuery } from './list';
import { ListGroup, listGroupsState, listGroupQuery } from './list_group';
import { NavigationState, Location } from './navigation';
import { useStorage } from './storage';

export function useGetAllNotes() {
  return useRecoilValue(allNotesQuery);
}

export function useGetInboxNotes() {
  return useRecoilValue(inboxNotesQuery);
}

export function useGetNote(noteID: string) {
  return useRecoilValue(noteQuery(noteID));
}

export function useGetLists() {
  return useRecoilValue(allListsQuery);
}

export function useGetList(listID: string) {
  return useRecoilValue(listQuery(listID));
}

export function useGetListNotes(listID: string) {
  return useRecoilValue(listNotesQuery(listID));
}

export function useGetListGroupLists(listGroupID: string) {
  return useRecoilValue(listGroupQuery(listGroupID));
}

export function useGetListGroups() {
  return useRecoilValue(listGroupsState);
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
  const workspace = useGetWorkspace();
  const storage = useStorage();
  const setNotes = useSetRecoilState(notesState);
  const setWorkspace = useSetRecoilState(workspaceState);
  const [lists, setLists] = useRecoilState(listsState);

  const createNote = React.useCallback(
    (navigationState: NavigationState) => {
      let newNote: Note = {
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

      let nextWorkspace: Workspace = {
        ...workspace,
        allNoteIDs: [...workspace.allNoteIDs, newNote.id],
      };

      switch (navigationState.location) {
        case Location.All:
          break;
        case Location.List:
          const prevList = lists[navigationState.listID];

          if (prevList === undefined) {
            throw new Error('List not found');
          }

          const nextList: List = {
            ...prevList,
            noteIDs: [...prevList.noteIDs, newNote.id],
          };

          newNote.listID = nextList.id;

          setLists((prevLists) => ({
            ...prevLists,
            [nextList.id]: nextList,
          }));

          storage.saveList(nextList);
          break;
        case Location.Inbox:
          newNote.inbox = true;
          nextWorkspace = {
            ...nextWorkspace,
            inboxNoteIDs: [...nextWorkspace.inboxNoteIDs, newNote.id],
          };
          break;
        default:
          break;
      }

      setNotes((previousNotes) => ({
        ...previousNotes,
        [newNote.id]: newNote,
      }));
      setWorkspace(nextWorkspace);

      storage.saveWorkspace(nextWorkspace);
      storage.saveNote(newNote);

      return newNote;
    },
    [workspace, setNotes, setWorkspace, storage, lists, setLists],
  );

  return createNote;
}

export function useDeleteNote() {
  const workspace = useGetWorkspace();
  const storage = useStorage();
  const setNotes = useSetRecoilState(notesState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const deleteNote = React.useCallback(
    (note: Note) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        allNoteIDs: workspace.allNoteIDs.filter((id) => id !== note.id),
      };

      setNotes((previousNotes) => {
        const nextNotes = { ...previousNotes };

        delete nextNotes[note.id];

        return nextNotes;
      });
      setWorkspace(nextWorkspace);

      storage.removeNote(note);
      storage.saveWorkspace(nextWorkspace);
    },
    [workspace, setNotes, setWorkspace, storage],
  );

  return deleteNote;
}

export interface UpdateNoteContentInput {
  id: string;
  content: Content;
}

export function useUpdateNoteContent() {
  const storage = useStorage();
  const [notes, setNotes] = useRecoilState(notesState);

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

      setNotes((previousNotes) => ({
        ...previousNotes,
        [nextNote.id]: nextNote,
      }));

      storage.saveNote(nextNote);
    },
    [notes, storage, setNotes],
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
  const storage = useStorage();
  const workspace = useGetWorkspace();
  const listGroups = useGetListGroups();
  const setListGroups = useSetRecoilState(listGroupsState);
  const setWorkspace = useSetRecoilState(workspaceState);
  const setLists = useSetRecoilState(listsState);

  const createList = React.useCallback(
    (listGroupID: string | null) => {
      const newList: List = {
        id: v4(),
        name: '',
        listGroupID,
        noteIDs: [],
        workspaceID: workspace.id,
        typename: 'List',
      };

      if (listGroupID !== null) {
        const prevListGroup = listGroups[listGroupID];
        if (prevListGroup === undefined) {
          throw new Error('ListGroup not found');
        }

        const nextListGroup: ListGroup = {
          ...prevListGroup,
          listIDs: [...prevListGroup.listIDs, newList.id],
        };

        setListGroups((previousListGroups) => ({
          ...previousListGroups,
          [nextListGroup.id]: nextListGroup,
        }));
        storage.saveListGroup(nextListGroup);
      } else {
        const nextWorkspace: Workspace = {
          ...workspace,
          listOrListGroupIDs: [
            ...workspace.listOrListGroupIDs,
            { type: 'List', id: newList.id },
          ],
        };

        setWorkspace(nextWorkspace);
        storage.saveWorkspace(nextWorkspace);
      }

      setLists((previousLists) => ({
        ...previousLists,
        [newList.id]: newList,
      }));
      storage.saveList(newList);

      return newList;
    },
    [workspace, listGroups, setWorkspace, setListGroups, setLists, storage],
  );

  return createList;
}

export function useDeleteList() {
  const storage = useStorage();
  const workspace = useGetWorkspace();
  const setLists = useSetRecoilState(listsState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const deleteList = React.useCallback(
    (list: List) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        listOrListGroupIDs: workspace.listOrListGroupIDs.filter(
          (l) => l.id !== list.id,
        ),
      };

      setLists((previousLists) => {
        const nextLists = { ...previousLists };

        delete nextLists[list.id];

        return nextLists;
      });
      setWorkspace(nextWorkspace);

      storage.saveWorkspace(nextWorkspace);
      storage.removeList(list);
    },
    [workspace, storage, setWorkspace, setLists],
  );

  return deleteList;
}

export interface UpdateListNameInput {
  id: string;
  name: string;
}

export function useUpdateListName() {
  const lists = useRecoilValue(listsState);
  const storage = useStorage();
  const setLists = useSetRecoilState(listsState);

  const updateListName = React.useCallback(
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

      setLists((previousLists) => ({
        ...previousLists,
        [nextList.id]: nextList,
      }));

      storage.saveList(nextList);
    },
    [lists, setLists, storage],
  );

  return updateListName;
}

export function useCreateListGroup() {
  const storage = useStorage();
  const workspace = useGetWorkspace();
  const setListGroups = useSetRecoilState(listGroupsState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const createListGroup = React.useCallback(() => {
    const newListGroup: ListGroup = {
      id: v4(),
      name: '',
      listIDs: [],
      workspaceID: workspace.id,
      typename: 'ListGroup',
    };

    const nextWorkspace: Workspace = {
      ...workspace,
      listOrListGroupIDs: [
        ...workspace.listOrListGroupIDs,
        { type: 'ListGroup', id: newListGroup.id },
      ],
    };

    setListGroups((previousListGroups) => ({
      ...previousListGroups,
      [newListGroup.id]: newListGroup,
    }));
    setWorkspace(nextWorkspace);

    storage.saveListGroup(newListGroup);
    storage.saveWorkspace(nextWorkspace);

    return newListGroup;
  }, [storage, workspace, setListGroups, setWorkspace]);

  return createListGroup;
}

export function useDeleteListGroup() {
  const storage = useStorage();
  const workspace = useGetWorkspace();
  const setListGroups = useSetRecoilState(listsState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const deleteListGroup = React.useCallback(
    (list: ListGroup) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        listOrListGroupIDs: workspace.listOrListGroupIDs.filter(
          (l) => l.id !== list.id,
        ),
      };

      setListGroups((previousListGroups) => {
        const nextListGroups = { ...previousListGroups };

        delete nextListGroups[list.id];

        return nextListGroups;
      });
      setWorkspace(nextWorkspace);

      storage.saveWorkspace(nextWorkspace);
      storage.removeListGroup(list);
    },
    [workspace, storage, setWorkspace, setListGroups],
  );

  return deleteListGroup;
}

export interface UpdateListGroupNameInput {
  id: string;
  name: string;
}

export function useUpdateListGroupName() {
  const listGroups = useRecoilValue(listGroupsState);
  const storage = useStorage();
  const setListGroups = useSetRecoilState(listGroupsState);

  const updateListGroupName = React.useCallback(
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

      setListGroups((previousListGroups) => ({
        ...previousListGroups,
        [nextListGroup.id]: nextListGroup,
      }));

      storage.saveListGroup(nextListGroup);
    },
    [listGroups, setListGroups, storage],
  );

  return updateListGroupName;
}
