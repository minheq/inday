import {
  isValid as dateFnsIsValid,
  formatISO as dateFnsFormatISO,
  addDays as dateFnsAddDays,
  startOfYear as dateFnsStartOfYear,
  endOfYear as dateFnsEndOfYear,
  differenceInDays as dateFnsDifferenceInDays,
  eachDayOfInterval as dateFnsEachDayOfInterval,
  eachYearOfInterval as dateFnsEachYearOfInterval,
  eachMonthOfInterval as dateFnsEachMonthOfInterval,
  endOfMonth as dateFnsEndOfMonth,
  isAfter as dateFnsIsAfter,
  isBefore as dateFnsIsBefore,
  format as dateFnsFormat,
  isSameDay as dateFnsIsSameDay,
  startOfMonth as dateFnsStartOfMonth,
  subDays as dateFnsSubDays,
  endOfDay as dateFnsEndOfDay,
  setYear as dateFnsSetYear,
  setMonth as dateFnsSetMonth,
  addMonths as dateFnsAddMonths,
  subMonths as dateFnsSubMonths,
  startOfDay as dateFnsStartOfDay,
  getDay as dateFnsGetDay,
  differenceInMinutes as dateFnsDifferenceInMinutes,
  addHours as dateFnsAddHours,
  setHours as dateFnsSetHours,
  setMinutes as dateFnsSetMinutes,
  addMinutes as dateFnsAddMinutes,
  setSeconds as dateFnsSetSeconds,
  setMilliseconds as dateFnsSetMilliseconds,
  subMinutes as dateFnsSubMinutes,
  subHours as dateFnsSubHours,
  differenceInHours as dateFnsDifferenceInHours,
  addYears as dateFnsAddYears,
  subYears as dateFnsSubYears,
  setDate as dateFnsSetDate,
  isWithinInterval as dateFnsIsWithinInterval,
  getDate as dateFnsGetDate,
} from "date-fns";

export function isValidDate(date: unknown): boolean {
  return dateFnsIsValid(date);
}

export function addDays(date: Date, amount: number): Date {
  return dateFnsAddDays(date, amount);
}

export function startOfYear(date: Date): Date {
  return dateFnsStartOfYear(date);
}

export function endOfYear(date: Date): Date {
  return dateFnsEndOfYear(date);
}

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  return dateFnsDifferenceInDays(dateLeft, dateRight);
}

export function eachDayOfInterval(interval: DateInterval): Date[] {
  return dateFnsEachDayOfInterval(interval);
}

export function eachYearOfInterval(interval: DateInterval): Date[] {
  return dateFnsEachYearOfInterval(interval);
}

export function eachMonthOfInterval(interval: DateInterval): Date[] {
  return dateFnsEachMonthOfInterval(interval);
}

export function endOfMonth(date: Date): Date {
  return dateFnsEndOfMonth(date);
}

export function isAfter(date: Date, dateToCompare: Date): boolean {
  return dateFnsIsAfter(date, dateToCompare);
}

export function isBefore(date: Date, dateToCompare: Date): boolean {
  return dateFnsIsBefore(date, dateToCompare);
}

export function formatPattern(date: Date, pattern: string): string {
  return dateFnsFormat(date, pattern);
}

export function isSameDay(dateLeft: Date, dateRight: Date): boolean {
  return dateFnsIsSameDay(dateLeft, dateRight);
}

export function startOfMonth(date: Date): Date {
  return dateFnsStartOfMonth(date);
}

export function subDays(date: Date, amount: number): Date {
  return dateFnsSubDays(date, amount);
}

export function endOfDay(date: Date): Date {
  return dateFnsEndOfDay(date);
}

export function setYear(date: Date, year: number): Date {
  return dateFnsSetYear(date, year);
}

export function setMonth(date: Date, month: number): Date {
  return dateFnsSetMonth(date, month);
}

export function addMonths(date: Date, amount: number): Date {
  return dateFnsAddMonths(date, amount);
}

export function subMonths(date: Date, amount: number): Date {
  return dateFnsSubMonths(date, amount);
}

export function startOfDay(date: Date): Date {
  return dateFnsStartOfDay(date);
}

export function getDay(date: Date): DayOfWeek {
  return dateFnsGetDay(date);
}

export function differenceInMinutes(dateLeft: Date, dateRight: Date): number {
  return dateFnsDifferenceInMinutes(dateLeft, dateRight);
}

export function addHours(date: Date, amount: number): Date {
  return dateFnsAddHours(date, amount);
}

export function setHours(date: Date, seconds: number): Date {
  return dateFnsSetHours(date, seconds);
}

export function setMinutes(date: Date, amount: number): Date {
  return dateFnsSetMinutes(date, amount);
}

export function addMinutes(date: Date, amount: number): Date {
  return dateFnsAddMinutes(date, amount);
}

export function setSeconds(date: Date, seconds: number): Date {
  return dateFnsSetSeconds(date, seconds);
}

export function setMilliseconds(date: Date, milliseconds: number): Date {
  return dateFnsSetMilliseconds(date, milliseconds);
}

export function subMinutes(date: Date, amount: number): Date {
  return dateFnsSubMinutes(date, amount);
}

export function subHours(date: Date, amount: number): Date {
  return dateFnsSubHours(date, amount);
}

export function differenceInHours(dateLeft: Date, dateRight: Date): number {
  return dateFnsDifferenceInHours(dateLeft, dateRight);
}

export function addYears(date: Date, amount: number): Date {
  return dateFnsAddYears(date, amount);
}

export function subYears(date: Date, amount: number): Date {
  return dateFnsSubYears(date, amount);
}

