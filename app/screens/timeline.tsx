import React from 'react';
import {
  Screen,
  Content,
  Text,
  Spacing,
  Column,
  Row,
  CloseButton,
  Dialog,
  Container,
  Button,
} from '../components';
import { ScrollView, View } from 'react-native';
import { AddCard } from '../core/add_card';
import { Editor } from '../modules/editor';

export function TimelineScreen() {
  const [isEditingCard, setIsEditingCard] = React.useState(true);

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
      <Dialog
        animationType="fade"
        isOpen={isEditingCard}
        onRequestClose={handleCloseEditingCard}
        style={{ width: 800 }}
      >
        <Container padding={16} height="100%" width="100%">
          <Row justifyContent="space-between">
            <CloseButton onPress={handleCloseEditingCard} />
            <Row>
              <Button>
                <Text>Turn into task</Text>
              </Button>
              <Button>
                <Text>Add reminder</Text>
              </Button>
              <Button>
                <Text>Add label</Text>
              </Button>
              <Button>
                <Text>More</Text>
              </Button>
            </Row>
          </Row>
          <View style={{ flex: 1 }}>
            <Editor />
          </View>
        </Container>
      </Dialog>
    </Screen>
  );
}
