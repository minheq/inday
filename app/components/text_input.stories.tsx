import React from 'react';
import { View } from 'react-native';

import { TextInput } from './text_input';

function Basic(): JSX.Element {
  return <TextInput />;
}

export function TextInputStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
