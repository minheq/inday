import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  subDays,
  endOfDay,
  setYear,
  setMonth,
  addMonths,
  subMonths,
  startOfDay,
  getDay,
  differenceInMinutes,
  addHours,
  setHours,
  setMinutes,
  addMinutes,
  setSeconds,
  setMilliseconds,
  subMinutes,
  subHours,
  differenceInHours,
  addYears,
  subYears,
  setDate,
  isWithinInterval,
  getDate,
} from 'date-fns';
import { DateNative } from './date_native';

function newDate(): Date;
function newDate(value: number | string): Date;
function newDate(
  year: number,
  month: number,
  date?: number,
  hours?: number,
  minutes?: number,
  seconds?: number,
  ms?: number,
): Date;
function newDate(...args: any[]): Date {
  return new DateNative(...args);
}

function isDate(value: unknown): value is Date {
  return value instanceof DateNative;
}

function format(
  date: Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locales, options).format(date);
}

function formatRelative(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locales?: string | string[],
  options?: Intl.RelativeTimeFormatOptions,
): string {
  return new Intl.RelativeTimeFormat(locales, options).format(value, unit);
}

export const Date = {
  new: newDate,
  today: (): Date => {
    return newDate();
  },
  isDate,
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  subDays,
  endOfDay,
  format,
  formatRelative,
  setYear,
  getDate,
  setMonth,
  addMonths,
  subMonths,
  startOfDay,
  getDay,
  differenceInMinutes,
  addHours,
  setHours,
  setMinutes,
  addMinutes,
  setSeconds,
  setMilliseconds,
  subMinutes,
  subHours,
  differenceInHours,
  addYears,
  subYears,
  setDate,
  isWithinInterval,
};
