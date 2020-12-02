import React from 'react';

import { Picker } from './picker';
import { Container } from './container';
import { Spacer } from './spacer';

function Basic(): JSX.Element {
  const [value, setValue] = React.useState(1);
  return (
    <Container padding={16}>
      <Picker
        value={value}
        onChange={setValue}
        options={[
          { value: 1, label: 'Option A' },
          { value: 2, label: 'Option B' },
          { value: 3, label: 'Option C' },
        ]}
      />
    </Container>
  );
}

function WithSearch(): JSX.Element {
  const [value, setValue] = React.useState(1);
  return (
    <Container padding={16}>
      <Picker
        searchable
        value={value}
        onChange={setValue}
        options={[
          { value: 1, label: 'Option A' },
          { value: 2, label: 'Option B' },
          { value: 3, label: 'Option C' },
        ]}
      />
    </Container>
  );
}

export function PickerStories(): JSX.Element {
  return (
    <Container>
      <Basic />
      <Spacer size={40} />
      <WithSearch />
    </Container>
  );
}
