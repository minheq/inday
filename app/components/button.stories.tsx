import React from 'react';
import { View } from 'react-native';

import { Button } from './button';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <Button
      onPress={() => {
        return;
      }}
    >
      <Text>Button</Text>
    </Button>
  );
}

export function ButtonStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
