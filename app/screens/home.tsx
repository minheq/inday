import React from 'react';
import {
  Screen,
  Text,
  Content,
  Spacing,
  Divider,
  Button,
  Row,
  useNavigation,
  Container,
} from '../components';
import { ScrollView } from 'react-native';
import { useCardStore } from '../data/card';
import { CardListItem } from '../core/card_list_item';
import { CardScreen } from './card';

export function HomeScreen() {
  const { navigate } = useNavigation();
  const { getManyByDate } = useCardStore();

  const cards = getManyByDate('2020-06-06');

  return (
    <Screen>
      <ScrollView>
        <Content>
          <Text bold size="lg">
            Today
          </Text>
          <Spacing height={16} />
          {cards.map((c) => (
            <Container key={c.id}>
              <CardListItem
                onPress={() => navigate(<CardScreen card={c} />)}
                card={c}
              />
              <Divider />
            </Container>
          ))}
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
