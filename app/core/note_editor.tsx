import React from 'react';

import { Button, Container, Icon, Row, Spacer, IconName } from '../components';
import { useUpdateNoteContent, useDeleteNote } from '../data/api';
import { EditorInstance, Editor } from '../editor';
import { useDebouncedCallback } from '../hooks/use_debounced_callback';
import { Content, Note } from '../data/types';

interface NoteEditorProps {
  note: Note;
  onDone?: () => void;
}

export function NoteEditor(props: NoteEditorProps) {
  const { note, onDone = () => {} } = props;
  const editorRef = React.useRef<EditorInstance>(null);
  const updateNoteContent = useUpdateNoteContent();
  const deleteNote = useDeleteNote();

  React.useEffect(() => {
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  }, []);

  const handleUpdateContent = useDebouncedCallback(
    (content: Content) => {
      updateNoteContent({
        id: note.id,
        content,
      });
    },
    [note],
  );

  const handleDelete = React.useCallback(() => {
    onDone();
    deleteNote(note);
  }, [deleteNote, note, onDone]);

  return (
    <Container shape="rounded" padding={16} shadow>
      <Row justifyContent="space-between">
        <Button onPress={onDone}>
          <MenuButton icon="x" onPress={onDone} />
        </Button>
        <Row>
          <MenuButton icon="trash" onPress={handleDelete} />
        </Row>
      </Row>
      <Spacer size={8} />
      <Editor
        ref={editorRef}
        initialValue={note.content}
        onChange={handleUpdateContent}
      />
    </Container>
  );
}

interface MenuButtonProps {
  onPress?: () => void;
  icon: IconName;
}

function MenuButton(props: MenuButtonProps) {
  const { onPress, icon } = props;

  return (
    <Button onPress={onPress}>
      <Container center width={32} height={32}>
        <Icon name={icon} />
      </Container>
    </Button>
  );
}
