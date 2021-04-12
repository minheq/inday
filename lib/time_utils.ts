import {
  setHours,
  setMinutes,
  addHours as dateFnsAddHours,
  addMinutes as dateFnsAddMinutes,
  subMinutes as dateFnsSubMinutes,
  subHours as dateFnsSubHours,
  differenceInMinutes as dateFnsDifferenceInMinutes,
  differenceInHours as dateFnsDifferenceInHours,
  isAfter as dateFnsIsAfter,
  isBefore as dateFnsIsBefore,
  setSeconds,
  setMilliseconds,
  format,
  isSameDay,
} from 'date-fns';

export interface TimeInterval {
  start: Time;
  end: Time;
}

export type Minutes = number;
export type Hours = number;

export const TIME_HOUR_FORMAT = 'HH';
export const TIME_MINUTE_FORMAT = 'mm';
export const TIME_FORMAT = `${TIME_HOUR_FORMAT}${TIME_MINUTE_FORMAT}`;

export function formatTime(time: Time): string {
  return format(parseTime(time), 'H:mm a');
}

export function parseTime(time: Time): Date {
  return toDate(time);
}

/** Time is in `HHmm` format */
export type Time = typeof TIME_FORMAT;

export function newTime(hours: number, minutes: number): Time {
  let date = new Date();

  date = setHours(date, hours);
  date = setMinutes(date, minutes);
  date = setSeconds(date, 0);
  date = setMilliseconds(date, 0);

  return fromDate(date);
}

export function setSameTime(date: Date, time: Time): Date {
  const [hours, minutes] = getTime(time);
  date = setHours(date, hours);
  date = setMinutes(date, minutes);
  date = setSeconds(date, 0);
  date = setMilliseconds(date, 0);

  return date;
}

export function isSameTime(timeLeft: Time, timeRight: Time): boolean {
  return timeLeft === timeRight;
}

export function subMinutes(
  time: Time,
  amount: Minutes,
  capAtStartOfDay = false,
): Time {
  const date = toDate(time);
  const newDate = dateFnsSubMinutes(date, amount);

  if (isSameDay(date, newDate) === false) {
    if (capAtStartOfDay === true) {
      return '0000';
    }
    throw new Error('Adding amount moved to previous day');
  }

  return fromDate(newDate);
}

export function addMinutes(
  time: Time,
  amount: Minutes,
  capAtEndOfDay = false,
): Time {
  const date = toDate(time);
  const newDate = dateFnsAddMinutes(date, amount);

  if (isSameDay(date, newDate) === false) {
    if (capAtEndOfDay === true) {
      return '2359';
    }
    throw new Error('addMinutes moved to next day');
  }

  return fromDate(newDate);
}

export function subHours(
  time: Time,
  amount: Hours,
  capAtStartOfDay = false,
): Time {
  const date = toDate(time);
  const newDate = dateFnsSubHours(date, amount);

  if (isSameDay(date, newDate) === false) {
    if (capAtStartOfDay === true) {
      return '0000';
    }
    throw new Error('subHours moved to previous day');
  }

  return fromDate(newDate);
}

export function addHours(
  time: Time,
  amount: Hours,
  capAtEndOfDay = false,
): Time {
  const date = toDate(time);
  const newDate = dateFnsAddHours(date, amount);

  if (isSameDay(date, newDate) === false) {
    if (capAtEndOfDay === true) {
      return '2359';
    }
    throw new Error('addHours moved to next day');
  }

  return fromDate(newDate);
}

export function differenceInMinutes(timeLeft: Time, timeRight: Time): Minutes {
  const dateLeft = toDate(timeLeft);
  const dateRight = toDate(timeRight);

  return Math.abs(dateFnsDifferenceInMinutes(dateLeft, dateRight));
}

export function differenceInHours(timeLeft: Time, timeRight: Time): Hours {
  const dateLeft = toDate(timeLeft);
  const dateRight = toDate(timeRight);

  return Math.abs(dateFnsDifferenceInHours(dateLeft, dateRight));
}

export function isBefore(timeLeft: Time, timeRight: Time): boolean {
  const dateLeft = toDate(timeLeft);
  const dateRight = toDate(timeRight);

  return dateFnsIsBefore(dateLeft, dateRight);
}

export function isAfter(timeLeft: Time, timeRight: Time): boolean {
  const dateLeft = toDate(timeLeft);
  const dateRight = toDate(timeRight);

  return dateFnsIsAfter(dateLeft, dateRight);
}

export function startOfDay(): Time {
  return '0000';
}

export function endOfDay(): Time {
  return '2359';
}

function toDate(time: Time): Date {
  const [hours, minutes] = getTime(time);

  let date = new Date();

  date = setHours(date, hours);
  date = setMinutes(date, minutes);

  return date;
}

function fromDate(date: Date): Time {
  return format(date, TIME_FORMAT);
}

export function getTime(time: Time): [number, number] {
  const hours = time.substring(0, 2);
  const minutes = time.substring(2);

  return [parseInt(hours, 10), parseInt(minutes, 10)];
}
