import React from 'react';
import { Screen, Text, Content, Spacer } from '../components';
import { CardList } from '../core/card_list';
import { useGetAllCards } from '../data/api';

export function InboxScreen() {
  const cards = useGetAllCards();

  return <CardList cards={cards} />;

  return (
    <Screen>
      <Content>
        <Text bold size="lg">
          Inbox
        </Text>
        <Spacer size={16} />
        <CardList cards={cards} />
      </Content>
    </Screen>
  );
}
