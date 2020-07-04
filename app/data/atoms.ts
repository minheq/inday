import { atom, selector, RecoilState } from 'recoil';

import { Card, Workspace } from './types';

export enum AtomKey {
  CardsByID = 'CardsByID',
  Workspace = 'Workspace',
}

export enum SelectorKey {
  AllCards = 'AllCards',
}

export type CardsByIDState = { [id: string]: Card };
export const cardsByIDState = atom<CardsByIDState>({
  key: AtomKey.CardsByID,
  default: {},
});
export type WorkspaceState = Workspace;
export const workspaceState = atom<WorkspaceState>({
  key: AtomKey.Workspace,
  default: {
    id: '',
    name: '',
    all: [],
    inbox: [],
    typename: 'Workspace',
  },
});

export const allCardsQuery = selector({
  key: SelectorKey.AllCards,
  get: ({ get }) => {
    const cardsByID = get(cardsByIDState);
    const workspace = get(workspaceState);

    return workspace.all.map((id) => cardsByID[id]);
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
