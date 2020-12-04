import { isValid } from 'date-fns';
export {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isBefore,
  format as formatPattern,
  formatISO,
  isSameDay,
  startOfMonth,
  subDays,
  endOfDay,
  setYear,
  setMonth,
  addMonths,
  subMonths,
  startOfDay,
  getDay,
  differenceInMinutes,
  addHours,
  setHours,
  setMinutes,
  addMinutes,
  setSeconds,
  setMilliseconds,
  subMinutes,
  subHours,
  differenceInHours,
  addYears,
  subYears,
  setDate,
  isWithinInterval,
  getDate,
} from 'date-fns';

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function formatDate(
  date: Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locales, options).format(date);
}

export function formatRelative(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locales?: string | string[],
  options?: Intl.RelativeTimeFormatOptions,
): string {
  return new Intl.RelativeTimeFormat(locales, options).format(value, unit);
}

type DateInputFormat = 'm/d/y' | 'y/m/d' | 'd/m/y';

export function parseString(
  str: string,
  inputFormat: DateInputFormat,
): Date | Error {
  const params = str.split(/[.\-/]/);
  if (params.length !== 3) {
    return new Error(
      'Invalid date string. There should be 3 delimiters "-", "/" or "."',
    );
  }

  let day: number;
  let month: number;
  let year: number;

  if (inputFormat === 'd/m/y') {
    day = parseInt(params[0], 10);
    month = parseInt(params[1], 10);
    year = parseInt(params[2], 10);
  } else if (inputFormat === 'm/d/y') {
    day = parseInt(params[1], 10);
    month = parseInt(params[0], 10);
    year = parseInt(params[2], 10);
  } else if (inputFormat === 'y/m/d') {
    day = parseInt(params[2], 10);
    month = parseInt(params[1], 10);
    year = parseInt(params[0], 10);
  } else {
    return new Error(
      'Invalid date input format. It has to be one of "m/d/y", "y/m/d" or "d/m/y"',
    );
  }

  if (isNaN(day) || day < 1) {
    return new Error('Day is not valid. Ensure only numeric input for day.');
  } else if (isNaN(month) || month < 1) {
    return new Error(
      'Month is not valid. Ensure only numeric input for month.',
    );
  } else if (isNaN(year) || year < 1) {
    return new Error('Year is not valid. Ensure only numeric input for year.');
  }

  if (year < 100) {
    year += 2000;
  }

  const date = new Date(`${year}-${month}-${day}`);

  if (isValid(date) === false) {
    return new Error('Date is not valid.');
  }

  return date;
}

export function isStartOfMonth(date: Date): boolean {
  return date.getDate() === 1;
}
