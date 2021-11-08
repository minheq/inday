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
    start: parseDay(interval.start),
    end: parseDay(interval.end),
  };
}

export function fromDateInterval(interval: DateInterval): DayInterval {
  return {
    start: toDay(interval.start),
    end: toDay(interval.end),
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
  const newDate = parseDay(day);

  date = setYear(date, newDate.getFullYear());
  date = setMonth(date, newDate.getMonth());
  date = setDate(date, newDate.getDate());

  return date;
}

export function isWithinDayInterval(day: Day, interval: DayInterval): boolean {
  return isWithinInterval(parseDay(day), {
    start: parseDay(interval.start),
    end: parseDay(interval.end),
  });
}

export function today(): Day {
  return toDay(new Date());
}

export function isSameDay(dayLeft: Day, dayRight: Day): boolean {
  return dayLeft === dayRight;
}

export function isAfter(dayLeft: Day, dayRight: Day): boolean {
  return dateFnsIsAfter(parseDay(dayLeft), parseDay(dayRight));
}

export function isBefore(dayLeft: Day, dayRight: Day): boolean {
  return dateFnsIsBefore(parseDay(dayLeft), parseDay(dayRight));
}

export function addDays(day: Day, amount: number): Day {
  return toDay(dateFnsAddDays(parseDay(day), amount));
}

export function subDays(day: Day, amount: number): Day {
  return toDay(dateFnsSubDays(parseDay(day), amount));
}

export function addMonths(day: Day, amount: number): Day {
  return toDay(dateFnsAddMonths(parseDay(day), amount));
}

export function subMonths(day: Day, amount: number): Day {
  return toDay(dateFnsSubMonths(parseDay(day), amount));
}

export function parseDay(day: Day): Date {
  return parseISO(day);
}

export function toDay(date: Date): Day {
  return format(date, DAY_FORMAT);
}
