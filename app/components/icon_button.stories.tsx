import React from 'react';

import { action } from '@storybook/addon-actions';
import { IconButton } from './icon_button';
import { Row } from './row';

export default {
  title: 'IconButton',
  component: IconButton,
};

export function Basic(): JSX.Element {
  return (
    <Row>
      <IconButton onPress={action('clicked')} icon="Bolt" title="Hello" />
    </Row>
  );
}
