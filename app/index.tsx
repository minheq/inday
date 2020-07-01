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
  WorkspaceIDState,
  AllCardIDListState,
  CardsByIDState,
  WorkspaceListState,
} from './data/atoms';
import { InboxScreen } from './screens/inbox';
import { StorageKey } from './data/storage';
import { Card, Workspace } from './data/types';

type Atoms = (
  | [AtomKey.WorkspaceID, WorkspaceIDState]
  | [AtomKey.AllCardIDList, AllCardIDListState]
  | [AtomKey.CardsByID, CardsByIDState]
  | [AtomKey.WorkspaceList, WorkspaceListState]
)[];

async function init() {
  const atoms: Atoms = [];

  const workspaceID = await AsyncStorage.getItem(StorageKey.WorkspaceID);
  if (workspaceID) {
    atoms.push([AtomKey.WorkspaceID, workspaceID]);
  }

  const allCardIDList = await AsyncStorage.getItem(StorageKey.AllCardIDList);
  if (allCardIDList) {
    atoms.push([AtomKey.AllCardIDList, JSON.parse(allCardIDList)]);
  }

  const keys = await AsyncStorage.getAllKeys();

  const cardKeys = keys.filter((k) => k.includes('Card:'));
  const cardEntries = await AsyncStorage.multiGet(cardKeys);
  const cardsByID: CardsByIDState = {};
  cardEntries.forEach(([, value]) => {
    if (value) {
      const card = JSON.parse(value) as Card;
      cardsByID[card.id] = card;
    }
  });
  atoms.push([AtomKey.CardsByID, cardsByID]);

  const workspaceKeys = keys.filter((k) => k.includes('Workspace:'));
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

  atoms.push([AtomKey.WorkspaceList, workspaceList]);

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
