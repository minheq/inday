import { atom, selector } from 'recoil';

import { Card, Workspace } from './types';
import { db, Collection } from './db';

export enum AtomKey {
  CardsByID = 'CardsByIDAtom',
  CardIDListAll = 'CardIDListAllAtom',
  WorkspaceID = 'WorkspaceIDAtom',
}

export enum SelectorKey {
  // eslint-disable-next-line no-shadow
  Workspace = 'WorkspaceSelector',
  AllCards = 'AllCardsSelector',
  CardsByID = 'CardsByIDSelector',
  CardIDListAll = 'CardIDListAllSelector',
}

export const cardsByIDState = atom<{ [id: string]: Card }>({
  key: AtomKey.CardsByID,
  default: {},
});

export const cardIDListAllState = atom<string[]>({
  key: AtomKey.CardIDListAll,
  default: [],
});

export const workspaceIDState = atom<string>({
  key: AtomKey.WorkspaceID,
  default: '',
});

export const workspaceQuery = selector({
  key: SelectorKey.Workspace,
  get: async ({ get }) => {
    const workspaceID = get(workspaceIDState);

    const workspaceRef = await db
      .collection(Collection.Workspaces)
      .doc(workspaceID)
      .get();

    return workspaceRef.data() as Workspace;
  },
});

const cardsByIDQuery = selector({
  key: SelectorKey.CardsByID,
  get: async ({ get }) => {
    const workspaceID = get(workspaceIDState);

    const cardsCollectionRef = await db
      .collection(Collection.Workspaces)
      .doc(workspaceID)
      .collection(Collection.Cards)
      .orderBy('createdAt', 'asc')
      .get();

    const cardsByID: { [id: string]: Card } = {};

    cardsCollectionRef.docs.forEach((c) => {
      const card = c.data() as Card;
      cardsByID[card.id] = card;
    });

    return cardsByID;
  },
});

const cardIDListAllQuery = selector({
  key: SelectorKey.CardIDListAll,
  get: async ({ get }) => {
    const workspaceID = get(workspaceIDState);

    const workspaceRef = await db
      .collection(Collection.Workspaces)
      .doc(workspaceID)
      .get();

    const workspace = workspaceRef.data() as any;

    return workspace.all as string[];
  },
});

export const allCardsQuery = selector({
  key: SelectorKey.AllCards,
  get: async ({ get }) => {
    const cardsByID = get(cardsByIDQuery);
    const cardIDListAll = get(cardIDListAllQuery);

    return cardIDListAll.map((id) => cardsByID[id]);
  },
});

export function getAtomWithKey(key: AtomKey) {
  switch (key) {
    case AtomKey.WorkspaceID:
      return workspaceIDState;
    default:
      throw new Error('Invalid atom key');
  }
}
