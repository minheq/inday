import React from 'react';
import { Screen } from '../components';
import { ScrollView, View } from 'react-native';

export function TimelineScreen() {
  return (
    <Screen>
      <ScrollView>
        <View style={{ height: 600, backgroundColor: 'blue' }} />
        <View style={{ height: 600, backgroundColor: 'green' }} />
        <View style={{ height: 600, backgroundColor: 'red' }} />
        <View style={{ height: 600, backgroundColor: 'yellow' }} />
      </ScrollView>
    </Screen>
  );
}
