import React from 'react';
import { Picker, Option } from './picker';
import { Frequency, Recurrence } from '../modules/recurrence';
import { useToggle } from '../hooks/use_toggle';
import { Dialog } from './dialog';
import { Text } from './text';

interface RecurrencePickerProps {
  startDate: Date;
  value?: Recurrence;
  onChange?: (value: Recurrence) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Control for selecting a time.
 */
export function RecurrencePicker(props: RecurrencePickerProps) {
  const {
    value,
    startDate,
    onChange = () => {},
    placeholder,
    disabled = false,
  } = props;
  const [open, dialog] = useToggle();

  return (
    <>
      <Picker
        label="Repeat"
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        value={fromRecurrence(value, startDate)}
        onChange={(val) => {
          if (val === 8) {
            dialog.setTrue();
            return;
          }

          return onChange(toRecurrence(val, startDate));
        }}
      />
      <Dialog
        animationType="slide"
        isOpen={open}
        onRequestClose={dialog.setFalse}
      >
        <Text>Custom</Text>
      </Dialog>
    </>
  );
}

function fromRecurrence(recurrence?: Recurrence, startDate: Date): number {
  return 1;
}

function toRecurrence(value: number, startDate: Date): Recurrence {
  switch (value) {
    case 1:
      return {
        startDate,
        frequency: Frequency.Daily,
      };
    default:
      return {
        startDate,
        frequency: Frequency.Daily,
      };
  }
}

const options: Option<number>[] = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Biweekly', value: 3 },
  { label: 'Monthly', value: 4 },
  { label: 'Every 3 months', value: 5 },
  { label: 'Every 6 months', value: 6 },
  { label: 'Yearly', value: 7 },
  { label: 'Custom', value: 8 },
];
