import React from 'react';
import { Container, Text, Row, Column, Button } from '../components';
import { Card } from '../data/card';

interface CardListItemProps {
  card: Card;
  onPress: () => void;
}

export function CardListItem(props: CardListItemProps) {
  const { card, onPress } = props;
  const { preview } = card;

  return (
    <Button onPress={onPress}>
      <Container height={64} padding={16}>
        <Row expanded>
          <Column justifyContent="center" expanded>
            {preview.title && <Text bold>{preview.title}</Text>}
            {preview.description && (
              <Text color="muted">{preview.description}</Text>
            )}
          </Column>
        </Row>
      </Container>
    </Button>
  );
}
