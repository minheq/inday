import React, { useState } from 'react';
import { Container } from './container';

import { Switch } from './switch';

function Basic(): JSX.Element {
  const [value, setValue] = useState(false);

  return <Switch value={value} onChange={setValue} />;
}

export function SwitchStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
