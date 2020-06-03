import React from 'react';

import { action } from '@storybook/addon-actions';
import { Button, Text } from '../app/components';

export default {
  title: 'Button',
  component: Button,
};

export const Default = () => (
  <Button onPress={action('clicked')}>
    <Text>Hello Button</Text>
  </Button>
);
