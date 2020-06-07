import React from 'react';
import { Picker } from './picker';
import { addMinutes, startOfDay, endOfDay, isBefore, format } from 'date-fns';
import { toTime, parseTime, isSameTime, setSameTime } from '../utils/time';
import { setSameDay } from '../utils/day';

interface TimePickerProps {
  /** Sets year, month and day of this date on the operated values */
  date?: Date;
  value?: Date;
  onChange?: (value: Date) => void;
  /** Minimum difference in minutes between time options. */
  step?: number;
  startTime?: Date;
  display?: (value: Date) => string;
  isBlocked?: (value: Date) => boolean;
  endTime?: Date;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Control for selecting a time.
 */
export function TimePicker(props: TimePickerProps) {
  const {
    value,
    date,
    step = 60,
    onChange = () => {},
    startTime,
    endTime,
    display = (val: Date) => format(val, 'HH:mm'),
    isBlocked,
    placeholder,
    disabled = false,
  } = props;

  const effectiveDate = date ?? new Date();

  const hours = disabled
    ? []
    : getHours({
        date: effectiveDate,
        display,
        step,
        startTime,
        endTime,
        isBlocked,
      });

  return (
    <Picker
      label="Time"
      options={hours}
      placeholder={placeholder}
      disabled={disabled}
      display={(val) => display(setSameTime(effectiveDate, parseTime(val)))}
      value={value ? toTime(value) : undefined}
      onChange={(time) => onChange(setSameTime(effectiveDate, parseTime(time)))}
    />
  );
}
interface HourOption {
  value: string;
  label: string;
  disabled: boolean;
}

function getHours(params: {
  date: Date;
  step?: number;
  startTime?: Date;
  endTime?: Date;
  display?: (value: Date) => string;
  isBlocked?: (time: Date) => boolean;
}): HourOption[] {
  const {
    date,
    step = 30,
    isBlocked = () => false,
    startTime,
    endTime,
    display,
  } = params;

  const hours: HourOption[] = [];
  const start = startTime ? setSameDay(startTime, date) : startOfDay(date);

  const end = endTime ? setSameDay(endTime, date) : endOfDay(date);

  let current = start;

  while (isBefore(current, end) || isSameTime(current, end)) {
    hours.push({
      value: toTime(current),
      label: display ? display(current) : toTime(current),
      disabled: isBlocked(current),
    });

    const next = addMinutes(current, step);

    current = next;
  }

  return hours;
}
