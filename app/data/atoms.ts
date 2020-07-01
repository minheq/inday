import { atom, selector, RecoilState } from 'recoil';

import { Card, Workspace } from './types';

export enum AtomKey {
  CardsByID = 'CardsByID',
  AllCardIDList = 'AllCardIDList',
  WorkspaceID = 'WorkspaceID',
  WorkspaceList = 'WorkspaceList',
}

export enum SelectorKey {
  Workspace = 'Workspace',
  AllCards = 'AllCards',
}

export type CardsByIDState = { [id: string]: Card };
export const cardsByIDState = atom<CardsByIDState>({
  key: AtomKey.CardsByID,
  default: {},
});

export type AllCardIDListState = string[];
export const allCardIDListState = atom<AllCardIDListState>({
  key: AtomKey.AllCardIDList,
  default: [],
});

export type WorkspaceIDState = string;
export const workspaceIDState = atom<WorkspaceIDState>({
  key: AtomKey.WorkspaceID,
  default: '',
});

export type WorkspaceListState = Workspace[];
export const workspaceListState = atom<WorkspaceListState>({
  key: AtomKey.WorkspaceList,
  default: [],
});

export const allCardsQuery = selector({
  key: SelectorKey.AllCards,
  get: ({ get }) => {
    const cardsByID = get(cardsByIDState);
    const allCardIDList = get(allCardIDListState);

    return allCardIDList.map((id) => cardsByID[id]);
  },
});

export const workspaceQuery = selector({
  key: SelectorKey.Workspace,
  get: ({ get }) => {
    const workspaceID = get(workspaceIDState);
    const workspaceList = get(workspaceListState);

    const workspace = workspaceList.find((w) => w.id === workspaceID);

    if (workspace === undefined) {
      return null;
    }

    return workspace;
  },
});

export function getAtomWithKey(key: AtomKey): RecoilState<any> {
  switch (key) {
    case AtomKey.WorkspaceID:
      return workspaceIDState;
    case AtomKey.WorkspaceList:
      return workspaceListState;
    case AtomKey.CardsByID:
      return cardsByIDState;
    case AtomKey.AllCardIDList:
      return allCardIDListState;
    default:
      throw new Error('Invalid atom key');
  }
}
