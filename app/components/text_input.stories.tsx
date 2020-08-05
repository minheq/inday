import React from 'react';

import { TextInput } from './text_input';
import { Container } from './container';

export default {
  title: 'TextInput',
  component: TextInput,
};

export const Default = () => (
  <Container padding={16}>
    <TextInput />
  </Container>
);
