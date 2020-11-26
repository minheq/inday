import React, { useState } from 'react';
import { Day } from '../../lib/datetime';

import { DayPicker } from './day_picker';

export function Basic(): JSX.Element {
  const [value, setValue] = useState<Day | null>(null);

  return <DayPicker value={value} onChange={setValue} />;
}
