import React from 'react';
import { Screen, Text, Content, Spacing, Button, Row } from '../components';
import { ScrollView } from 'react-native';
import { useCardStore } from '../data/card';
import { CardList } from '../core/card_list';

export function InboxScreen() {
  const { getManyByDate } = useCardStore();

  const cards = getManyByDate('2020-06-06');

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
  return (
    <Button>
      <Text color="primary">+ Add new card</Text>
    </Button>
  );
}
