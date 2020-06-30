import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { AtomKey, getAtomWithKey } from './atoms';
import { MutableSnapshot } from 'recoil';
import { getCardsStateFromStorage, StorageKey } from './storage';

export type AtomsState = [AtomKey, any][];

async function initFromStorage(): Promise<AtomsState> {
  console.time('initFromStorage');

  // Workspace state
  const state: AtomsState = [];
  const workspaceID = await AsyncStorage.getItem(StorageKey.WorkspaceID);
  if (workspaceID) {
    state.push([AtomKey.WorkspaceID, workspaceID]);
  }

  const cardsState = await getCardsStateFromStorage();

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
