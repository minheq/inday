import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { AtomKey, CardsState, getAtomWithKey } from './atoms';
import { Card } from './types';
import { MutableSnapshot } from 'recoil';

export type AtomsState = [AtomKey, any][];

async function initFromStorage(): Promise<AtomsState> {
  console.time('initFromStorage');
  const keys = await AsyncStorage.getAllKeys();

  // Workspace state
  const state: AtomsState = [];
  const workspaceID = await AsyncStorage.getItem('workspaceID');
  if (workspaceID) {
    state.push([AtomKey.WorkspaceID, workspaceID]);
  }

  // Cards state
  const cardKeys = keys.filter((k) => k.split(':')[0] === 'Card');
  const cardJSONs = await AsyncStorage.multiGet(cardKeys);
  const cardsByID: { [id: string]: Card } = {};
  cardJSONs.forEach(([, value]) => {
    if (!value) {
      return null;
    }
    const card = JSON.parse(value) as Card;

    cardsByID[card.id] = card;
  });

  const allCardIDs = await AsyncStorage.getItem('allCardIDs');
  let all: string[] = [];
  if (allCardIDs) {
    all = JSON.parse(allCardIDs) as string[];
  }

  const inboxCardIDs = await AsyncStorage.getItem('inboxCardIDs');
  let inbox: string[] = [];
  if (inboxCardIDs) {
    inbox = JSON.parse(inboxCardIDs) as string[];
  }

  const cardsState: CardsState = {
    cardsByID,
    all,
    inbox,
    listsByID: {},
  };

  state.push([AtomKey.Cards, cardsState]);

  console.timeEnd('initFromStorage');
  return state;
}

export function useInitFromStorage() {
  const [atomsState, setAtomsState] = React.useState<AtomsState | null>(null);

  React.useEffect(() => {
    initFromStorage().then(setAtomsState);
  }, []);

  const initializeState = React.useCallback(
    ({ set }: MutableSnapshot) => {
      if (atomsState) {
        for (const [key, value] of atomsState) {
          set(getAtomWithKey(key), value);
        }
      }
    },
    [atomsState],
  );

  return { initializeState, loading: atomsState === null };
}
