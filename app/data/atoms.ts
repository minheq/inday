import { atom, selector, RecoilState } from 'recoil';

import { Card, Workspace, Event } from './types';

export enum AtomKey {
  CardsByID = 'CardsByID',
  Workspace = 'Workspace',
  Events = 'Events',
}

export enum SelectorKey {
  AllCards = 'AllCards',
}

export type CardsByIDState = { [id: string]: Card };
export const cardsByIDState = atom<CardsByIDState>({
  key: AtomKey.CardsByID,
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

export const allCardsQuery = selector({
  key: SelectorKey.AllCards,
  get: ({ get }) => {
    const cardsByID = get(cardsByIDState);
    const workspace = get(workspaceState);

    if (workspace === null) {
      throw new Error('Workspace not found');
    }

    return workspace.all.map((id) => {
      const card = cardsByID[id];

      if (card === undefined) {
        throw new Error(`Card out of sync for id=${id}`);
      }

      return card;
    });
  },
});

export function getAtomWithKey(key: AtomKey): RecoilState<any> {
  switch (key) {
    case AtomKey.Workspace:
      return workspaceState;
    case AtomKey.CardsByID:
      return cardsByIDState;
    default:
      throw new Error('Invalid atom key');
  }
}
