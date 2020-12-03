import React from 'react';

import { Checkbox } from './checkbox';
import { Container } from './container';

function Basic(): JSX.Element {
  const [value, setValue] = React.useState(false);

  return <Checkbox value={value} onChange={setValue} />;
}

export function CheckboxStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
