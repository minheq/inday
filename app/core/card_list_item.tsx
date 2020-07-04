import React from 'react';

import { Card } from '../data/types';
import { useCardList } from './card_list';
import { Text, Container, Button } from '../components';
import { CardEditor } from './card_editor';
import { StyleSheet } from 'react-native';

interface CardListItemProps {
  card: Card;
}

export function CardListItem(props: CardListItemProps) {
  const { card } = props;
  const { preview } = card;
  const { onOpen, onClear, cardID } = useCardList();
  const open = cardID === card.id;

  const handleOpen = React.useCallback(() => {
    onOpen(card.id);
  }, [card, onOpen]);

  return (
    <Container>
      {open ? (
        <CardEditor onDone={onClear} card={card} />
      ) : (
        <Button style={styles.previewContainer} onPress={handleOpen}>
          {preview.title ? (
            <Text>{preview.title}</Text>
          ) : (
            <Text color="muted">New card</Text>
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
