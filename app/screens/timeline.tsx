import React from 'react';
import { Screen, Content, Text } from '../components';
import { ScrollView } from 'react-native';

export function TimelineScreen() {
  return (
    <Screen>
      <ScrollView>
        <Content>
          <Text>Hello</Text>
        </Content>
      </ScrollView>
    </Screen>
  );
}
