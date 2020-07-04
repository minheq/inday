import React from 'react';

import { Button, Container, Icon, Row, Spacer, IconName } from '../components';
import { useUpdateCardContent, useDeleteCard } from '../data/api';
import { EditorInstance, Editor } from '../editor';
import { useDebouncedCallback } from '../hooks/use_debounced_callback';
import { Content, Card } from '../data/types';

interface CardEditorProps {
  card: Card;
  onDone?: () => void;
}

export function CardEditor(props: CardEditorProps) {
  const { card, onDone = () => {} } = props;
  const editorRef = React.useRef<EditorInstance>(null);
  const updateCardContent = useUpdateCardContent();
  const deleteCard = useDeleteCard();

  React.useEffect(() => {
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  }, []);

  const handleUpdateContent = useDebouncedCallback(
    (content: Content) => {
      updateCardContent({
        id: card.id,
        content,
      });
    },
    [card],
  );

  const handleDelete = useDebouncedCallback(() => {
    onDone();
    deleteCard(card);
  }, [deleteCard, card]);

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
        initialValue={card.content}
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
