import React from 'react';

import { CardReminder } from '../app/core/card_reminder';
import { ReminderDate, Container, NavigationProvider } from '../app/components';
import { ReminderPlace } from '../app/components/reminder_place';

export default {
  title: 'CardReminder',
  component: CardReminder,
};

function StatefulCardReminder() {
  const [value, setValue] = React.useState(false);

  return <CardReminder value={value} onChange={setValue} />;
}

function StatefulReminderDate() {
  const [value, setValue] = React.useState<ReminderDate>();

  return <ReminderDate value={value} onChange={setValue} />;
}

function StatefulReminderPlace() {
  const [value, setValue] = React.useState(false);

  return <ReminderPlace value={value} onChange={setValue} />;
}

export const Default = () => (
  <Container height="100%" width={400}>
    <NavigationProvider>
      <StatefulCardReminder />
    </NavigationProvider>
  </Container>
);

export const Date = () => (
  <Container height={800} width={400}>
    <NavigationProvider>
      <StatefulReminderDate />
    </NavigationProvider>
  </Container>
);

export const Place = () => (
  <Container height={800} width={400}>
    <NavigationProvider>
      <StatefulReminderPlace />
    </NavigationProvider>
  </Container>
);
