import React from 'react';
import { View } from 'react-native';

import { ContextMenuView } from './context_menu_view';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <ContextMenuView menuItems={[{ label: 'Item 1' }, { label: 'Item 2' }]}>
      <View>
        <Text>Right click on this</Text>
      </View>
    </ContextMenuView>
  );
}

export function ContextMenuStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
