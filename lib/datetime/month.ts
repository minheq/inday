import { Date, Array } from '../js_utils';
import { Day } from './day';
import { Interval } from './interval';

import {
  FirstDayOfWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  DEFAULT_FIRST_DAY_OF_WEEK,
  Week,
} from './week';

export const MONTH_FORMAT = 'yyyy-MM';

/** As `yyyy-MM` */
export type Month = `${string}-${string}`;

export interface MonthInterval {
  start: Month;
  end: Month;
}

export const Month = {
  getWeeks: (
    month: Month,
    firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  ): Week[] => {
    const dates = getDays(month, firstDayOfWeek);

    return Array.chunk(dates, 7).map((week, index) => ({
      month,
      index,
      days: week.map(Day.fromDate),
    }));
  },
  isSameMonth,
  eachMonthOfInterval: (interval: MonthInterval): Month[] => {
    const startDate = toDate(interval.start);
    const endDate = toDate(interval.end);

    const months: Month[] = [];
    let current = startDate;

    while (Date.isBefore(current, endDate)) {
      months.push(fromDate(current));
      current = Date.addMonths(current, 1);
    }

    return months;
  },
  startOfMonth: (month: Month): Day => {
    return Day.fromDate(Date.startOfMonth(toDate(month)));
  },
  endOfMonth: (month: Month): Day => {
    return Day.fromDate(Date.endOfMonth(toDate(month)));
  },
  isDayWithinMonth: (month: Month, day: Day): boolean => {
    return isSameMonth(month, getMonthFromDay(day));
  },
  addMonths: (month: Month, amount: number): Month => {
    return fromDate(Date.addMonths(toDate(month), amount));
  },
  subMonths: (month: Month, amount: number): Month => {
    return fromDate(Date.subMonths(toDate(month), amount));
  },
  getMonthFromDay,
  fromDate,
  fromDay: (day: Day): Month => {
    return fromDate(Day.toDate(day));
  },
  toDate,
  getDays,
};

function isSameMonth(monthLeft: Month, monthRight: Month): boolean {
  return monthLeft === monthRight;
}

function getMonthFromDay(day: Day): Month {
  return fromDate(Day.toDate(day));
}

function fromDate(date: Date): Month {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}` as Month;
}

function toDate(month: Month): Date {
  return Date.new(month);
}

function getDays(
  month: Month,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date[] {
  const currentDates = getMonthDatesFromDate(Month.toDate(month));
  const startOfMonthDate = currentDates[0];
  const endOfMonthDate = Date.endOfDay(currentDates[currentDates.length - 1]);

  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeek);
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeek);

  return beforeDates.concat(currentDates, afterDates);
}

function getMonthInterval(date: Date): Interval {
  return {
    start: Date.startOfMonth(date),
    end: Date.endOfMonth(date),
  };
}

function getMonthDatesFromDate(date: Date): Date[] {
  return Date.eachDayOfInterval(getMonthInterval(date));
}

function getDatesBefore(
  startOfMonthDate: Date,
  firstDayOfWeek: FirstDayOfWeek,
) {
  let beforeDates: Date[] = [];

  let from = startOfMonthDate;

  const firstDateOfWeek = getFirstDateOfWeek(from, firstDayOfWeek);

  if (!Date.isSameDay(from, firstDateOfWeek)) {
    const sub = Date.differenceInDays(from, firstDateOfWeek);
    from = Date.subDays(from, sub);
  }

  if (Date.isBefore(from, startOfMonthDate)) {
    beforeDates = Date.eachDayOfInterval({
      start: from,
      end: Date.subDays(startOfMonthDate, 1),
    });
  }

  return beforeDates;
}

function getDatesAfter(endOfMonthDate: Date, firstDayOfWeek: FirstDayOfWeek) {
  let afterDates: Date[] = [];

  let to = endOfMonthDate;

  const lastDateOfWeek = getLastDateOfWeek(to, firstDayOfWeek);
  if (!Date.isSameDay(to, lastDateOfWeek)) {
    const add = Date.differenceInDays(lastDateOfWeek, to);

    to = Date.addDays(to, add);
  }

  if (Date.isAfter(to, endOfMonthDate)) {
    afterDates = Date.eachDayOfInterval({
      start: Date.addDays(endOfMonthDate, 1),
      end: to,
    });
  }

  return afterDates;
}
