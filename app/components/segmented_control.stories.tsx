import React, { useState } from 'react';

import { SegmentedControl } from './segmented_control';
import { Container } from './container';

function Basic(): JSX.Element {
  const [value, setValue] = useState(1);

  return (
    <Container padding={16}>
      <SegmentedControl
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

export function SegmentedControlStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
