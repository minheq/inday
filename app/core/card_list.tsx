import React from 'react';
import { Container, Divider } from '../components';
import { Card } from '../data/card';
import { CardListItem } from './card_list_item';

interface CardListProps {
  cards: Card[];
}

export function CardList(props: CardListProps) {
  const { cards } = props;

  return (
    <Container>
      {cards.map((c) => (
        <Container key={c.id}>
          <CardListItem card={c} />
          <Divider />
        </Container>
      ))}
    </Container>
  );
}
