import React from 'react';

import { CardReminder } from '../app/core/card_reminder';
import { ReminderDate, Container } from '../app/components';
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
  <Container width={400}>
    <StatefulCardReminder />
  </Container>
);
export const Date = () => (
  <Container width={400}>
    <StatefulReminderDate />
  </Container>
);
export const Place = () => (
  <Container width={400}>
    <StatefulReminderPlace />
  </Container>
);
