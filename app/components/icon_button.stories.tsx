import React from 'react';
import { Container } from './container';

import { IconButton } from './icon_button';
import { Row } from './row';

function Basic(): JSX.Element {
  return (
    <Row>
      <IconButton icon="Bolt" title="Hello" />
    </Row>
  );
}

export function IconButtonStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
