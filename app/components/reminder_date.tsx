import React from 'react';
import { Container } from './container';
import { Text } from './text';
import { DayPicker } from './day_picker';
import { TimePicker } from './time_picker';
import { Recurrence } from '../modules/recurrence';
import { RecurrencePicker } from './recurrence_picker';

export interface ReminderDate {
  date: Date;
  time: Date | null;
  recurrence: Recurrence | null;
}

interface ReminderDateProps {
  value?: ReminderDate;
  onChange?: (value: ReminderDate) => void;
}

export function ReminderDate(props: ReminderDateProps) {
  const { value, onChange = () => {} } = props;

  const handleDateChange = React.useCallback(
    (newDate: Date) => {
      if (value) {
        onChange({
          date: newDate,
          time: null,
          recurrence: value.recurrence,
        });
      } else {
        onChange({
          date: newDate,
          time: null,
          recurrence: null,
        });
      }
    },
    [value, onChange],
  );

  const handleTimeChange = React.useCallback(
    (time?: Date) => {
      if (value) {
        onChange({
          date: value.date,
          time: time ?? null,
          recurrence: value.recurrence,
        });
      }
    },
    [value, onChange],
  );

  const handleRecurrenceChange = React.useCallback(
    (newRecurrence: Recurrence | null) => {
      if (value) {
        onChange({
          date: value.date,
          time: value.time,
          recurrence: newRecurrence,
        });
      }
    },
    [value, onChange],
  );

  return (
    <Container>
      <Text>Pick date</Text>
      <DayPicker value={value?.date} onChange={handleDateChange} />
      {value?.date && (
        <TimePicker
          placeholder="Set time"
          value={value.time ?? undefined}
          onChange={handleTimeChange}
        />
      )}
      {value?.date && (
        <RecurrencePicker
          startDate={value.time || value.date}
          value={value.recurrence}
          onChange={handleRecurrenceChange}
        />
      )}
    </Container>
  );
}
