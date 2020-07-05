import './firebase';
import React, { Suspense } from 'react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import AsyncStorage from '@react-native-community/async-storage';

import { ThemeProvider, useTheme } from './theme';
import { Row, Text, Container } from './components';
import { NavigationMenu } from './core/side_navigation';
import { DragDropProvider } from './drag_drop/drag_drop_provider';
import { ErrorBoundary } from './core/error_boundary';
import { InitWorkspace } from './data/workspace';
import {
  AtomKey,
  getAtomWithKey,
  NotesByIDState,
  WorkspaceState,
  NavigationState,
} from './data/atoms';
import { StorageKey, StorageKeyPrefix } from './data/storage';
import { Note, Workspace } from './data/types';
import { useNavigation } from './data/ui';
import { SyncStorage } from './data/sync_storage';
import { SyncAtoms } from './data/sync_atoms';
import { NoteList } from './core/note_list';
import { useGetNote } from './data/api';
import { NoteEditor } from './core/note_editor';
import { InitNavigation } from './data/navigation';

type Atoms = (
  | [AtomKey.NotesByID, NotesByIDState]
  | [AtomKey.Workspace, WorkspaceState]
  | [AtomKey.Navigation, NavigationState]
)[];

async function init() {
  const atoms: Atoms = [];

  const keys = await AsyncStorage.getAllKeys();

  const noteKeys = keys.filter((k) => k.includes(`${StorageKeyPrefix.Note}:`));
  const noteEntries = await AsyncStorage.multiGet(noteKeys);
  const notesByID: NotesByIDState = {};
  noteEntries.forEach(([, value]) => {
    if (value) {
      const note = JSON.parse(value) as Note;
      notesByID[note.id] = note;
    }
  });
  atoms.push([AtomKey.NotesByID, notesByID]);

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

  const listID = await AsyncStorage.getItem(StorageKey.LastListID);
  const noteID = await AsyncStorage.getItem(StorageKey.LastNoteID);

  if (listID) {
    const navigation: NavigationState = {
      listID,
      noteID: noteID ?? '',
    };
    atoms.push([AtomKey.Navigation, navigation]);
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
          <InitNavigation />
          <SyncAtoms />
          <SyncStorage />
          <Suspense fallback={<Text>Loading...</Text>}>
            <ThemeProvider>
              <DragDropProvider>
                <Row expanded>
                  <MenuSection />
                  <NoteListSection />
                  <NoteViewSection />
                </Row>
              </DragDropProvider>
            </ThemeProvider>
          </Suspense>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

function MenuSection() {
  const theme = useTheme();

  return (
    <Container
      expanded
      width={320}
      borderRightWidth={1}
      borderColor={theme.border.color.default}
    >
      <NavigationMenu />
    </Container>
  );
}

function NoteListSection() {
  const theme = useTheme();

  return (
    <Container
      expanded
      width={320}
      borderRightWidth={1}
      borderColor={theme.border.color.default}
    >
      <NoteList />
    </Container>
  );
}

function NoteViewSection() {
  const { noteID } = useNavigation();
  const note = useGetNote(noteID);

  if (note === null) {
    return null;
  }

  return (
    <Container flex={1}>
      <NoteEditor key={note.id} note={note} />
    </Container>
  );
}
