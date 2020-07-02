import React from 'react';
import { CardList, useCardList } from '../core/card_list';
import { useGetAllCards, useCreateCard } from '../data/api';
import { Button, Text, Screen, Content, Spacer } from '../components';

export function InboxScreen() {
  const cards = useGetAllCards();

  return (
    <Screen>
      <Content>
        <Text bold size="lg">
          Inbox
        </Text>
        <Spacer size={16} />
        <CardList cards={cards} />
        <AddCard />
      </Content>
    </Screen>
  );
}

function AddCard() {
  const createCard = useCreateCard();
  const { onOpen } = useCardList();

  const handleCreateCard = React.useCallback(async () => {
    const card = createCard();

    onOpen(card.id);
  }, [createCard, onOpen]);

  return (
    <Button onPress={handleCreateCard}>
      <Text color="primary">+ Add new card</Text>
    </Button>
  );
}
