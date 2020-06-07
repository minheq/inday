export enum WeekDay {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}

export enum Frequency {
  Yearly = 'YEARLY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Daily = 'DAILY',
}

export interface Recurrence {
  startDate: Date;
  frequency: Frequency;
  interval?: number | null;
  count?: number | null;
  weekStart?: WeekDay | null;
  until?: Date | null;
  timezoneID?: string | null;
  bySetPosition?: number[] | null;
  byMonth?: number[] | null;
  byMonthDay?: number[] | null;
  byYearDay?: number[] | null;
  byWeekNumber?: number[] | null;
  byWeekDay?: WeekDay[] | null;
  byHour?: number[] | null;
  byMinute?: number[] | null;
  bySecond?: number[] | null;
}
