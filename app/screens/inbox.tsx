import React from 'react';
import { Screen, Text, Content, Spacing, Button, Row } from '../components';
import { ScrollView } from 'react-native';
import { CardList } from '../core/card_list';
import { useGetAllCards, useCreateCard } from '../data/api';

export function InboxScreen() {
  const cards = useGetAllCards();

  return (
    <Screen>
      <ScrollView>
        <Content>
          <Text bold size="lg">
            Inbox
          </Text>
          <Spacing height={16} />
          <CardList cards={cards} />
          <Spacing height={16} />
          <Row>
            <AddCard />
          </Row>
        </Content>
      </ScrollView>
    </Screen>
  );
}

function AddCard() {
  const createCard = useCreateCard();

  const handleCreateCard = React.useCallback(() => {
    createCard();
  }, [createCard]);

  return (
    <Button onPress={handleCreateCard}>
      <Text color="primary">+ Add new card</Text>
    </Button>
  );
}
