import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Note } from '../data/types';
import { Text, Button, Spacer, Row, Container } from '../components';
import { useCreateNote, useGetNotes, useGetList } from '../data/api';
import { useViewNoteID, useNavigation } from '../data/ui';
import { useTheme } from '../theme';

export function NoteList() {
  const { listID } = useNavigation();
  const list = useGetList(listID);
  const notes = useGetNotes({ id: listID });

  return (
    <ScrollView>
      <Container paddingVertical={8} paddingHorizontal={16}>
        <Row justifyContent="space-between" alignItems="center">
          <Text bold size="lg">
            {list.name}
          </Text>
          <Spacer size={8} />
          <CreateNoteButton />
        </Row>
      </Container>
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </ScrollView>
  );
}

function CreateNoteButton() {
  const createNote = useCreateNote();
  const viewNoteID = useViewNoteID();

  const handleCreateNote = React.useCallback(async () => {
    const note = createNote();
    viewNoteID(note.id);
  }, [createNote, viewNoteID]);

  return (
    <Button style={styles.noteCreateButton} onPress={handleCreateNote}>
      <Text color="primary">New note</Text>
    </Button>
  );
}

interface NoteListItemProps {
  note: Note;
}

function NoteListItem(props: NoteListItemProps) {
  const { note } = props;
  const { preview } = note;
  const { noteID } = useNavigation();
  const viewNoteID = useViewNoteID();
  const theme = useTheme();
  const selected = noteID === note.id;

  const handlePress = React.useCallback(() => {
    viewNoteID(note.id);
  }, [viewNoteID, note]);

  return (
    <Button
      style={[
        styles.previewContainer,
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
  previewContainer: {
    height: 56,
    justifyContent: 'center',
  },
  noteCreateButton: {
    padding: 8,
  },
});
