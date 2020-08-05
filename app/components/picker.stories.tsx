import React from 'react';

import { Picker } from './picker';
import { Container } from './container';

export default {
  title: 'Picker',
  component: Picker,
};

export const Default = () => {
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
};
