import { Hours } from './hours';

export const MINUTES_IN_ONE_DAY = 24 * 60;
export const MINUTES_IN_ONE_HOUR = 60;

export type Minutes = number;

export const Minutes = {
  toHours: (minutes: Minutes): Hours => {
    return minutes / MINUTES_IN_ONE_HOUR;
  },
};
