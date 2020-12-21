import React from 'react';
import { View } from 'react-native';

import { IconButton } from './icon_button';
import { Row } from './row';

function Basic(): JSX.Element {
  return (
    <Row>
      <IconButton icon="Bolt" title="Hello" />
    </Row>
  );
}

export function IconButtonStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
