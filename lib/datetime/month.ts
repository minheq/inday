import { DateUtils, ArrayUtils } from '../js_utils';
import { Day } from './day';
import { Interval } from './interval';

import {
  FirstDayOfWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  DEFAULT_FIRST_DAY_OF_WEEK,
  Week,
} from './week';
import { Year } from './year';

export const MONTH_FORMAT = 'yyyy-MM';

/** As `yyyy-MM` */
export type Month = `${string}-${string}`;

export interface MonthInterval {
  start: Month;
  end: Month;
}

export const Month = {
  today: (): Month => {
    return fromDate(new Date());
  },
  startOfYear: (month?: Month): Month => {
    if (month !== undefined) {
      return `${getYear(month)}-1` as Month;
    }

    return `${getYear(fromDate(new Date()))}-1` as Month;
  },
  endOfYear: (month?: Month): Month => {
    if (month !== undefined) {
      return `${getYear(month)}-12` as Month;
    }

    return `${getYear(fromDate(new Date()))}-12` as Month;
  },
  getWeeks: (
    month: Month,
    firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  ): Week[] => {
    const dates = getDays(month, firstDayOfWeek);

    return ArrayUtils.chunk(dates, 7).map((week, index) => ({
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

    while (DateUtils.isBefore(current, endDate)) {
      months.push(fromDate(current));
      current = DateUtils.addMonths(current, 1);
    }

    return months;
  },
  getMonth: (month: Month): number => {
    return Month.toDate(month).getMonth();
  },
  getYear: (month: Month): number => {
    return Month.toDate(month).getFullYear();
  },
  isValid: (day: Day): boolean => {
    return isNaN(DateUtils.parse(day)) === false;
  },
  isSame: (monthLeft: Month, monthRight: Month): boolean => {
    return monthLeft === monthRight;
  },
  isAfter: (monthLeft: Month, monthRight: Month): boolean => {
    return DateUtils.isAfter(toDate(monthLeft), toDate(monthRight));
  },
  isBefore: (monthLeft: Month, monthRight: Month): boolean => {
    return DateUtils.isBefore(toDate(monthLeft), toDate(monthRight));
  },
  setMonth: (month: Month, monthNum: number): Month => {
    const date = Month.toDate(month);
    date.setMonth(monthNum);
    return Month.fromDate(date);
  },
  setYear: (month: Month, fullYear: number): Month => {
    const date = Month.toDate(month);
    date.setFullYear(fullYear);
    return Month.fromDate(date);
  },
  startOfMonth: (month: Month): Day => {
    return Day.fromDate(DateUtils.startOfMonth(toDate(month)));
  },
  endOfMonth: (month: Month): Day => {
    return Day.fromDate(DateUtils.endOfMonth(toDate(month)));
  },
  isDayWithinMonth: (month: Month, day: Day): boolean => {
    return isSameMonth(month, getMonthFromDay(day));
  },
  addMonths: (month: Month, amount: number): Month => {
    return fromDate(DateUtils.addMonths(toDate(month), amount));
  },
  subMonths: (month: Month, amount: number): Month => {
    return fromDate(DateUtils.subMonths(toDate(month), amount));
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
  return DateUtils.new(month);
}

function getDays(
  month: Month,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date[] {
  const currentDates = getMonthDatesFromDate(Month.toDate(month));
  const startOfMonthDate = currentDates[0];
  const endOfMonthDate = DateUtils.endOfDay(
    currentDates[currentDates.length - 1],
  );

  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeek);
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeek);

  return beforeDates.concat(currentDates, afterDates);
}

function getMonthInterval(date: Date): Interval {
  return {
    start: DateUtils.startOfMonth(date),
    end: DateUtils.endOfMonth(date),
  };
}

function getMonthDatesFromDate(date: Date): Date[] {
  return DateUtils.eachDayOfInterval(getMonthInterval(date));
}

function getDatesBefore(
  startOfMonthDate: Date,
  firstDayOfWeek: FirstDayOfWeek,
) {
  let beforeDates: Date[] = [];

  let from = startOfMonthDate;

  const firstDateOfWeek = getFirstDateOfWeek(from, firstDayOfWeek);

  if (!DateUtils.isSameDay(from, firstDateOfWeek)) {
    const sub = DateUtils.differenceInDays(from, firstDateOfWeek);
    from = DateUtils.subDays(from, sub);
  }

  if (DateUtils.isBefore(from, startOfMonthDate)) {
    beforeDates = DateUtils.eachDayOfInterval({
      start: from,
      end: DateUtils.subDays(startOfMonthDate, 1),
    });
  }

  return beforeDates;
}

function getDatesAfter(endOfMonthDate: Date, firstDayOfWeek: FirstDayOfWeek) {
  let afterDates: Date[] = [];

  let to = endOfMonthDate;

  const lastDateOfWeek = getLastDateOfWeek(to, firstDayOfWeek);
  if (!DateUtils.isSameDay(to, lastDateOfWeek)) {
    const add = DateUtils.differenceInDays(lastDateOfWeek, to);

    to = DateUtils.addDays(to, add);
  }

  if (DateUtils.isAfter(to, endOfMonthDate)) {
    afterDates = DateUtils.eachDayOfInterval({
      start: DateUtils.addDays(endOfMonthDate, 1),
      end: to,
    });
  }

  return afterDates;
}

function getYear(month: Month): Year {
  const date = toDate(month);

  return `${date.getFullYear()}`;
}
