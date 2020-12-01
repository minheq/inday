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
  format,
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
  parseISO,
  isWithinInterval,
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
  parseISO,
  isWithinInterval,
};
