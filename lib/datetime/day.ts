import { Date } from '../js_utils';
import { Interval } from './interval';

export const DAY_FORMAT = 'yyyy-M-dd';

/** As `yyyy-M-dd` */
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

    while (Date.isBefore(current, endDate)) {
      days.push(fromDate(current));
      current = Date.addDays(current, 1);
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
  isWithinDayInterval: (day: Day, interval: DayInterval): boolean => {
    return Date.isWithinInterval(toDate(day), {
      start: toDate(interval.start),
      end: toDate(interval.end),
    });
  },
  today: (): Day => {
    return fromDate(Date.new());
  },
  isValid: (day: Day): boolean => {
    return isNaN(Date.parse(day)) === false;
  },
  isSame: (dayLeft: Day, dayRight: Day): boolean => {
    return dayLeft === dayRight;
  },
  isAfter: (dayLeft: Day, dayRight: Day): boolean => {
    return Date.isAfter(toDate(dayLeft), toDate(dayRight));
  },
  isBefore: (dayLeft: Day, dayRight: Day): boolean => {
    return Date.isBefore(toDate(dayLeft), toDate(dayRight));
  },
  addDays: (day: Day, amount: number): Day => {
    return fromDate(Date.addDays(toDate(day), amount));
  },
  subDays: (day: Day, amount: number): Day => {
    return fromDate(Date.subDays(toDate(day), amount));
  },
  addMonths: (day: Day, amount: number): Day => {
    return fromDate(Date.addMonths(toDate(day), amount));
  },
  subMonths: (day: Day, amount: number): Day => {
    return fromDate(Date.subMonths(toDate(day), amount));
  },
  addYears: (day: Day, amount: number): Day => {
    return fromDate(Date.addYears(toDate(day), amount));
  },
  subYears: (day: Day, amount: number): Day => {
    return fromDate(Date.subYears(toDate(day), amount));
  },
  isStartOfMonth: (day: Day): boolean => {
    return Date.isStartOfMonth(toDate(day));
  },
  fromDate,
  toDate,
};

function toDate(day: Day): Date {
  return Date.new(day);
}

function fromDate(date: Date): Day {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}` as Day;
}
