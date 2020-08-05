import React from 'react';

import { FlatButton } from './flat_button';
import { Container } from './container';

export default {
  title: 'FlatButton',
  component: FlatButton,
};

export const Default = () => (
  <Container padding={16}>
    <FlatButton title="Hello" />
  </Container>
);
