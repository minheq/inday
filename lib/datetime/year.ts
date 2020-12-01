import { addYears, format, isBefore, setYear, subYears } from '../js_utils';
import { Day } from './day';
import { Month } from './month';

export const YEAR_FORMAT = 'yyyy';

/** In `yyyy` format */
export type Year = string;

export interface YearInterval {
  start: Year;
  end: Year;
}

export const Year = {
  toDate,
  fromDate,
  eachYearOfInterval: (interval: YearInterval): Year[] => {
    const startDate = toDate(interval.start);
    const endDate = toDate(interval.end);

    const years: Year[] = [];
    let current = startDate;

    while (isBefore(current, endDate)) {
      years.push(fromDate(current));
      current = addYears(current, 1);
    }

    return years;
  },
  fromDay: (day: Day): Year => {
    return fromDate(Day.toDate(day));
  },
  fromMonth: (month: Month): Year => {
    return fromDate(Month.toDate(month));
  },
  addYears: (year: Year, amount: number): Year => {
    return fromDate(addYears(toDate(year), amount));
  },
  subYears: (year: Year, amount: number): Year => {
    return fromDate(subYears(toDate(year), amount));
  },
};

function fromDate(date: Date): Year {
  return format(date, YEAR_FORMAT);
}

function toDate(year: Year): Date {
  let date = new Date();

  date = setYear(date, Number(year));

  return date;
}
