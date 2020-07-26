import React from 'react';
import { Option } from './picker';
import { Container } from './container';
import { PickerButton } from './picker_button';
import { useToggle } from '../hooks/use_toggle';
import { WheelPicker } from './wheel_picker';
import { Row } from './row';
import { range } from '../../lib/data_structures/arrays';
import { format, roundToNearestMinutes, setHours, setMinutes } from 'date-fns';
import { Expand } from './expand';

interface TimePickerProps {
  /** Sets year, month and day of this date on the operated values */
  value?: Date;
  onChange?: (value?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
}

/**
 * Control for selecting a time.
 */
export function TimePicker(props: TimePickerProps) {
  const {
    value,
    onChange = () => {},
    placeholder,
    clearable,
    disabled = false,
  } = props;
  const [open, popover] = useToggle();

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

  const handleClear = React.useCallback(() => {
    onChange();
    popover.setFalse();
  }, [onChange, popover]);

  const handleToggle = React.useCallback(() => {
    if (open) {
      popover.setFalse();
    } else {
      if (!value) {
        onChange(roundToNearestMinutes(new Date(), { nearestTo: 5 }));
      }

      popover.setTrue();
    }
  }, [open, value, onChange, popover]);

  return (
    <Container>
      <PickerButton
        label="Time"
        description={value ? format(value, 'HH:mm') : undefined}
        placeholder={placeholder}
        clearable={clearable && !!value}
        open={open}
        onPress={handleToggle}
        disabled={disabled}
        onClear={handleClear}
      />
      <Expand open={open}>
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
      </Expand>
    </Container>
  );
}

const hours: Option[] = range(24).map((i) => ({ label: `${i}`, value: i }));
const minutes: Option[] = range(0, 60, 5).map((i) => ({
  label: `${i}`,
  value: i,
}));
