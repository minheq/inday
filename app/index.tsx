import './firebase';
import React, { Suspense } from 'react';
import { RecoilRoot, MutableSnapshot } from 'recoil';

import { ThemeProvider } from './theme';
import { Row, Text } from './components';
import { SideNavigation } from './core/side_navigation';
import { DragDropProvider } from './drag_drop/drag_drop_provider';
import { ErrorBoundary } from './core/error_boundary';
import {
  AtomKey,
  useGetWorkspace,
  getAtomWithKey,
  useGetAllCards,
  CardsState,
} from './data/atoms';
import AsyncStorage from '@react-native-community/async-storage';
import { Card } from './data/card';

type AtomsStateFromStorage = [AtomKey, any][];

async function getAtomsStateFromStorage(): Promise<AtomsStateFromStorage> {
  console.time('getAtomsStateFromStorage');
  const keys = await AsyncStorage.getAllKeys();

  // Workspace state
  const state: AtomsStateFromStorage = [];
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

  const cardsState: CardsState = {
    cardsByID,
    all,
    inbox: [],
    listsByID: {},
  };

  state.push([AtomKey.Cards, cardsState]);

  console.timeEnd('getAtomsStateFromStorage');
  return state;
}

export function App() {
  const [
    atomsState,
    setAtomsState,
  ] = React.useState<AtomsStateFromStorage | null>(null);

  React.useEffect(() => {
    getAtomsStateFromStorage().then(setAtomsState);
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

  if (atomsState === null) {
    return null;
  }

  return (
    <RecoilRoot initializeState={initializeState}>
      <ErrorBoundary>
        <Suspense fallback={<Text>Loading...</Text>}>
          <ThemeProvider>
            <DragDropProvider>
              <Row expanded>
                <SideNavigation />
                <HomeContainer />
              </Row>
            </DragDropProvider>
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

function HomeContainer() {
  const workspace = useGetWorkspace();
  const cards = useGetAllCards();

  console.log(cards);

  return <Text>{workspace.id}</Text>;
}
