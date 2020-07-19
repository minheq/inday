import React from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';

import { v4 } from 'uuid';
import { BlockType } from '../editor/editable/nodes/element';
import {
  useEventEmitter,
  eventsState,
  Event,
  EventWithMetadata,
  EventMetadata,
} from './events';
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
import { menuState, MenuState } from './menu';

export function useGetNotes() {
  return useRecoilValue(notesState);
}

export function useGetAllNotes() {
  return useRecoilValue(allNotesQuery);
}

export function useGetInboxNotes() {
  return useRecoilValue(inboxNotesQuery);
}

export function useGetNote(noteID: string) {
  return useRecoilValue(noteQuery(noteID));
}

export function useGetListAndListGroups() {
  return useRecoilValue(allListsQuery);
}

export function useGetLists() {
  return useRecoilValue(listsState);
}

export function useGetList(listID: string) {
  return useRecoilValue(listQuery(listID));
}

export function useGetNoteCallback() {
  const notes = useGetNotes();

  const getNote = React.useCallback(
    (noteID: string) => {
      const note = notes[noteID];

      if (note === undefined) {
        throw new Error('Note not found');
      }

      return note;
    },
    [notes],
  );

  return getNote;
}

export function useGetListCallback() {
  const lists = useGetLists();

  const getList = React.useCallback(
    (listID: string) => {
      const list = lists[listID];

      if (list === undefined) {
        throw new Error('List not found');
      }

      return list;
    },
    [lists],
  );

  return getList;
}

export function useGetListGroupCallback() {
  const listGroups = useGetListGroups();

  const getListGroup = React.useCallback(
    (listGroupID: string) => {
      const listGroup = listGroups[listGroupID];

      if (listGroup === undefined) {
        throw new Error('ListGroup not found');
      }

      return listGroup;
    },
    [listGroups],
  );

  return getListGroup;
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
  const workspace = useGetWorkspace();
  const setEvents = useSetRecoilState(eventsState);

  const emitEvent = React.useCallback(
    (event: Event) => {
      const metadata: EventMetadata = {
        createdAt: new Date(),
        typename: 'Event',
        workspaceID: workspace.id,
      };

      const eventWithMetadata: EventWithMetadata = {
        ...event,
        ...metadata,
      };

      setEvents((prevEvents) => [...prevEvents, eventWithMetadata]);
      eventEmitter.emit(eventWithMetadata);
    },
    [workspace, setEvents, eventEmitter],
  );

  return emitEvent;
}

export function useCreateNote() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setNotes = useSetRecoilState(notesState);
  const setWorkspace = useSetRecoilState(workspaceState);
  const setLists = useSetRecoilState(listsState);
  const getList = useGetListCallback();

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
        createdAt: new Date(),
        updatedAt: new Date(),
        inbox: false,
        listID: null,
        deletedAt: null,
        workspaceID: workspace.id,
        typename: 'Note',
      };

      let nextWorkspace: Workspace = {
        ...workspace,
        allNoteIDs: [...workspace.allNoteIDs, newNote.id],
      };

      switch (navigationState.location) {
        case Location.List:
          const prevList = getList(navigationState.listID);

          const nextList: List = {
            ...prevList,
            noteIDs: [...prevList.noteIDs, newNote.id],
          };

          newNote.listID = nextList.id;

          setLists((prevLists) => ({
            ...prevLists,
            [nextList.id]: nextList,
          }));
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

      emitEvent({
        name: 'NoteCreated',
        note: newNote,
      });

      return newNote;
    },
    [emitEvent, workspace, setNotes, setWorkspace, setLists, getList],
  );

  return createNote;
}

export function useDeleteNote() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
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

      emitEvent({
        name: 'NoteDeleted',
        note,
      });
    },
    [emitEvent, workspace, setNotes, setWorkspace],
  );

  return deleteNote;
}

export interface UpdateNoteContentInput {
  noteID: string;
  content: Content;
}

export function useUpdateNoteContent() {
  const emitEvent = useEmitEvent();
  const getNote = useGetNoteCallback();
  const setNotes = useSetRecoilState(notesState);

  const updateNoteContent = React.useCallback(
    (input: UpdateNoteContentInput) => {
      const { noteID, content } = input;
      const prevNote = getNote(noteID);

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

      emitEvent({
        name: 'NoteContentUpdatedEvent',
        note: nextNote,
      });
    },
    [getNote, setNotes, emitEvent],
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
  const getListGroup = useGetListGroupCallback();
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

      setLists((previousLists) => ({
        ...previousLists,
        [newList.id]: newList,
      }));

      if (listGroupID !== null) {
        const prevListGroup = getListGroup(listGroupID);

        const nextListGroup: ListGroup = {
          ...prevListGroup,
          listIDs: [...prevListGroup.listIDs, newList.id],
        };

        setListGroups((previousListGroups) => ({
          ...previousListGroups,
          [nextListGroup.id]: nextListGroup,
        }));
      } else {
        const nextWorkspace: Workspace = {
          ...workspace,
          listOrListGroupIDs: [
            ...workspace.listOrListGroupIDs,
            { type: 'List', id: newList.id },
          ],
        };

        setWorkspace(nextWorkspace);
      }

      emitEvent({
        name: 'ListCreated',
        list: newList,
      });

      return newList;
    },
    [emitEvent, workspace, setWorkspace, setListGroups, setLists, getListGroup],
  );

  return createList;
}

