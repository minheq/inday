import React from 'react';

import { Badge } from './badge';
import { Container } from './container';

function Basic(): JSX.Element {
  return <Badge title="Badge" />;
}

export function BadgeStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
