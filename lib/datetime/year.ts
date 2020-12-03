import { DateUtils } from '../js_utils';
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
  today: (): Year => {
    return fromDate(new Date());
  },
  getYear: (year: Year): number => {
    return toDate(year).getFullYear();
  },
  isValid: (day: Day): boolean => {
    return isNaN(DateUtils.parse(day)) === false;
  },
  toDate,
  fromDate,
  eachYearOfInterval: (interval: YearInterval): Year[] => {
    const startDate = toDate(interval.start);
    const endDate = toDate(interval.end);

    const years: Year[] = [];
    let current = startDate;

    while (DateUtils.isBefore(current, endDate)) {
      years.push(fromDate(current));
      current = DateUtils.addYears(current, 1);
    }

    return years;
  },
  fromDay: (day: Day): Year => {
    return fromDate(Day.toDate(day));
  },
  fromYear: (yearNum: number): Year => {
    return `${yearNum}`;
  },
  isSame: (yearLeft: Year, yearRight: Year): boolean => {
    return yearLeft === yearRight;
  },
  isAfter: (yearLeft: Year, yearRight: Year): boolean => {
    return DateUtils.isAfter(toDate(yearLeft), toDate(yearRight));
  },
  isBefore: (yearLeft: Year, yearRight: Year): boolean => {
    return DateUtils.isBefore(toDate(yearLeft), toDate(yearRight));
  },
  fromMonth: (month: Month): Year => {
    return fromDate(Month.toDate(month));
  },
  addYears: (year: Year, amount: number): Year => {
    return fromDate(DateUtils.addYears(toDate(year), amount));
  },
  subYears: (year: Year, amount: number): Year => {
    return fromDate(DateUtils.subYears(toDate(year), amount));
  },
};

function fromDate(date: Date): Year {
  return `${date.getFullYear()}`;
}

function toDate(year: Year): Date {
  return DateUtils.new(year);
}
