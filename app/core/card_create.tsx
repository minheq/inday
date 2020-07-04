import React from 'react';

import { Text, Button } from '../components';
import { useCreateCard } from '../data/api';
import { useCardList } from './card_list';
import { CardEditor } from './card_editor';
import { StyleSheet } from 'react-native';

export function CreateCard() {
  const createCard = useCreateCard();
  const { onNewCard, newCard, onClear } = useCardList();

  const handleCreateCard = React.useCallback(async () => {
    const card = createCard();

    onNewCard(card);
  }, [createCard, onNewCard]);

  const handleDone = React.useCallback(async () => {
    onClear();
  }, [onClear]);

  if (newCard !== null) {
    return <CardEditor card={newCard} onDone={handleDone} />;
  }

  return (
    <Button style={styles.button} onPress={handleCreateCard}>
      <Text color="primary">Create new card</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
  },
});
