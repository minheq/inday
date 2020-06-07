import {
  addDays,
  eachDayOfInterval,
  getDay,
  subDays,
  startOfDay,
  endOfDay,
  Interval,
} from 'date-fns';

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

export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getFirstDateOfWeek = (
  date: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
) => {
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
) => {
  return eachDayOfInterval(getWeekInterval(date, firstDayOfWeek));
};
