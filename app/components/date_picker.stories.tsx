import React, { useState } from 'react';
import { Day } from '../../lib/datetime';
import { Container } from './container';

import { DatePicker } from './date_picker';

function Basic(): JSX.Element {
  const [value, setValue] = useState<Day | null>(null);

  return (
    <Container width={320}>
      <DatePicker value={value} onChange={setValue} />
    </Container>
  );
}

export function DatePickerStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
