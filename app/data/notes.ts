import { atom, selectorFamily, selector } from 'recoil';

import { workspaceState } from './workspace';
import { RecoilKey } from './constants';
import { Recurrence } from '../modules/recurrence';
import { Element } from '../editor/editable/nodes/element';

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
  typename: 'Note';
}

export type NotesByIDState = { [id: string]: Note };
export const notesByIDState = atom<NotesByIDState>({
  key: RecoilKey.NotesByID,
  default: {},
});

export const allNotesQuery = selector({
  key: RecoilKey.AllNotes,
  get: ({ get }) => {
    const notesByID = get(notesByIDState);
    const workspace = get(workspaceState);

    if (workspace === null) {
      throw new Error('Workspace not found');
    }

    return workspace.all.map((id) => {
      const note = notesByID[id];

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
    const notesByID = get(notesByIDState);
    const note = notesByID[noteID];

    if (note === undefined) {
      return null;
    }

    return note;
  },
});
