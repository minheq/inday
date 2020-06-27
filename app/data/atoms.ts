import AsyncStorage from '@react-native-community/async-storage';
import { atom, selector, useRecoilValue } from 'recoil';

import { Card, Workspace } from './types';

export enum AtomKey {
  Cards = 'Cards',
  WorkspaceID = 'WorkspaceID',
}

export enum SelectorKey {
  // eslint-disable-next-line no-shadow
  Workspace = 'Workspace',
  AllCards = 'AllCards',
}

export interface CardsState {
  cardsByID: {
    [id: string]: Card;
  };
  all: string[];
  inbox: string[];
  listsByID: {
    [id: string]: string[] | undefined;
  };
}
export const cardsState = atom<CardsState>({
  key: AtomKey.Cards,
  default: {
    cardsByID: {},
    all: [],
    inbox: [],
    listsByID: {},
  },
});

export const workspaceIDState = atom<string>({
  key: AtomKey.WorkspaceID,
  default: '',
});

export const allCardsQuery = selector({
  key: SelectorKey.AllCards,
  get: async ({ get }) => {
    const { cardsByID, all } = get(cardsState);

    return all.map((id) => cardsByID[id]);
  },
});

export const workspaceQuery = selector({
  key: SelectorKey.Workspace,
  get: async ({ get }) => {
    const workspaceID = get(workspaceIDState);

    if (workspaceID === '') {
      throw new Error('WorkspaceID not ready');
    }

    const workspaceJSON = await AsyncStorage.getItem(
      `Workspace:${workspaceID}`,
    );

    if (workspaceJSON === null) {
      throw new Error('Workspace not found in storage');
    }

    return JSON.parse(workspaceJSON) as Workspace;
  },
});

export function useGetWorkspace() {
  return useRecoilValue(workspaceQuery);
}

export function useGetAllCards() {
  return useRecoilValue(allCardsQuery);
}

export function getAtomWithKey(key: AtomKey) {
  switch (key) {
    case AtomKey.Cards:
      return cardsState;
    case AtomKey.WorkspaceID:
      return workspaceIDState;
    default:
      throw new Error('Atom not found');
  }
}
