import { isBefore, toDate } from 'date-fns';

export type Interval = {
  start: Date;
  end: Date;
};

export const datesInInterval = (
  interval: Interval,
  add: (date: Date, step: number) => Date,
  step = 1,
) => {
  validateInterval(interval);

  const startDate = toDate(interval.start);
  const endDate = toDate(interval.end);

  let currentDate = startDate;

  const dates: Date[] = [];

  while (isBefore(currentDate, endDate)) {
    dates.push(toDate(currentDate));

    currentDate = add(currentDate, step);
  }

  return dates;
};

export function isValidInterval(interval: Interval): boolean {
  if (isBefore(interval.end, interval.start)) {
    return false;
  }

  return true;
}

export function validateInterval(interval: Interval) {
  if (!isValidInterval(interval)) {
    throw new Error('Selected end date cannot be before selected start date.');
  }
}

export function isInterval(value: Date | Interval | null): value is Interval {
  if (!value) {
    return false;
  }

  return !(value instanceof Date);
}
