import React from 'react';

import { Text, Button } from '../components';
import { useCreateNote } from '../data/api';
import { useNoteList } from './note_list';
import { NoteEditor } from './note_editor';
import { StyleSheet } from 'react-native';

export function CreateNote() {
  const createNote = useCreateNote();
  const { onNewNote, newNote, onClear } = useNoteList();

  const handleCreateNote = React.useCallback(async () => {
    const note = createNote();

    onNewNote(note);
  }, [createNote, onNewNote]);

  const handleDone = React.useCallback(async () => {
    onClear();
  }, [onClear]);

  if (newNote !== null) {
    return <NoteEditor note={newNote} onDone={handleDone} />;
  }

  return (
    <Button style={styles.button} onPress={handleCreateNote}>
      <Text color="primary">Create new note</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
  },
});
