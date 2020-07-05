import { atom, RecoilState, selectorFamily } from 'recoil';

import { Note, Workspace, Event, ListID } from './types';

export enum AtomKey {
  NotesByID = 'NotesByID',
  Workspace = 'Workspace',
  Navigation = 'Navigation',
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
export type NavigationState = {
  listID: string;
  noteID: string;
};
export const navigationState = atom<NavigationState>({
  key: AtomKey.Navigation,
  default: { listID: '', noteID: '' },
});
export type EventsState = Event[];
export const eventsState = atom<EventsState>({
  key: AtomKey.Events,
  default: [],
});

export interface ListQuery {
  id: ListID;
}
export type NotesQueryParam = ListQuery;
// @ts-ignore
export const notesQuery = selectorFamily<Note[], NotesQueryParam>({
  key: SelectorKey.AllNotes,
  get: (param: NotesQueryParam) => ({ get }) => {
    const listID = param;
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
  key: SelectorKey.AllNotes,
  get: (noteID: string) => ({ get }) => {
    const notesByID = get(notesByIDState);
    const note = notesByID[noteID];

    if (note === undefined) {
      return null;
    }

    return note;
  },
});

export function getAtomWithKey(key: AtomKey): RecoilState<any> {
  switch (key) {
    case AtomKey.Workspace:
      return workspaceState;
    case AtomKey.Navigation:
      return navigationState;
    case AtomKey.NotesByID:
      return notesByIDState;
    default:
      throw new Error('Invalid atom key');
  }
}
