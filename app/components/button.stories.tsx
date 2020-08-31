import React from 'react';

import { action } from '@storybook/addon-actions';
import { Button } from './button';

export default {
  title: 'Button',
  component: Button,
};

export const Default = () => (
  <Button onPress={action('clicked')} title="Hello Button" />
);
