import React from 'react';
import { View } from 'react-native';

import { ContextMenu } from './context_menu';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <ContextMenu options={[{ label: 'Item 1' }, { label: 'Item 2' }]}>
      <View>
        <Text>Right click on this</Text>
      </View>
    </ContextMenu>
  );
}

export function ContextMenuStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
