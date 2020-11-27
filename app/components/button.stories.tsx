import React from 'react';

import { Button } from './button';
import { Text } from './text';

export default {
  title: 'Button',
  component: Button,
};

export function Basic(): JSX.Element {
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
