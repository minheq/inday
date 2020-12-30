import React from 'react';
import { View } from 'react-native';

import { PressableHighlight } from './pressable_highlight';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <PressableHighlight
      onPress={() => {
        return;
      }}
    >
      <Text>Button</Text>
    </PressableHighlight>
  );
}

export function ButtonStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
