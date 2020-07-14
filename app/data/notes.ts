import { atom, selectorFamily, selector } from 'recoil';

import { workspaceState } from './workspace';
import { RecoilKey } from './constants';
import { Recurrence } from '../modules/recurrence';
import { Element } from '../editor/editable/nodes/element';

export interface Note {
  id: string;
  content: Content;
  preview: Preview;
  reminder: Reminder | null;
  task: Task | null;
  createdAt: Date;
  updatedAt: Date;
  inbox: boolean;
  listID: string | null;
  scheduledAt: Date | null;
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

export const allNotesQuery = selector({
  key: RecoilKey.AllNotes,
  get: ({ get }) => {
    const notes = get(notesState);
    const workspace = get(workspaceState);

    if (workspace === null) {
      throw new Error('Workspace not found');
    }

    return workspace.allNoteIDs.map((id) => {
      const note = notes[id];

      if (note === undefined) {
        throw new Error(`Note out of sync for id=${id}`);
      }

      return note;
    });
  },
});

export const inboxNotesQuery = selector({
  key: RecoilKey.InboxNotes,
  get: ({ get }) => {
    const notes = get(notesState);
    const workspace = get(workspaceState);

    if (workspace === null) {
      throw new Error('Workspace not found');
    }

    return workspace.inboxNoteIDs.map((id) => {
      const note = notes[id];

      if (note === undefined) {
        throw new Error(`Note out of sync for id=${id}`);
      }

      return note;
    });
  },
});

export const noteQuery = selectorFamily<Note | null, string>({
  key: RecoilKey.AllNotes,
  get: (noteID: string) => ({ get }) => {
    const notes = get(notesState);
    const note = notes[noteID];

    if (note === undefined) {
      return null;
    }

    return note;
  },
});
