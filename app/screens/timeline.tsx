import React from 'react';
import {
  Screen,
  Content,
  Text,
  Spacing,
  Modal,
  Column,
  Row,
  CloseButton,
} from '../components';
import { ScrollView } from 'react-native';
import { AddCard } from '../core/add_card';

export function TimelineScreen() {
  const [isEditingCard, setIsEditingCard] = React.useState(false);

  const handleAddCard = React.useCallback(() => {
    setIsEditingCard(true);
  }, []);

  const handleCloseEditingCard = React.useCallback(() => {
    setIsEditingCard(false);
  }, []);

  return (
    <Screen>
      <ScrollView>
        <Content>
          <Column>
            <Text bold size="xl">
              Today
            </Text>
            <Spacing height={16} />
            <Row>
              <AddCard onPress={handleAddCard} />
            </Row>
          </Column>
        </Content>
      </ScrollView>
      <Modal isOpen={isEditingCard} onRequestClose={handleCloseEditingCard}>
        <Content>
          <Row>
            <CloseButton onPress={handleCloseEditingCard} />
          </Row>
          <Text bold size="xl" color="muted">
            Write here
          </Text>
        </Content>
      </Modal>
    </Screen>
  );
}
