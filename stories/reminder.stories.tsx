import React from 'react';

import { Container } from '../app/components';
import { Reminder } from '../app/components/reminder';

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
