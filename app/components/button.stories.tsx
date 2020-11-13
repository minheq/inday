import React from 'react';

import { action } from '@storybook/addon-actions';
import { Button } from './button';

export default {
  title: 'Button',
  component: Button,
};

export function Basic(): JSX.Element {
  return <Button onPress={action('clicked')} title="Hello Button" />;
}
