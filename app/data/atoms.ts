import AsyncStorage from '@react-native-community/async-storage';
import { atom, selector, useRecoilValue } from 'recoil';
import { v4 } from 'uuid';

import { Workspace } from './workspace';
import { Card } from './card';
import { db } from './db';
import { Collection } from './api';

export enum AtomKey {
  Cards = 'Cards',
  WorkspaceID = 'WorkspaceID',
}

export enum SelectorKey {
  WorkSpace = 'WorkSpace',
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
  key: SelectorKey.WorkSpace,
  get: async ({ get }) => {
    const workspaceID = get(workspaceIDState);

    if (workspaceID === '') {
      const workspace: Workspace = {
        name: 'New workspace',
        id: v4(),
        __typename: 'Workspace',
      };

      await db
        .collection(Collection.Workspaces)
        .doc(workspace.id)
        .set(workspace);

      await AsyncStorage.setItem('workspaceID', workspace.id);
      await AsyncStorage.setItem(
        `Workspace:${workspace.id}`,
        JSON.stringify(workspace),
      );
      return workspace;
    }

    const workspaceJSON = await AsyncStorage.getItem(
      `Workspace:${workspaceID}`,
    );

    if (workspaceJSON) {
      return JSON.parse(workspaceJSON) as Workspace;
    }

    const workspaceRef = await db
      .collection(Collection.Workspaces)
      .doc(workspaceID)
      .get();

    const workspace = workspaceRef.data() as Workspace;
    await AsyncStorage.setItem(
      `Workspace:${workspace.id}`,
      JSON.stringify(workspace),
    );

    return workspace;
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
