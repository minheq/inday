import { atom, selector, RecoilState } from 'recoil';

import { Note, Workspace, Event } from './types';

export enum AtomKey {
  NotesByID = 'NotesByID',
  Workspace = 'Workspace',
  Events = 'Events',
}

export enum SelectorKey {
  AllNotes = 'AllNotes',
}

export type NotesByIDState = { [id: string]: Note };
export const notesByIDState = atom<NotesByIDState>({
  key: AtomKey.NotesByID,
  default: {},
});
export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: AtomKey.Workspace,
  default: null,
});
export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: AtomKey.Events,
  default: [],
});

export const allNotesQuery = selector({
  key: SelectorKey.AllNotes,
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

export function getAtomWithKey(key: AtomKey): RecoilState<any> {
  switch (key) {
    case AtomKey.Workspace:
      return workspaceState;
    case AtomKey.NotesByID:
      return notesByIDState;
    default:
      throw new Error('Invalid atom key');
  }
}
