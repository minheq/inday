import React, { useState } from 'react';
import { Day } from '../../lib/datetime';
import { Container } from './container';

import { DayPicker } from './day_picker';

function Basic(): JSX.Element {
  const [value, setValue] = useState<Day | null>(null);

  return (
    <Container width={320}>
      <DayPicker value={value} onChange={setValue} />
    </Container>
  );
}

export function DayPickerStories(): JSX.Element {
  return (
    <Container>
      <Basic />
    </Container>
  );
}
