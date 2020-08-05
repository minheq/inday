import React from 'react';

import { SegmentedControl } from './segmented_control';
import { Container } from './container';

export default {
  title: 'SegmentedControl',
  component: SegmentedControl,
};

export const Default = () => {
  const [value, setValue] = React.useState(1);

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
};
