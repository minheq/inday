import {
  setYear,
  setMonth,
  setDate,
  format,
  parseISO,
  startOfDay,
  endOfDay,
} from 'date-fns';

export const DAY_FORMAT = 'yyyy-MM-dd';

export function setSameDay(date: Date, toDate: Date) {
  date = setYear(date, toDate.getFullYear());
  date = setMonth(date, toDate.getMonth());
  date = setDate(date, toDate.getDate());

  return date;
}

export function parseDay(day: string, timeOfDay?: 'start' | 'end'): Date {
  const date = parseISO(day);

  if (timeOfDay === 'start') {
    return startOfDay(date);
  } else if (timeOfDay === 'end') {
    return endOfDay(date);
  }

  return date;
}

export function toDay(date: Date): string {
  return format(date, DAY_FORMAT);
}

export function isValidDay(day: string): boolean {
  const ok = parseDay(day);

  if (!ok) {
    return false;
  }

  return true;
}
