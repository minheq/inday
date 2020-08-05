import React from 'react';

import { action } from '@storybook/addon-actions';
import { Button } from './button';
import { Text } from './text';

export default {
  title: 'Button',
  component: Button,
};

export const Default = () => (
  <Button onPress={action('clicked')}>
    <Text>Hello Button</Text>
  </Button>
);
