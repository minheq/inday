import {
  addHours,
  setHours,
  setMinutes,
  startOfDay,
  addMinutes,
  Interval,
  setSeconds,
  setMilliseconds,
  isSameHour,
  isSameMinute,
  format,
} from 'date-fns';
import { datesInInterval } from './interval';

export const MINUTES_IN_ONE_DAY = 24 * 60;
export const MINUTES_IN_ONE_HOUR = 60;

export const TIME_HOUR_FORMAT = 'HH';
export const TIME_MINUTE_FORMAT = 'mm';
export const TIME_FORMAT = `${TIME_HOUR_FORMAT}${TIME_MINUTE_FORMAT}`;

/**
 * Creates a new [Date] with the given time
 */
function newTime(hours: number, minutes: number): Date {
  let date = new Date();

  date = setHours(date, hours);
  date = setMinutes(date, minutes);
  date = setSeconds(date, 0);
  date = setMilliseconds(date, 0);

  return date;
}

export function setSameTime(date: Date, toTime: Date) {
  date = setHours(date, toTime.getHours());
  date = setMinutes(date, toTime.getMinutes());
  date = setSeconds(date, 0);
  date = setMilliseconds(date, 0);

  return date;
}

export function isSameTime(dateLeft: Date, dateRight: Date) {
  return isSameHour(dateLeft, dateRight) && isSameMinute(dateLeft, dateRight);
}

export function parseTime(time: string): Date {
  const [hours, minutes] = getTime(time);

  return newTime(Number(hours), Number(minutes));
}

export function toTime(date: Date): string {
  return format(date, TIME_FORMAT);
}

export function toHours(minutes: number) {
  return minutes / MINUTES_IN_ONE_HOUR;
}

export function toMinutes(hours: number) {
  return hours * MINUTES_IN_ONE_HOUR;
}

export function getTime(time: string): [string, string] {
  const hours = time.substring(0, 2);
  const minutes = time.substring(2);

  return [hours, minutes];
}

export function isValidTime(time: string): boolean {
  const [hours, minutes] = getTime(time);
  if (isNaN(Number(hours[0]))) return false;
  if (Number(hours[0]) > 2) return false;
  if (isNaN(Number(hours[1]))) return false;

  if (isNaN(Number(minutes[0]))) return false;
  if (Number(minutes[0]) > 6) return false;
  if (isNaN(Number(minutes[1]))) return false;

  return true;
}

export const setTime = (
  date: Date,
  hours: number,
  minutes = 0,
  seconds = 0,
  ms = 0,
) => {
  return setMilliseconds(
    setSeconds(setMinutes(setHours(date, hours), minutes), seconds),
    ms,
  );
};

export const eachHourOfInterval = (interval: Interval, step = 1) =>
  datesInInterval(interval, addHours, step);

export const eachMinuteOfInterval = (interval: Interval, step = 5) =>
  datesInInterval(interval, addMinutes, step);

export const getHoursInDay = (date: Date = new Date()) =>
  eachHourOfInterval({
    start: setTime(startOfDay(date), 0),
    end: setTime(startOfDay(date), 24),
  });

export const getMinutesInHour = (date: Date = new Date()) =>
  eachMinuteOfInterval({
    start: setTime(startOfDay(date), 0),
    end: setTime(startOfDay(date), 1),
  });
