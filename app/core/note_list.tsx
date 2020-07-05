import React from 'react';
import { ScrollView } from 'react-native';
import { NoteListItem } from './note_list_item';
import { Note } from '../data/types';
import { Content, Text, Spacer } from '../components';
import { CreateNote } from './note_create';

interface NoteListState {
  noteID: string | null;
  newNote: Note | null;
}

interface NoteListContext extends NoteListState {
  onOpen: (noteID: string) => void;
  onClear: () => void;
  onNewNote: (note: Note) => void;
}

const NoteListContext = React.createContext<NoteListContext>({
  noteID: null,
  newNote: null,
  onNewNote: () => {},
  onOpen: () => {},
  onClear: () => {},
});

export function useNoteList() {
  return React.useContext(NoteListContext);
}

interface NoteListProps {
  notes: Note[];
}

export interface ScrollViewState {
  contentHeight: number;
  height: number;
  offsetY: number;
}

export function NoteList(props: NoteListProps) {
  const { notes } = props;
  const [state, setState] = React.useState<NoteListState>({
    noteID: null,
    newNote: null,
  });

  const handleNewNote = React.useCallback((newNote: Note) => {
    setState({
      noteID: null,
      newNote,
    });
  }, []);

  const handleOpen = React.useCallback((noteID: string) => {
    setState({
      noteID,
      newNote: null,
    });
  }, []);

  const handleClear = React.useCallback(() => {
    setState({
      noteID: null,
      newNote: null,
    });
  }, []);

  return (
    <NoteListContext.Provider
      value={{
        noteID: state.noteID,
        newNote: state.newNote,
        onNewNote: handleNewNote,
        onOpen: handleOpen,
        onClear: handleClear,
      }}
    >
      <ScrollView>
        <Content>
          <Text bold size="lg">
            Inbox
          </Text>
          <Spacer size={16} />
          <CreateNote />
          <Spacer size={24} />
          {notes
            .filter((note) => note.id !== state.newNote?.id)
            .map((note) => (
              <NoteListItem key={note.id} note={note} />
            ))}
        </Content>
      </ScrollView>
    </NoteListContext.Provider>
  );
}