export function useDeleteList() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setLists = useSetRecoilState(listsState);
  const setListGroups = useSetRecoilState(listGroupsState);
  const setWorkspace = useSetRecoilState(workspaceState);
  const getListGroup = useGetListGroupCallback();

  const deleteList = React.useCallback(
    (list: List) => {
      setLists((previousLists) => {
        const nextLists = { ...previousLists };

        delete nextLists[list.id];

        return nextLists;
      });

      if (list.listGroupID !== null) {
        const prevListGroup = getListGroup(list.listGroupID);

        const nextListGroup: ListGroup = {
          ...prevListGroup,
          listIDs: prevListGroup.listIDs.filter((listID) => listID !== list.id),
        };

        setListGroups((prevListGroups) => ({
          ...prevListGroups,
          [nextListGroup.id]: nextListGroup,
        }));
      } else {
        const nextWorkspace: Workspace = {
          ...workspace,
          listOrListGroupIDs: workspace.listOrListGroupIDs.filter(
            (l) => l.id !== list.id,
          ),
        };
        setWorkspace(nextWorkspace);
      }

      emitEvent({
        name: 'ListDeleted',
        list,
      });
    },
    [emitEvent, workspace, setWorkspace, setLists, setListGroups, getListGroup],
  );

  return deleteList;
}

export interface UpdateListNameInput {
  listID: string;
  name: string;
}

export function useUpdateListName() {
  const emitEvent = useEmitEvent();
  const getList = useGetListCallback();
  const setLists = useSetRecoilState(listsState);

  const updateListName = React.useCallback(
    (input: UpdateListNameInput) => {
      const { listID, name } = input;
      const prevList = getList(listID);

      const nextList: List = {
        ...prevList,
        name,
      };

      setLists((previousLists) => ({
        ...previousLists,
        [nextList.id]: nextList,
      }));

      emitEvent({
        name: 'ListNameUpdated',
        list: nextList,
      });
    },
    [emitEvent, setLists, getList],
  );

  return updateListName;
}

export function useCreateListGroup() {
  const emitEvent = useEmitEvent();
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

    emitEvent({
      name: 'ListGroupCreated',
      listGroup: newListGroup,
    });

    return newListGroup;
  }, [emitEvent, workspace, setListGroups, setWorkspace]);

  return createListGroup;
}

export function useDeleteListGroup() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setListGroups = useSetRecoilState(listsState);
  const setWorkspace = useSetRecoilState(workspaceState);

  const deleteListGroup = React.useCallback(
    (listGroup: ListGroup) => {
      const nextWorkspace: Workspace = {
        ...workspace,
        listOrListGroupIDs: workspace.listOrListGroupIDs.filter(
          (l) => l.id !== listGroup.id,
        ),
      };

      setListGroups((previousListGroups) => {
        const nextListGroups = { ...previousListGroups };

        delete nextListGroups[listGroup.id];

        return nextListGroups;
      });
      setWorkspace(nextWorkspace);

      emitEvent({
        name: 'ListGroupDeleted',
        listGroup,
      });
    },
    [emitEvent, workspace, setWorkspace, setListGroups],
  );

  return deleteListGroup;
}

export interface UpdateListGroupNameInput {
  listGroupID: string;
  name: string;
}

export function useUpdateListGroupName() {
  const emitEvent = useEmitEvent();
  const getListGroup = useGetListGroupCallback();
  const setListGroups = useSetRecoilState(listGroupsState);

  const updateListGroupName = React.useCallback(
    (input: UpdateListGroupNameInput) => {
      const { listGroupID, name } = input;
      const prevListGroup = getListGroup(listGroupID);

      const nextListGroup: ListGroup = {
        ...prevListGroup,
        name,
      };

      setListGroups((previousListGroups) => ({
        ...previousListGroups,
        [nextListGroup.id]: nextListGroup,
      }));

      emitEvent({
        name: 'ListGroupNameUpdated',
        listGroup: nextListGroup,
      });
    },
    [emitEvent, getListGroup, setListGroups],
  );

  return updateListGroupName;
}

export interface ExpandListGroupInput {
  listGroupID: string;
  expanded: boolean;
}

export function useExpandListGroup() {
  const emitEvent = useEmitEvent();
  const getListGroup = useGetListGroupCallback();
  const [menu, setMenu] = useRecoilState(menuState);

  const expandListGroup = React.useCallback(
    (input: ExpandListGroupInput) => {
      const { listGroupID, expanded } = input;
      const listGroup = getListGroup(listGroupID);

      const nextMenu: MenuState = {
        ...menu,
        listGroupIDs: {
          ...menu.listGroupIDs,
          [listGroupID]: { expanded },
        },
      };

      setMenu(nextMenu);

      emitEvent({
        name: 'ListGroupExpanded',
        listGroup,
      });
    },
    [emitEvent, getListGroup, menu, setMenu],
  );

  return expandListGroup;
}

export function useGetMenu() {
  return useRecoilValue(menuState);
}
