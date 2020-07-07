import React, { Suspense } from 'react';
import { RecoilRoot, MutableSnapshot } from 'recoil';
import AsyncStorage from '@react-native-community/async-storage';

import { ThemeProvider, useTheme } from './theme';
import { Row, Text, Container } from './components';
import { Menu } from './core/menu';
import { DragDropProvider } from './drag_drop/drag_drop_provider';
import { ErrorBoundary } from './core/error_boundary';
import { getAtomWithKey } from './data/atoms';
import { RecoilKey, StorageKey, StorageKeyPrefix } from './data/constants';
import { Workspace } from './data/workspace';
import { SyncStorage } from './core/sync_storage';
import { SyncAtoms } from './core/sync_atoms';
import { NoteList } from './core/note_list';
import { useGetNote, useGetAllNotes } from './data/api';
import { NoteEditor } from './core/note_editor';
import { Note, NotesByIDState } from './data/notes';
import { WorkspaceState } from './data/workspace';
import { InitWorkspace } from './core/init_workspace';
import { useNavigation, Location, NavigationState } from './data/navigation';
import { NoteListHeader } from './core/note_list_header';

type Atoms = (
  | [RecoilKey.NotesByID, NotesByIDState]
  | [RecoilKey.Workspace, WorkspaceState]
  | [RecoilKey.Navigation, NavigationState]
)[];

async function init() {
  const atoms: Atoms = [];

  const keys = await AsyncStorage.getAllKeys();

  const noteKeys = keys.filter((k) => k.includes(`${StorageKeyPrefix.Note}:`));
  const noteEntries = await AsyncStorage.multiGet(noteKeys);
  const notes: NotesByIDState = {};
  noteEntries.forEach(([, value]) => {
    if (value) {
      const note = JSON.parse(value) as Note;
      notes[note.id] = note;
    }
  });
  atoms.push([RecoilKey.NotesByID, notes]);

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
    atoms.push([RecoilKey.Workspace, workspace]);
  }

  const navigation = await AsyncStorage.getItem(StorageKey.Navigation);
  if (navigation) {
    atoms.push([RecoilKey.Navigation, JSON.parse(navigation)]);
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
      <Menu />
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
      <NoteListSwitch />
    </Container>
  );
}

function NoteListSwitch() {
  const navigation = useNavigation();

  switch (navigation.state.location) {
    case Location.All:
      return <AllNoteList />;
    case Location.Inbox:
      return <AllNoteList />;
    case Location.Today:
      return <AllNoteList />;
    case Location.List:
      return <AllNoteList />;

    default:
      return null;
  }
}

function AllNoteList() {
  const notes = useGetAllNotes();
  const navigation = useNavigation();

  const handleViewNote = React.useCallback(
    (note: Note) => {
      navigation.navigate({
        location: Location.All,
        noteID: note.id,
      });
    },
    [navigation],
  );

  return (
    <Container>
      <NoteListHeader name="All" onViewNote={handleViewNote} />
      <NoteList
        selectedNoteID={navigation.state.noteID}
        notes={notes}
        onViewNote={handleViewNote}
      />
    </Container>
  );
}

function NoteViewSection() {
  const navigation = useNavigation();
  const note = useGetNote(navigation.state.noteID);

  if (note === null) {
    return null;
  }

  return (
    <Container flex={1}>
      <NoteEditor key={note.id} note={note} />
    </Container>
  );
}
