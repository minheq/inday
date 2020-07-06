import { atom, selectorFamily, selector } from 'recoil';

import { Note } from './types';
import { workspaceState } from './workspace';
import { RecoilKey } from './constants';

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
