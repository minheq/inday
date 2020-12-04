import {
  getDay,
  subDays,
  addDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from '../date_utils';
import { Day } from './day';
import { Month } from './month';

export const DEFAULT_FIRST_DAY_OF_WEEK = 1;

export enum WeekDay {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

export interface Week {
  month: Month;
  index: number;
  days: Day[];
}

export function getWeekDaysOptions(): {
  value: WeekDay;
  label: string;
}[] {
  return [
    { value: WeekDay.Monday, label: 'Monday' },
    { value: WeekDay.Tuesday, label: 'Tuesday' },
    { value: WeekDay.Wednesday, label: 'Wednesday' },
    { value: WeekDay.Thursday, label: 'Thursday' },
    { value: WeekDay.Friday, label: 'Friday' },
    { value: WeekDay.Saturday, label: 'Saturday' },
    { value: WeekDay.Sunday, label: 'Sunday' },
  ];
}

export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getFirstDateOfWeek = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date => {
  const day = getDay(date);
  const diffDays = day - firstDayOfWeek;

  const sub = diffDays < 0 ? 7 + diffDays : diffDays;

  return subDays(date, sub);
};

export const getLastDateOfWeek = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date => {
  const firstDateOfTheWeek = getFirstDateOfWeek(date, firstDayOfWeek);

  return addDays(firstDateOfTheWeek, 6);
};

export const getWeekInterval = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Interval => {
  return {
    start: startOfDay(getFirstDateOfWeek(date, firstDayOfWeek)),
    end: endOfDay(getLastDateOfWeek(date, firstDayOfWeek)),
  };
};

export const eachDayOfWeek = (
  date = new Date(),
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date[] => {
  return eachDayOfInterval(getWeekInterval(date, firstDayOfWeek));
};
