import React from 'react';
import { Option } from './picker';
import { Picker } from './picker';
import { Row } from './row';
import { range } from '../../lib/data_structures/arrays';
import { setHours, setMinutes } from 'date-fns';

interface TimePickerProps {
  /** Sets year, month and day of this date on the operated values */
  value?: Date;
  onChange?: (value?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Control for selecting a time.
 */
export function TimePicker(props: TimePickerProps) {
  const { value, onChange = () => {} } = props;

  const valueHours = value?.getHours();
  const valueMinutes = value?.getMinutes();

  const handleHourChange = React.useCallback(
    (hour: number) => {
      if (value) {
        onChange(setHours(value, hour));
      } else {
        onChange(setMinutes(setHours(new Date(), hour), 0));
      }
    },
    [onChange, value],
  );

  const handleMinutesChange = React.useCallback(
    (minute: number) => {
      if (value) {
        onChange(setMinutes(value, minute));
      } else {
        onChange(setMinutes(new Date(), minute));
      }
    },
    [onChange, value],
  );

  return (
    <Row>
      <Picker options={hours} onChange={handleHourChange} value={valueHours} />
      <Picker
        options={minutes}
        onChange={handleMinutesChange}
        value={valueMinutes}
      />
    </Row>
  );
}

const hours: Option[] = range(24).map((i) => ({ label: `${i}`, value: i }));
const minutes: Option[] = range(0, 60, 5).map((i) => ({
  label: `${i}`,
  value: i,
}));
