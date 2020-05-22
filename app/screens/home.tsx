import React from 'react';
import { Screen, Text, Container } from '../components';
import { ScrollView } from 'react-native';

export function HomeScreen() {
  return (
    <Screen>
      <Container expanded width={320}>
        <ScrollView>
          <Text>Home</Text>
        </ScrollView>
      </Container>
    </Screen>
  );
}
