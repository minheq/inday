import React from 'react';
import { Container } from './container';

import { TextInput } from './text_input';

function Basic(): JSX.Element {
  return <TextInput />;
}

export function TextInputStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
