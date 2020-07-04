import React from 'react';
import { CardList } from '../core/card_list';
import { useGetAllCards } from '../data/api';
import { Screen } from '../components';

export function InboxScreen() {
  const cards = useGetAllCards();

  return (
    <Screen>
      <CardList cards={cards} />
    </Screen>
  );
}
