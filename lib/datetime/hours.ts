import { Minutes, MINUTES_IN_ONE_HOUR } from './minutes';

export const HOURS_IN_ONE_DAY = 24;

export type Hours = number;

export const Hours = {
  toMinutes: (hours: Hours): Minutes => {
    return hours * MINUTES_IN_ONE_HOUR;
  },
};
