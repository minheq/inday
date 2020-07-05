import React from 'react';

import { Note } from '../data/types';
import { useNoteList } from './note_list';
import { Text, Container, Button } from '../components';
import { NoteEditor } from './note_editor';
import { StyleSheet } from 'react-native';

interface NoteListItemProps {
  note: Note;
}

export function NoteListItem(props: NoteListItemProps) {
  const { note } = props;
  const { preview } = note;
  const { onOpen, onClear, noteID } = useNoteList();
  const open = noteID === note.id;

  const handleOpen = React.useCallback(() => {
    onOpen(note.id);
  }, [note, onOpen]);

  return (
    <Container>
      {open ? (
        <NoteEditor onDone={onClear} note={note} />
      ) : (
        <Button style={styles.previewContainer} onPress={handleOpen}>
          {preview.title ? (
            <Text>{preview.title}</Text>
          ) : (
            <Text color="muted">New note</Text>
          )}
        </Button>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    height: 56,
    justifyContent: 'center',
  },
});
