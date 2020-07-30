import React from 'react';
import { Note } from '../data/collections';
import { useCreateNote } from '../data/store';
import { Container, Row, Text, Spacer, Button } from '../components';
import { StyleSheet } from 'react-native';
import { tokens } from '../components/theme';
import { useNavigation } from '../data/navigation';

interface NoteListHeaderProps {
  name: string;
  onViewNote: (note: Note) => void;
}

export function NoteListHeader(props: NoteListHeaderProps) {
  const { name, onViewNote } = props;
  const createNote = useCreateNote();
  const navigation = useNavigation();

  const handleCreateNote = React.useCallback(async () => {
    const note = createNote(navigation.state);
    onViewNote(note);
  }, [createNote, onViewNote, navigation]);

  return (
    <Container paddingVertical={8} paddingHorizontal={16}>
      <Row justifyContent="space-between" alignItems="center">
        <Text bold size="lg">
          {name}
        </Text>
        <Spacer size={8} />
        <Button style={styles.noteCreateButton} onPress={handleCreateNote}>
          <Text color="primary">New note</Text>
        </Button>
      </Row>
    </Container>
  );
}

const styles = StyleSheet.create({
  noteCreateButton: {
    padding: 8,
    borderRadius: tokens.radius,
  },
});
