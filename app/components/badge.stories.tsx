import React from 'react';
import { View } from 'react-native';

import { Badge } from './badge';

function Basic(): JSX.Element {
  return <Badge title="Badge" />;
}

export function BadgeStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
