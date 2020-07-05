import './firebase';
import React, { Suspense } from 'react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import AsyncStorage from '@react-native-community/async-storage';

import { ThemeProvider } from './theme';
import { Row, Text } from './components';
import { SideNavigation } from './core/side_navigation';
import { DragDropProvider } from './drag_drop/drag_drop_provider';
import { ErrorBoundary } from './core/error_boundary';
import { InitWorkspace } from './data/workspace';
import {
  AtomKey,
  getAtomWithKey,
  CardsByIDState,
  WorkspaceState,
} from './data/atoms';
import { InboxScreen } from './screens/inbox';
import { StorageKey, StorageKeyPrefix } from './data/storage';
import { Card, Workspace } from './data/types';
import { SyncStorage } from './data/sync_storage';
import { SyncAtoms } from './data/sync_atoms';

type Atoms = (
  | [AtomKey.CardsByID, CardsByIDState]
  | [AtomKey.Workspace, WorkspaceState]
)[];

async function init() {
  const atoms: Atoms = [];

  const keys = await AsyncStorage.getAllKeys();

  const cardKeys = keys.filter((k) => k.includes(`${StorageKeyPrefix.Card}:`));
  const cardEntries = await AsyncStorage.multiGet(cardKeys);
  const cardsByID: CardsByIDState = {};
  cardEntries.forEach(([, value]) => {
    if (value) {
      const card = JSON.parse(value) as Card;
      cardsByID[card.id] = card;
    }
  });
  atoms.push([AtomKey.CardsByID, cardsByID]);

  const workspaceKeys = keys.filter((k) =>
    k.includes(`${StorageKeyPrefix.Workspace}:`),
  );
  const workspaceEntries = await AsyncStorage.multiGet(workspaceKeys);
  const workspaceList = workspaceEntries
    .map(([, value]) => value)
    .filter(Boolean)
    .map((value) => {
      if (value === null) {
        throw new Error('Expected value');
      }

      return JSON.parse(value) as Workspace;
    });

  const workspaceID = await AsyncStorage.getItem(StorageKey.WorkspaceID);
  const workspace = workspaceList.find((w) => w.id === workspaceID) || null;

  if (workspace) {
    atoms.push([AtomKey.Workspace, workspace]);
  }

  return atoms;
}

function useInit() {
  const [state, setState] = React.useState<{
    loading: boolean;
    atoms: Atoms;
  }>({
    loading: true,
    atoms: [],
  });

  const { loading, atoms } = state;

  React.useEffect(() => {
    init().then((initAtoms) => {
      setState({
        atoms: initAtoms,
        loading: false,
      });
    });
  }, []);

  const initializeState = React.useCallback(
    ({ set }: MutableSnapshot) => {
      for (const [key, value] of atoms) {
        set(getAtomWithKey(key), value);
      }
    },
    [atoms],
  );

  return { loading, initializeState };
}

export function App() {
  const { loading, initializeState } = useInit();

  if (loading) {
    return null;
  }

  return (
    <RecoilRoot initializeState={initializeState}>
      <ErrorBoundary>
        <Suspense fallback={<Text>Initializing workspace...</Text>}>
          <InitWorkspace />
          <SyncAtoms />
          <SyncStorage />
          <Suspense fallback={<Text>Loading...</Text>}>
            <ThemeProvider>
              <DragDropProvider>
                <Row expanded>
                  <SideNavigation />
                  <InboxScreen />
                </Row>
              </DragDropProvider>
            </ThemeProvider>
          </Suspense>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
