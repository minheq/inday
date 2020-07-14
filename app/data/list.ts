import { atom, selectorFamily } from 'recoil';
import { RecoilKey } from './constants';
import { notesState } from './notes';

export interface List {
  id: string;
  name: string;
  noteIDs: string[];
  listGroupID: string | null;
  workspaceID: string;
  typename: 'List';
}

export type ListsState = { [id: string]: List | undefined };
export const listsState = atom<ListsState>({
  key: RecoilKey.Lists,
  default: {},
});

export const listQuery = selectorFamily({
  key: RecoilKey.ListGroup,
  get: (listID: string) => ({ get }) => {
    const lists = get(listsState);
    const list = lists[listID];

    if (list === undefined) {
      throw new Error('ListGroup not found');
    }

    return list;
  },
});

export const listNotesQuery = selectorFamily({
  key: RecoilKey.ListGroup,
  get: (listID: string) => ({ get }) => {
    const notes = get(notesState);
    const list = get(listQuery(listID));

    return list.noteIDs.map((noteID) => {
      const note = notes[noteID];

      if (note === undefined) {
        throw new Error('Note not found');
      }

      return note;
    });
  },
});
