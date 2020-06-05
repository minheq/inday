import React from 'react';
import { Screen, Text, Content, Spacing, Pressable } from '../components';
import { ScrollView } from 'react-native';

export function HomeScreen() {
  return (
    <Screen>
      <ScrollView>
        <Content>
          <Text bold size="lg">
            Today
          </Text>
          <Spacing height={8} />
          <Spacing height={8} />
          <AddCard />
        </Content>
      </ScrollView>
    </Screen>
  );
}

function AddCard() {
  return (
    <Pressable>
      <Text color="primary">+ Add new card</Text>
    </Pressable>
  );
}
