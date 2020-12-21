import React, { useState } from 'react';
import { View } from 'react-native';

import { Switch } from './switch';

function Basic(): JSX.Element {
  const [value, setValue] = useState(false);

  return <Switch value={value} onChange={setValue} />;
}

export function SwitchStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
