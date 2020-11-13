import React from 'react';

import { action } from '@storybook/addon-actions';
import { Button } from './button';
import { Text } from './text';

export default {
  title: 'Button',
  component: Button,
};

export function Basic(): JSX.Element {
  return (
    <Button onPress={action('clicked')}>
      <Text>Button</Text>
    </Button>
  );
}
