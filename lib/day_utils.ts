import {
  setYear,
  setMonth,
  setDate,
  format,
  parseISO,
  isWithinInterval,
  isAfter as dateFnsIsAfter,
  isBefore as dateFnsIsBefore,
  addDays as dateFnsAddDays,
  subDays as dateFnsSubDays,
  addMonths as dateFnsAddMonths,
  subMonths as dateFnsSubMonths,
} from 'date-fns';
import { DateInterval } from './date_utils';

export const DAY_FORMAT = 'yyyy-MM-dd';

export type DayInterval = {
  start: Day;
  end: Day;
};

export function toDateInterval(interval: DayInterval): DateInterval {
  return {
    start: toDate(interval.start),
    end: toDate(interval.end),
  };
}

export function fromDateInterval(interval: DateInterval): DayInterval {
  return {
    start: fromDate(interval.start),
    end: fromDate(interval.end),
  };
}

export function getDays(interval: DayInterval, step = 1): Day[] {
  const endDate = interval.end;

  let currentDay = interval.start;

  const days: Day[] = [];

  while (isBefore(currentDay, endDate)) {
    days.push(currentDay);
    currentDay = addDays(currentDay, step);
  }

  return days;
}

/** Day in `yyyy-MM-dd` format */
export type Day = string;

export function setSameDate(date: Date, day: Day): Date {
  const newDate = toDate(day);

  date = setYear(date, newDate.getFullYear());
  date = setMonth(date, newDate.getMonth());
  date = setDate(date, newDate.getDate());

  return date;
}

export function isWithinDayInterval(day: Day, interval: DayInterval): boolean {
  return isWithinInterval(toDate(day), {
    start: toDate(interval.start),
    end: toDate(interval.end),
  });
}

export function today(): Day {
  return fromDate(new Date());
}

export function isSameDay(dayLeft: Day, dayRight: Day): boolean {
  return dayLeft === dayRight;
}

export function isAfter(dayLeft: Day, dayRight: Day): boolean {
  return dateFnsIsAfter(toDate(dayLeft), toDate(dayRight));
}

export function isBefore(dayLeft: Day, dayRight: Day): boolean {
  return dateFnsIsBefore(toDate(dayLeft), toDate(dayRight));
}

export function addDays(day: Day, amount: number): Day {
  return fromDate(dateFnsAddDays(toDate(day), amount));
}

export function subDays(day: Day, amount: number): Day {
  return fromDate(dateFnsSubDays(toDate(day), amount));
}

export function addMonths(day: Day, amount: number): Day {
  return fromDate(dateFnsAddMonths(toDate(day), amount));
}

export function subMonths(day: Day, amount: number): Day {
  return fromDate(dateFnsSubMonths(toDate(day), amount));
}

function toDate(day: Day): Date {
  return parseISO(day);
}

function fromDate(date: Date): Day {
  return format(date, DAY_FORMAT);
}
