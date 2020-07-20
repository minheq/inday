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
import { NoteList } from './core/note_list';
import {
  useGetNote,
  useGetAllNotes,
  useGetInboxNotes,
  useGetTag,
  useGetTagNotes,
  useGetArchiveNotes,
  useGetDeletedNotes,
} from './data/api';
import { NoteEditor } from './core/note_editor';
import { Note, NotesState } from './data/notes';
import { WorkspaceState } from './data/workspace';
import { InitWorkspace } from './core/init_workspace';
import { useNavigation, Location, NavigationState } from './data/navigation';
import { NoteListHeader } from './core/note_list_header';
import { TagsState } from './data/tag';
import { MenuState } from './data/menu';
import { SyncStorage } from './core/sync_storage';

type Atoms = (
  | [RecoilKey.Notes, NotesState]
  | [RecoilKey.Tags, TagsState]
  | [RecoilKey.Workspace, WorkspaceState]
  | [RecoilKey.Navigation, NavigationState]
  | [RecoilKey.Menu, MenuState]
)[];

function preLoad(keys: string[]) {
  return async function load<T extends { id: string }>(
    storageKeyPrefix: string,
  ): Promise<{ [id: string]: T | undefined }> {
    const objKeys = keys.filter((k) => k.includes(`${storageKeyPrefix}:`));
    const objEntries = await AsyncStorage.multiGet(objKeys);
    const obj: { [id: string]: T } = {};

    objEntries.forEach(([, value]) => {
      if (value) {
        const val = JSON.parse(value) as T;
        obj[val.id] = val;
      }
    });

    return obj;
  };
}

async function init() {
  const atoms: Atoms = [];

  const keys = await AsyncStorage.getAllKeys();
  const load = preLoad(keys);

  const workspaceID = await AsyncStorage.getItem(StorageKey.WorkspaceID);
  const workspaces: { [id: string]: Workspace | undefined } = await load(
    StorageKeyPrefix.Workspace,
  );

  if (workspaceID) {
    const workspace = workspaces[workspaceID];

    if (workspace) {
      atoms.push([RecoilKey.Workspace, workspace]);
    } else {
      return atoms;
    }
  } else {
    return atoms;
  }

  const notes: NotesState = await load(StorageKeyPrefix.Note);
  atoms.push([RecoilKey.Notes, notes]);

  const tags: TagsState = await load(StorageKeyPrefix.Tag);
  atoms.push([RecoilKey.Tags, tags]);

  const navigation = await AsyncStorage.getItem(StorageKey.Navigation);
  if (navigation) {
    atoms.push([RecoilKey.Navigation, JSON.parse(navigation)]);
  }

  const menu = await AsyncStorage.getItem(StorageKey.Menu);
  if (menu) {
    atoms.push([RecoilKey.Menu, JSON.parse(menu)]);
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
          <Suspense fallback={<Text>Loading...</Text>}>
            <SyncStorage />
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
      return <AllNoteList noteID={navigation.state.noteID} />;
    case Location.Inbox:
      return <InboxNoteList noteID={navigation.state.noteID} />;
    case Location.Archive:
      return <ArchiveNoteList noteID={navigation.state.noteID} />;
    case Location.Trash:
      return <TrashNoteList noteID={navigation.state.noteID} />;
    case Location.Tag:
      return (
        <TagNoteList
          tagID={navigation.state.tagID}
          noteID={navigation.state.noteID}
        />
      );

    default:
      throw new Error('Invalid location');
  }
}

interface AllNoteListProps {
  noteID: string;
}

function AllNoteList(props: AllNoteListProps) {
  const { noteID } = props;
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
      <NoteListHeader name={Location.All} onViewNote={handleViewNote} />
      <NoteList
        selectedNoteID={noteID}
        notes={notes}
        onViewNote={handleViewNote}
      />
    </Container>
  );
}

interface InboxNoteListProps {
  noteID: string;
}

function InboxNoteList(props: InboxNoteListProps) {
  const { noteID } = props;
  const notes = useGetInboxNotes();
  const navigation = useNavigation();

  const handleViewNote = React.useCallback(
    (note: Note) => {
      navigation.navigate({
        location: Location.Inbox,
        noteID: note.id,
      });
    },
    [navigation],
  );

  return (
    <Container>
      <NoteListHeader name={Location.Inbox} onViewNote={handleViewNote} />
      <NoteList
        selectedNoteID={noteID}
        notes={notes}
        onViewNote={handleViewNote}
      />
    </Container>
  );
}

interface ArchiveNoteListProps {
  noteID: string;
}

function ArchiveNoteList(props: ArchiveNoteListProps) {
  const { noteID } = props;
  const notes = useGetArchiveNotes();
  const navigation = useNavigation();

  const handleViewNote = React.useCallback(
    (note: Note) => {
      navigation.navigate({
        location: Location.Archive,
        noteID: note.id,
      });
    },
    [navigation],
  );

  return (
    <Container>
      <NoteListHeader name={Location.Archive} onViewNote={handleViewNote} />
      <NoteList
        selectedNoteID={noteID}
        notes={notes}
        onViewNote={handleViewNote}
      />
    </Container>
  );
}

interface TrashNoteListProps {
  noteID: string;
}

function TrashNoteList(props: TrashNoteListProps) {
  const { noteID } = props;
  const notes = useGetDeletedNotes();
  const navigation = useNavigation();

  const handleViewNote = React.useCallback(
    (note: Note) => {
      navigation.navigate({
        location: Location.Archive,
        noteID: note.id,
      });
    },
    [navigation],
  );

  return (
    <Container>
      <NoteListHeader name={Location.Trash} onViewNote={handleViewNote} />
      <NoteList
        selectedNoteID={noteID}
        notes={notes}
        onViewNote={handleViewNote}
      />
    </Container>
  );
}

interface TagNoteListProps {
  tagID: string;
  noteID: string;
}

function TagNoteList(props: TagNoteListProps) {
  const { tagID, noteID } = props;
  const navigation = useNavigation();
  const tag = useGetTag(tagID);
  const notes = useGetTagNotes(tagID);

  const handleViewNote = React.useCallback(
    (note: Note) => {
      navigation.navigate({
        location: Location.Tag,
        tagID,
        noteID: note.id,
      });
    },
    [navigation, tagID],
  );

  return (
    <Container>
      <NoteListHeader name={tag.name} onViewNote={handleViewNote} />
      <NoteList
        selectedNoteID={noteID}
        notes={notes}
        onViewNote={handleViewNote}
      />
    </Container>
  );
}

function NoteViewSection() {
  const navigation = useNavigation();

  if (navigation.state.noteID === '') {
    return <NoteEmptyView />;
  }

  return <NoteEditorView noteID={navigation.state.noteID} />;
}

function NoteEmptyView() {
  return null;
}

interface NoteEditorViewProps {
  noteID: string;
}
function NoteEditorView(props: NoteEditorViewProps) {
  const { noteID } = props;
  const note = useGetNote(noteID);

  return (
    <Container flex={1}>
      <NoteEditor key={note.id} note={note} />
    </Container>
  );
}