export function setDate(date: Date, dayOfMonth: number): Date {
  return dateFnsSetDate(date, dayOfMonth);
}

export function isWithinDateInterval(
  date: Date,
  interval: DateInterval
): boolean {
  return dateFnsIsWithinInterval(date, interval);
}

export function getDate(date: Date): number {
  return dateFnsGetDate(date);
}

export interface DateInterval {
  start: Date;
  end: Date;
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

// https://tc39.es/ecma402/#datetimeformat-objects
export interface DateTimeFormatOptions {
  weekday?: "narrow" | "short" | "long";
  year?: "2-digit" | "numeric";
  month?: "2-digit" | "numeric" | "narrow" | "short" | "long";
  day?: "2-digit" | "numeric";
  hour?: "2-digit" | "numeric";
  minute?: "2-digit" | "numeric";
  second?: "2-digit" | "numeric";
  hourCycle?: HourCycle;
}

export function formatDate(
  date: Date,
  locales?: string | string[],
  options?: DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locales, options).format(date);
}

export function formatRelative(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locales?: string | string[],
  options?: Intl.RelativeTimeFormatOptions
): string {
  return new Intl.RelativeTimeFormat(locales, options).format(value, unit);
}

export type ISODate = string;

export function formatISODate(
  date: Date,
  representation: "complete" | "date" | "time" = "date"
): ISODate {
  return dateFnsFormatISO(date, { representation });
}

export function parseISODate(isoDate: ISODate): Date {
  return new Date(isoDate);
}

export function parseISODateInterval(
  isoDateInterval: ISODateInterval
): DateInterval {
  return {
    start: parseISODate(isoDateInterval.start),
    end: parseISODate(isoDateInterval.end),
  };
}

export type DayInputFormat = "m/d/y" | "y/m/d" | "d/m/y";
export type HourCycle = "h12" | "h24";
export type DateInputFormat = DayInputFormat | `${DayInputFormat} ${HourCycle}`;

export interface ISODateInterval {
  start: string;
  end: string;
}

/**
 * Used for parsing text input.
 * TODO: add support for time and ms
 */
export function parseString(
  value: string,
  format: DateInputFormat
): Date | Error {
  const params = value.split(/[.\-/]/);
  if (params.length !== 3) {
    return new Error(
      'Invalid date string. There should be 3 delimiters "-", "/" or "."'
    );
  }

  let day: number;
  let month: number;
  let year: number;

  if (format === "d/m/y") {
    day = parseInt(params[0], 10);
    month = parseInt(params[1], 10);
    year = parseInt(params[2], 10);
  } else if (format === "m/d/y") {
    day = parseInt(params[1], 10);
    month = parseInt(params[0], 10);
    year = parseInt(params[2], 10);
  } else if (format === "y/m/d") {
    day = parseInt(params[2], 10);
    month = parseInt(params[1], 10);
    year = parseInt(params[0], 10);
  } else {
    return new Error(
      'Invalid date input format. It has to be one of "m/d/y", "y/m/d" or "d/m/y"'
    );
  }

  if (isNaN(day) || day < 1) {
    return new Error("Day is not valid. Ensure only numeric input for day.");
  } else if (isNaN(month) || month < 1) {
    return new Error(
      "Month is not valid. Ensure only numeric input for month."
    );
  } else if (isNaN(year) || year < 1) {
    return new Error("Year is not valid. Ensure only numeric input for year.");
  }

  if (year < 100) {
    year += 2000;
  }

  const date = new Date(`${year}-${month}-${day}`);

  if (isValidDate(date) === false) {
    return new Error("Date is not valid.");
  }

  return date;
}

export function isISODate(value: unknown): value is ISODate {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);

  return isDate(date);
}

export function isISODateInterval(value: unknown): value is ISODateInterval {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const start = new Date((value as Record<string, string>).start);
  const end = new Date((value as Record<string, string>).end);

  return isDate(start) && isDate(end);
}

export function isStartOfMonth(date: Date): boolean {
  return date.getDate() === 1;
}

export function getFirstDateOfWeek(
  date: Date,
  firstDayOfWeek: DayOfWeek
): Date {
  const day = getDay(date);
  const diffDays = day - firstDayOfWeek;

  const sub = diffDays < 0 ? 7 + diffDays : diffDays;

  return subDays(date, sub);
}

export function getLastDateOfWeek(date: Date, firstDayOfWeek: DayOfWeek): Date {
  const firstDateOfTheWeek = getFirstDateOfWeek(date, firstDayOfWeek);

  return addDays(firstDateOfTheWeek, 6);
}

export function setSameDate(date: Date, toDate: Date): Date {
  date = setYear(date, toDate.getFullYear());
  date = setMonth(date, toDate.getMonth());
  date = setDate(date, toDate.getDate());

  return date;
}

// eslint-disable-next-line
export enum WeekDay {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// eslint-disable-next-line
export enum Frequency {
  Yearly = "YEARLY",
  Monthly = "MONTHLY",
  Weekly = "WEEKLY",
  Daily = "DAILY",
}

export interface Recurrence {
  startDate: Date;
  frequency: Frequency;
  interval?: number | null;
  count?: number | null;
  weekStart?: WeekDay | null;
  until?: Date | null;
  timezoneID?: string | null;
  bySetPosition?: number[] | null;
  byMonth?: number[] | null;
  byMonthDay?: number[] | null;
  byYearDay?: number[] | null;
  byWeekNumber?: number[] | null;
  byWeekDay?: WeekDay[] | null;
  byHour?: number[] | null;
  byMinute?: number[] | null;
  bySecond?: number[] | null;
}
