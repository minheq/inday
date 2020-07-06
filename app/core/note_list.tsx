import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Note } from '../data/notes';
import { Text, Button, Container } from '../components';
import { useTheme } from '../theme';

interface NoteListProps {
  notes: Note[];
  selectedNoteID: string;
  onViewNote: (note: Note) => void;
}

export function NoteList(props: NoteListProps) {
  const { notes, selectedNoteID, onViewNote } = props;

  return (
    <ScrollView>
      {notes.map((note) => (
        <NoteListItem
          onViewNote={onViewNote}
          selectedNoteID={selectedNoteID}
          key={note.id}
          note={note}
        />
      ))}
    </ScrollView>
  );
}

interface NoteListItemProps {
  note: Note;
  selectedNoteID: string;
  onViewNote: (note: Note) => void;
}

function NoteListItem(props: NoteListItemProps) {
  const { note, onViewNote, selectedNoteID } = props;
  const { preview } = note;
  const theme = useTheme();
  const selected = selectedNoteID === note.id;

  const handlePress = React.useCallback(() => {
    onViewNote(note);
  }, [onViewNote, note]);

  return (
    <Button
      style={[
        styles.noteListItem,
        {
          backgroundColor: selected
            ? theme.container.color.primary
            : theme.container.color.content,
        },
      ]}
      onPress={handlePress}
    >
      <Container paddingHorizontal={16}>
        {preview.title ? (
          <Text color={selected ? 'white' : 'default'}>{preview.title}</Text>
        ) : (
          <Text color="muted">New note</Text>
        )}
      </Container>
    </Button>
  );
}

const styles = StyleSheet.create({
  noteListItem: {
    height: 56,
    justifyContent: 'center',
  },
});
