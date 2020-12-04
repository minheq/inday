import { differenceInMinutes } from '../date_utils';
import { Hours } from './hours';
import { MINUTES_IN_ONE_HOUR } from './minutes';

export const DURATION_HOUR_FORMAT = `H'h'`;
export const DURATION_MINUTE_FORMAT = `m'min'`;
export const DURATION_FORMAT = `${DURATION_HOUR_FORMAT} ${DURATION_MINUTE_FORMAT}`;

export function getDurationInHours(dateLeft: Date, dateRight: Date): Hours {
  const diff = Math.abs(differenceInMinutes(dateLeft, dateRight));

  return diff / MINUTES_IN_ONE_HOUR;
}
