import React from 'react';
import { Row, Container, Pressable, Text, Column } from '../components';
import { Card, useCardStore } from '../data/card';

interface CardReminderProps {
  card: Card;
}

export function CardReminder(props: CardReminderProps) {
  const { updateReminderDate, updateReminderPlace } = useCardStore();

  return (
    <Container>
      <Row>
        <Pressable>
          <Text>Today</Text>
        </Pressable>
        <Pressable>
          <Text>Tomorrow</Text>
        </Pressable>
        <Pressable>
          <Text>Next week</Text>
        </Pressable>
      </Row>
      <Row>
        <Pressable>
          <Text>Home</Text>
        </Pressable>
      </Row>
      <Column>
        <Pressable>
          <Text>Pick time</Text>
        </Pressable>
        <Pressable>
          <Text>Pick place</Text>
        </Pressable>
      </Column>
    </Container>
  );
}
