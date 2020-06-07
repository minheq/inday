import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  Interval,
  startOfMonth,
  subDays,
  endOfDay,
} from 'date-fns';

import {
  FirstDayOfWeek,
  getFirstDateOfWeek,
  getLastDateOfWeek,
  DEFAULT_FIRST_DAY_OF_WEEK,
} from './week';

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

  let fromDate = startOfMonthDate;

  const firstDateOfWeek = getFirstDateOfWeek(fromDate, firstDayOfWeek);

  if (!isSameDay(fromDate, firstDateOfWeek)) {
    const sub = differenceInDays(fromDate, firstDateOfWeek);
    fromDate = subDays(fromDate, sub);
  }

  if (isBefore(fromDate, startOfMonthDate)) {
    beforeDates = eachDayOfInterval({
      start: fromDate,
      end: subDays(startOfMonthDate, 1),
    });
  }

  return beforeDates;
}

function getDatesAfter(endOfMonthDate: Date, firstDayOfWeek: FirstDayOfWeek) {
  let afterDates: Date[] = [];

  let toDate = endOfMonthDate;

  const lastDateOfWeek = getLastDateOfWeek(toDate, firstDayOfWeek);
  if (!isSameDay(toDate, lastDateOfWeek)) {
    const add = differenceInDays(lastDateOfWeek, toDate);

    toDate = addDays(toDate, add);
  }

  if (isAfter(toDate, endOfMonthDate)) {
    afterDates = eachDayOfInterval({
      start: addDays(endOfMonthDate, 1),
      end: toDate,
    });
  }

  return afterDates;
}

const chunk = (arr: any[], size: number) => {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }

  return result;
};

interface Month {
  weeks: { days: Date[] }[];
  month: Date;
}

export function getDatesInMonth(
  monthDate: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Date[] {
  const currentDates = getMonthDatesFromDate(monthDate);
  const startOfMonthDate = currentDates[0];
  const endOfMonthDate = endOfDay(currentDates[currentDates.length - 1]);

  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeek);
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeek);

  return beforeDates.concat(currentDates, afterDates);
}

export function getWeeksInMonth(
  monthDate: Date,
  firstDayOfWeek: FirstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
): Month {
  const dates = getDatesInMonth(monthDate, firstDayOfWeek);

  return {
    month: monthDate,
    weeks: chunk(dates, 7).map((week) => ({
      days: week,
    })),
  };
}
