import React from 'react';
import { View } from 'react-native';

import { FlatButton } from './flat_button';
import { Row } from './row';

function Basic(): JSX.Element {
  return (
    <Row>
      <FlatButton
        onPress={() => {
          return;
        }}
        icon="Bolt"
        title="Hello"
      />
    </Row>
  );
}

export function FlatButtonStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
