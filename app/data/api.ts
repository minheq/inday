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
  noteListQuery,
  allNotesQuery,
  inboxNotesQuery,
  noteQuery,
  notesState,
  Note,
  Content,
  Preview,
  tagNotesQuery,
  deletedNotesQuery,
} from './notes';
import { workspaceState } from './workspace';
import { tagsState, Tag, tagQuery } from './tag';
import { NavigationState, Location } from './navigation';
import { menuState, MenuState, menuTagsQuery } from './menu';

export function useGetNotes() {
  return useRecoilValue(noteListQuery);
}

export function useGetAllNotes() {
  return useRecoilValue(allNotesQuery);
}

export function useGetInboxNotes() {
  return useRecoilValue(inboxNotesQuery);
}

export function useGetDeletedNotes() {
  return useRecoilValue(deletedNotesQuery);
}

export function useGetFixedLocationNotes() {
  return useRecoilValue(deletedNotesQuery);
}

export function useGetTagNotes(tagID: string) {
  return useRecoilValue(tagNotesQuery(tagID));
}

export function useGetTags() {
  return useRecoilValue(tagsState);
}

export function useGetMenuTags() {
  return useRecoilValue(menuTagsQuery);
}

export function useGetNote(noteID: string) {
  const note = useRecoilValue(noteQuery(noteID));

  if (note === null) {
    throw new Error('Note not found');
  }

  return note;
}

export function useGetTag(tagID: string) {
  const tag = useRecoilValue(tagQuery(tagID));

  if (tag === null) {
    throw new Error('Tag not found');
  }

  return tag;
}

export function useGetNoteCallback() {
  const notes = useRecoilValue(notesState);

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

export function useGetTagCallback() {
  const tags = useGetTags();

  const getTag = React.useCallback(
    (tagID: string) => {
      const tag = tags[tagID];

      if (tag === undefined) {
        throw new Error('Tag not found');
      }

      return tag;
    },
    [tags],
  );

  return getTag;
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
        tags: {},
        deletedAt: null,
        workspaceID: workspace.id,
        typename: 'Note',
      };

      if (navigationState.location === Location.Tag) {
        newNote.tags = {
          ...newNote.tags,
          [navigationState.tagID]: true,
        };
      }

      setNotes((previousNotes) => ({
        ...previousNotes,
        [newNote.id]: newNote,
      }));

      emitEvent({
        name: 'NoteCreated',
        note: newNote,
      });

      return newNote;
    },
    [emitEvent, workspace, setNotes],
  );

  return createNote;
}

export function useDeleteNote() {
  const emitEvent = useEmitEvent();
  const setNotes = useSetRecoilState(notesState);

  const deleteNote = React.useCallback(
    (note: Note) => {
      setNotes((previousNotes) => {
        const nextNotes = { ...previousNotes };

        delete nextNotes[note.id];

        return nextNotes;
      });

      emitEvent({
        name: 'NoteDeleted',
        note,
      });
    },
    [emitEvent, setNotes],
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

export function useCreateTag() {
  const emitEvent = useEmitEvent();
  const workspace = useGetWorkspace();
  const setTags = useSetRecoilState(tagsState);

  const createTag = React.useCallback(
    (parentTagID: string | null) => {
      const newTag: Tag = {
        id: v4(),
        name: '',
        parentTagID,
        workspaceID: workspace.id,
        typename: 'Tag',
      };

      setTags((previousTags) => ({
        ...previousTags,
        [newTag.id]: newTag,
      }));

      emitEvent({
        name: 'TagCreated',
        tag: newTag,
      });

      return newTag;
    },
    [emitEvent, workspace, setTags],
  );

  return createTag;
}

export function useDeleteTag() {
  const emitEvent = useEmitEvent();
  const setTags = useSetRecoilState(tagsState);

  const deleteTag = React.useCallback(
    (tag: Tag) => {
      setTags((previousTags) => {
        const nextTags = { ...previousTags };

        delete nextTags[tag.id];

        return nextTags;
      });

      emitEvent({
        name: 'TagDeleted',
        tag,
      });
    },
    [emitEvent, setTags],
  );

  return deleteTag;
}

export interface UpdateTagNameInput {
  tagID: string;
  name: string;
}

export function useUpdateTagName() {
  const emitEvent = useEmitEvent();
  const getTag = useGetTagCallback();
  const setTags = useSetRecoilState(tagsState);

  const updateTagName = React.useCallback(
    (input: UpdateTagNameInput) => {
      const { tagID, name } = input;
      const prevTag = getTag(tagID);

      const nextTag: Tag = {
        ...prevTag,
        name,
      };

      setTags((previousTags) => ({
        ...previousTags,
        [nextTag.id]: nextTag,
      }));

      emitEvent({
        name: 'TagNameUpdated',
        tag: nextTag,
      });
    },
    [emitEvent, setTags, getTag],
  );

  return updateTagName;
}

export interface ExpandTagInput {
  tagID: string;
  expanded: boolean;
}

export function useExpandTag() {
  const emitEvent = useEmitEvent();
  const getTag = useGetTagCallback();
  const [menu, setMenu] = useRecoilState(menuState);

  const expandTag = React.useCallback(
    (input: ExpandTagInput) => {
      const { tagID, expanded } = input;
      const tag = getTag(tagID);

      const nextMenu: MenuState = {
        ...menu,
        tagIDs: {
          ...menu.tagIDs,
          [tagID]: { expanded },
        },
      };

      setMenu(nextMenu);

      emitEvent({
        name: 'TagExpanded',
        tag,
      });
    },
    [emitEvent, getTag, menu, setMenu],
  );

  return expandTag;
}

export function useGetMenu() {
  return useRecoilValue(menuState);
}
