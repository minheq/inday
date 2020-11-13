import React from 'react';

import { action } from '@storybook/addon-actions';
import { FlatButton } from './flat_button';
import { Row } from './row';

export default {
  title: 'FlatButton',
  component: FlatButton,
};

export function Basic(): JSX.Element {
  return (
    <Row>
      <FlatButton onPress={action('clicked')} icon="Bolt" title="Hello" />
    </Row>
  );
}
