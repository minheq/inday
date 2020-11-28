import {
  setYear,
  setMonth,
  setDate,
  format,
  parseISO,
  isWithinInterval,
  isAfter,
  isBefore,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from 'date-fns';
import { Interval } from './interval';

export const DAY_FORMAT = 'yyyy-MM-dd';

/** In `yyyy-MM-dd` format */
export type Day = `${string}-${string}-${string}`;

export interface DayInterval {
  start: Day;
  end: Day;
}

export const DayInterval = {
  toDate: (interval: DayInterval): Interval => {
    return {
      start: Day.toDate(interval.start),
      end: Day.toDate(interval.end),
    };
  },
  fromDate: (interval: Interval): DayInterval => {
    return {
      start: Day.fromDate(interval.start),
      end: Day.fromDate(interval.end),
    };
  },
  eachDayOfInterval: (interval: DayInterval): Day[] => {
    const startDate = toDate(interval.start);
    const endDate = toDate(interval.end);

    const days: Day[] = [];
    let current = startDate;

    while (isBefore(current, endDate)) {
      days.push(fromDate(current));
      current = addDays(current, 1);
    }

    return days;
  },
  getDays: (interval: DayInterval, step = 1): Day[] => {
    const endDate = interval.end;

    let currentDay = interval.start;

    const days: Day[] = [];

    while (Day.isBefore(currentDay, endDate)) {
      days.push(currentDay);
      currentDay = Day.addDays(currentDay, step);
    }

    return days;
  },
};

export const Day = {
  setSameDay: (day: Day, date: Date): Date => {
    const newDate = toDate(day);

    date = setYear(date, newDate.getFullYear());
    date = setMonth(date, newDate.getMonth());
    date = setDate(date, newDate.getDate());

    return date;
  },
  isWithinDayInterval: (day: Day, interval: DayInterval): boolean => {
    return isWithinInterval(toDate(day), {
      start: toDate(interval.start),
      end: toDate(interval.end),
    });
  },
  today: (): Day => {
    return fromDate(new Date());
  },
  isSameDay: (dayLeft: Day, dayRight: Day): boolean => {
    return dayLeft === dayRight;
  },
  isAfter: (dayLeft: Day, dayRight: Day): boolean => {
    return isAfter(toDate(dayLeft), toDate(dayRight));
  },
  isBefore: (dayLeft: Day, dayRight: Day): boolean => {
    return isBefore(toDate(dayLeft), toDate(dayRight));
  },
  addDays: (day: Day, amount: number): Day => {
    return fromDate(addDays(toDate(day), amount));
  },
  subDays: (day: Day, amount: number): Day => {
    return fromDate(subDays(toDate(day), amount));
  },
  addMonths: (day: Day, amount: number): Day => {
    return fromDate(addMonths(toDate(day), amount));
  },
  subMonths: (day: Day, amount: number): Day => {
    return fromDate(subMonths(toDate(day), amount));
  },
  addYears: (day: Day, amount: number): Day => {
    return fromDate(addYears(toDate(day), amount));
  },
  subYears: (day: Day, amount: number): Day => {
    return fromDate(subYears(toDate(day), amount));
  },
  fromDate,
  toDate,
};

function toDate(day: Day): Date {
  return parseISO(day);
}

function fromDate(date: Date): Day {
  return format(date, DAY_FORMAT) as Day;
}
