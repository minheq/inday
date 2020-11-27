import React from 'react';

import { FlatButton } from './flat_button';
import { Row } from './row';

export default {
  title: 'FlatButton',
  component: FlatButton,
};

export function Basic(): JSX.Element {
  return (
    <Row>
      <FlatButton
        onPress={() => {
          return;
        }}
        icon="Bolt"
        title="Hello"
      />
    </Row>
  );
}
