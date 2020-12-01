import {
  chunk,
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
} from '../js_utils';
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

/** In `yyyy-MM` format */
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

    return chunk(dates, 7).map((week, index) => ({
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

    while (isBefore(current, endDate)) {
      months.push(fromDate(current));
      current = addMonths(current, 1);
    }

    return months;
  },
  startOfMonth: (month: Month): Day => {
    return Day.fromDate(startOfMonth(toDate(month)));
  },
  endOfMonth: (month: Month): Day => {
    return Day.fromDate(endOfMonth(toDate(month)));
  },
  isDayWithinMonth: (month: Month, day: Day): boolean => {
    return isSameMonth(month, getMonthFromDay(day));
  },
  addMonths: (month: Month, amount: number): Month => {
    return fromDate(addMonths(toDate(month), amount));
  },
  subMonths: (month: Month, amount: number): Month => {
    return fromDate(subMonths(toDate(month), amount));
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
  return format(Day.toDate(day), MONTH_FORMAT) as Month;
}

function fromDate(date: Date): Month {
  return format(date, MONTH_FORMAT) as Month;
}

function toDate(month: Month): Date {
  let date = new Date();
  const m = parseInt(month.substring(5), 10) - 1;
  const y = parseInt(month.substring(0, 4), 10);

  date = setYear(date, y);
  date = setMonth(date, m);

  return date;
}

function getDays(
  month: Month,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date[] {
  const currentDates = getMonthDatesFromDate(Month.toDate(month));
  const startOfMonthDate = currentDates[0];
  const endOfMonthDate = endOfDay(currentDates[currentDates.length - 1]);

  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeek);
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeek);

  return beforeDates.concat(currentDates, afterDates);
}

function getMonthInterval(date: Date): Interval {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

function getMonthDatesFromDate(date: Date): Date[] {
  return eachDayOfInterval(getMonthInterval(date));
}

function getDatesBefore(
  startOfMonthDate: Date,
  firstDayOfWeek: FirstDayOfWeek,
) {
  let beforeDates: Date[] = [];

  let from = startOfMonthDate;

  const firstDateOfWeek = getFirstDateOfWeek(from, firstDayOfWeek);

  if (!isSameDay(from, firstDateOfWeek)) {
    const sub = differenceInDays(from, firstDateOfWeek);
    from = subDays(from, sub);
  }

  if (isBefore(from, startOfMonthDate)) {
    beforeDates = eachDayOfInterval({
      start: from,
      end: subDays(startOfMonthDate, 1),
    });
  }

  return beforeDates;
}

function getDatesAfter(endOfMonthDate: Date, firstDayOfWeek: FirstDayOfWeek) {
  let afterDates: Date[] = [];

  let to = endOfMonthDate;

  const lastDateOfWeek = getLastDateOfWeek(to, firstDayOfWeek);
  if (!isSameDay(to, lastDateOfWeek)) {
    const add = differenceInDays(lastDateOfWeek, to);

    to = addDays(to, add);
  }

  if (isAfter(to, endOfMonthDate)) {
    afterDates = eachDayOfInterval({
      start: addDays(endOfMonthDate, 1),
      end: to,
    });
  }

  return afterDates;
}
