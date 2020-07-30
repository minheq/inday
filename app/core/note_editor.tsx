import React from 'react';

import { Button, Container, Icon, Row, Spacer, IconName } from '../components';
import { useUpdateNoteContent, useDeleteNote } from '../data/store';
import { EditorInstance, Editor } from '../lib/editor';
import { useDebouncedCallback } from '../hooks/use_debounced_callback';
import { Content, Note } from '../data/collections';

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor(props: NoteEditorProps) {
  const { note } = props;
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
        noteID: note.id,
        content,
      });
    },
    [note],
  );

  const handleDelete = React.useCallback(() => {
    deleteNote(note);
  }, [deleteNote, note]);

  return (
    <Container shape="rounded" padding={16}>
      <Row>
        <MenuButton icon="trash" onPress={handleDelete} />
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
