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
} from 'date-fns';
import { Interval } from './interval';

export const DAY_FORMAT = 'yyyy-MM-dd';

export type DayInterval = {
  start: Day;
  end: Day;
};

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

/** Day in `yyyy-MM-dd` format */
export type Day = string;

export const Day = {
  setSameDay: (day: Day, date: Date) => {
    const newDate = toDate(day);

    date = setYear(date, newDate.getFullYear());
    date = setMonth(date, newDate.getMonth());
    date = setDate(date, newDate.getDate());

    return date;
  },
  isWithinDayInterval: (day: Day, interval: DayInterval) => {
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
  addDays: (day: Day, amount: number) => {
    return fromDate(addDays(toDate(day), amount));
  },
  subDays: (day: Day, amount: number) => {
    return fromDate(subDays(toDate(day), amount));
  },
  addMonths: (day: Day, amount: number) => {
    return fromDate(addMonths(toDate(day), amount));
  },
  subMonths: (day: Day, amount: number) => {
    return fromDate(subMonths(toDate(day), amount));
  },
  fromDate,
  toDate,
};

function toDate(day: Day): Date {
  const date = parseISO(day);

  return date;
}

function fromDate(date: Date): Day {
  return format(date, DAY_FORMAT);
}
