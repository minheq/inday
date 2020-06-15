import React from 'react';
import { Container, Text, Row, Column, Button } from '../components';
import { Card } from '../data/card';
import { Editor } from '../editor';

interface CardListItemProps {
  card: Card;
  onPress: () => void;
}

export function CardListItem(props: CardListItemProps) {
  const { card, onPress } = props;
  const [state, setState] = React.useState({
    open: false,
  });
  const { preview } = card;

  const handlePress = React.useCallback(() => {
    setState({ open: !state.open });
  }, [state]);

  return (
    <>
      <Button onPress={handlePress}>
        <Container padding={16}>
          <Row expanded>
            <Column justifyContent="center" expanded>
              {preview.title && <Text>{preview.title}</Text>}
              {preview.description && (
                <Text size="sm" color="muted">
                  {preview.description}
                </Text>
              )}
            </Column>
          </Row>
        </Container>
      </Button>
      {state.open && <Editor initialValue={card.content} />}
    </>
  );
}
