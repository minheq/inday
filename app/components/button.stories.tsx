import React from 'react';

import { Button } from './button';
import { Container } from './container';
import { Text } from './text';

function Basic(): JSX.Element {
  return (
    <Button
      onPress={() => {
        return;
      }}
    >
      <Text>Button</Text>
    </Button>
  );
}

export function ButtonStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
