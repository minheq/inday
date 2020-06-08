import React from 'react';
import { Option } from './picker';
import { Container } from './container';
import { PickerButton } from './picker_button';
import { useToggle } from '../hooks/use_toggle';
import { WheelPicker } from './wheel_picker';
import { Row } from './row';
import { range } from '../utils/arrays';
import { format, roundToNearestMinutes } from 'date-fns';

interface TimePickerProps {
  /** Sets year, month and day of this date on the operated values */
  date?: Date;
  value?: Date;
  onChange?: (value?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Control for selecting a time.
 */
export function TimePicker(props: TimePickerProps) {
  const {
    value,
    date = new Date(),
    onChange = () => {},
    placeholder,
    disabled = false,
  } = props;
  const [open, popover] = useToggle();

  const valueHours = value?.getHours();
  const valueMinutes = value?.getMinutes();

  const handleHourChange = React.useCallback(
    (hour: number) => {
      if (value) {
        value.setHours(hour);
        onChange(value);
        console.log(value);
      } else {
        const newVal = new Date();
        newVal.setHours(hour);
        newVal.setMinutes(0);
        onChange(newVal);
      }
    },
    [onChange, value],
  );

  const handleMinutesChange = React.useCallback(
    (minute: number) => {
      if (value) {
        value.setMinutes(minute);
        onChange(value);
      } else {
        const newVal = new Date();
        newVal.setMinutes(minute);
        onChange(newVal);
      }
    },
    [onChange, value],
  );

  const handleClear = React.useCallback(() => {
    onChange();
    popover.setFalse();
  }, [onChange, popover]);

  const handleToggle = React.useCallback(() => {
    if (open) {
      popover.setFalse();
    } else {
      if (!value) {
        if (date) {
          onChange(roundToNearestMinutes(date, { nearestTo: 5 }));
        } else {
          onChange(roundToNearestMinutes(new Date(), { nearestTo: 5 }));
        }
      }

      popover.setTrue();
    }
  }, [open, date, value, onChange, popover]);

  return (
    <Container>
      <PickerButton
        label="Time"
        description={value ? format(value, 'HH:mm') : undefined}
        placeholder={placeholder}
        clearable={!!value}
        onPress={handleToggle}
        disabled={disabled}
        onClear={handleClear}
      />
      {open && (
        <Row>
          <WheelPicker
            options={hours}
            onChange={handleHourChange}
            value={valueHours}
          />
          <WheelPicker
            options={minutes}
            onChange={handleMinutesChange}
            value={valueMinutes}
          />
        </Row>
      )}
    </Container>
  );
}

const hours: Option[] = range(24).map((i) => ({ label: `${i}`, value: i }));
const minutes: Option[] = range(0, 55, 5).map((i) => ({
  label: `${i}`,
  value: i,
}));
