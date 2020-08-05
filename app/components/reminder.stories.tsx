import React from 'react';

import { Reminder } from './reminder';
import { Container } from './container';

export default {
  title: 'Reminder',
  component: Reminder,
};

// Main view
// Fix Input
// Custom Repeat
function StatefulNoteReminder() {
  const [value, setValue] = React.useState<Reminder>();

  return <Reminder value={value} onChange={setValue} />;
}

export const Default = () => (
  <Container height={800} width={400}>
    <StatefulNoteReminder />
  </Container>
);
