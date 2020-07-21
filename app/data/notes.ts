import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { Recurrence } from '../modules/recurrence';
import { Element } from '../editor/editable/nodes/element';

export interface Note {
  id: string;
  content: Content;
  preview: Preview;
  createdAt: Date;
  updatedAt: Date;
  inbox: boolean;
  tags: {
    [tagName: string]: true;
  };
  deletedAt: Date | null;
  workspaceID: string;
  typename: 'Note';
}

export interface Reminder {
  time: ReminderTime | null;
  place: ReminderPlace | null;
}

interface ReminderTime {
  date: Date;
  time: Date | null;
  recurrence: Recurrence | null;
}

interface ReminderPlace {
  lat: number;
  lng: number;
  radius: number;
  when: 'leaving' | 'arriving';
}

export type Content = Element[];

export interface Task {
  completed: boolean;
}

export interface Preview {
  title: string;
  description: string;
  imageURL: string;
}

export type NotesState = { [id: string]: Note | undefined };
export const notesState = atom<NotesState>({
  key: RecoilKey.Notes,
  default: {},
});

export const noteListQuery = selector({
  key: RecoilKey.NoteList,
  get: ({ get }) => {
    const notes = get(notesState);

    return Object.values(notes) as Note[];
  },
});

export const allNotesQuery = selector({
  key: RecoilKey.AllNotes,
  get: ({ get }) => {
    const noteList = get(noteListQuery);

    return noteList.filter((note) => note.deletedAt === null);
  },
});

export const inboxNotesQuery = selector({
  key: RecoilKey.InboxNotes,
  get: ({ get }) => {
    const noteList = get(noteListQuery);

    return noteList.filter(
      (note) => note.inbox === true && note.deletedAt === null,
    );
  },
});

export const deletedNotesQuery = selector({
  key: RecoilKey.DeletedNotes,
  get: ({ get }) => {
    const noteList = get(noteListQuery);

    return noteList.filter((note) => note.deletedAt !== null);
  },
});

export const tagNotesQuery = selectorFamily({
  key: RecoilKey.InboxNotes,
  get: (tagID: string) => ({ get }) => {
    const noteList = get(noteListQuery);

    return noteList.filter(
      (note) => note.tags[tagID] === true && note.deletedAt === null,
    );
  },
});

export const noteQuery = selectorFamily<Note | null, string>({
  key: RecoilKey.Note,
  get: (noteID: string) => ({ get }) => {
    const notes = get(notesState);
    const note = notes[noteID];

    if (note === undefined) {
      return null;
    }

    return note;
  },
});
