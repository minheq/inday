import { DateUtils } from '../js_utils';
import { Hours } from './hours';
import { Minutes } from './minutes';

export interface TimeInterval {
  start: Time;
  end: Time;
}

export const TIME_HOUR_FORMAT = 'HH';
export const TIME_MINUTE_FORMAT = 'mm';
export const TIME_FORMAT = `${TIME_HOUR_FORMAT}${TIME_MINUTE_FORMAT}`;

/** Time is in `HHmm` format */
export type Time = typeof TIME_FORMAT;

export const Time = {
  /**
   * Creates a new Time
   */
  new: (hours: number, minutes: number): Time => {
    let date = new Date();

    date = DateUtils.setHours(date, hours);
    date = DateUtils.setMinutes(date, minutes);
    date = DateUtils.setSeconds(date, 0);
    date = DateUtils.setMilliseconds(date, 0);

    return fromDate(date);
  },
  setSameTime: (date: Date, time: Time): Date => {
    const [hours, minutes] = getTime(time);
    date = DateUtils.setHours(date, hours);
    date = DateUtils.setMinutes(date, minutes);
    date = DateUtils.setSeconds(date, 0);
    date = DateUtils.setMilliseconds(date, 0);

    return date;
  },
  isSameTime: (timeLeft: Time, timeRight: Time): boolean => {
    return timeLeft === timeRight;
  },
  toDate,
  fromDate,
  get: getTime,
  subMinutes: (time: Time, amount: Minutes, capAtStartOfDay = false): Time => {
    const date = toDate(time);
    const newDate = DateUtils.subMinutes(date, amount);

    if (DateUtils.isSameDay(date, newDate) === false) {
      if (capAtStartOfDay === true) {
        return '0000';
      }
      throw new Error('Adding amount moved to previous day');
    }

    return fromDate(newDate);
  },
  addMinutes: (time: Time, amount: Minutes, capAtEndOfDay = false): Time => {
    const date = toDate(time);
    const newDate = DateUtils.addMinutes(date, amount);

    if (DateUtils.isSameDay(date, newDate) === false) {
      if (capAtEndOfDay === true) {
        return '2359';
      }
      throw new Error('addMinutes moved to next day');
    }

    return fromDate(newDate);
  },
  subHours: (time: Time, amount: Hours, capAtStartOfDay = false): Time => {
    const date = toDate(time);
    const newDate = DateUtils.subHours(date, amount);

    if (DateUtils.isSameDay(date, newDate) === false) {
      if (capAtStartOfDay === true) {
        return '0000';
      }
      throw new Error('subHours moved to previous day');
    }

    return fromDate(newDate);
  },
  addHours: (time: Time, amount: Hours, capAtEndOfDay = false): Time => {
    const date = toDate(time);
    const newDate = DateUtils.addHours(date, amount);

    if (DateUtils.isSameDay(date, newDate) === false) {
      if (capAtEndOfDay === true) {
        return '2359';
      }
      throw new Error('addHours moved to next day');
    }

    return fromDate(newDate);
  },
  differenceInMinutes: (timeLeft: Time, timeRight: Time): Minutes => {
    const dateLeft = toDate(timeLeft);
    const dateRight = toDate(timeRight);

    return Math.abs(DateUtils.differenceInMinutes(dateLeft, dateRight));
  },
  differenceInHours: (timeLeft: Time, timeRight: Time): Hours => {
    const dateLeft = toDate(timeLeft);
    const dateRight = toDate(timeRight);

    return Math.abs(DateUtils.differenceInHours(dateLeft, dateRight));
  },
  isBefore: (timeLeft: Time, timeRight: Time): boolean => {
    const dateLeft = toDate(timeLeft);
    const dateRight = toDate(timeRight);

    return DateUtils.isBefore(dateLeft, dateRight);
  },
  isAfter: (timeLeft: Time, timeRight: Time): boolean => {
    const dateLeft = toDate(timeLeft);
    const dateRight = toDate(timeRight);

    return DateUtils.isAfter(dateLeft, dateRight);
  },
  startOfDay: (): Time => {
    return '0000';
  },
  endOfDay: (): Time => {
    return '2359';
  },
};

function toDate(time: Time): Date {
  const [hours, minutes] = getTime(time);

  let date = new Date();

  date = DateUtils.setHours(date, hours);
  date = DateUtils.setMinutes(date, minutes);

  return date;
}

function fromDate(date: Date): Time {
  return DateUtils.format(date, undefined, {
    minute: 'numeric',
    hour: 'numeric',
    hour12: false,
  });
}

export function getTime(time: Time): [number, number] {
  const hours = time.substring(0, 2);
  const minutes = time.substring(2);

  return [parseInt(hours, 10), parseInt(minutes, 10)];
}
