import React, { Fragment, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  isBefore,
  isAfter,
  endOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subDays,
  differenceInDays,
  addDays,
  isSameDay,
  formatISODate,
  DateInterval,
  DayOfWeek,
  isWithinDateInterval,
  getLastDateOfWeek,
  getFirstDateOfWeek,
} from '../../lib/date_utils';
import { chunk } from '../../lib/array_utils';

interface MonthRendererProps {
  /** Date with which we infer the month from */
  month: Date;
  selectedInterval?: DateInterval | null;
  firstDayOfWeek: DayOfWeek;
  isOutsideRange?: (day: Date) => boolean;
  isBlocked?: (day: Date) => boolean;
  renderOtherMonthDay: (props: RenderOtherMonthProps) => React.ReactNode;
  renderDay: (props: RenderDayProps) => React.ReactNode;
  renderWeek: (props: RenderWeekProps) => React.ReactNode;
}

export interface RenderDayState {
  withinSelected: boolean;
  selected: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  today: boolean;
  outsideRange: boolean;
  blocked: boolean;
}

export interface RenderDayProps extends RenderDayState {
  day: Date;
}

export interface RenderOtherMonthProps {
  day: Date;
  withinSelected: boolean;
}

export interface RenderWeekProps {
  week: Week;
  children: React.ReactNode;
}

export function MonthRenderer(props: MonthRendererProps): JSX.Element {
  const {
    month,
    firstDayOfWeek,
    selectedInterval,
    isOutsideRange,
    isBlocked,
    renderDay,
    renderOtherMonthDay,
    renderWeek,
  } = props;
  const weeks = getWeeks(month, firstDayOfWeek);

  return (
    <View>
      {weeks.map((week) => (
        <WeekContainer
          key={week.index}
          week={week}
          selectedInterval={selectedInterval}
          isOutsideRange={isOutsideRange}
          isBlocked={isBlocked}
          renderDay={renderDay}
          renderOtherMonthDay={renderOtherMonthDay}
          renderWeek={renderWeek}
        />
      ))}
    </View>
  );
}

interface WeekContainerProps {
  week: Week;
  selectedInterval?: DateInterval | null;
  isOutsideRange?: (day: Date) => boolean;
  isBlocked?: (day: Date) => boolean;
  renderOtherMonthDay: (props: RenderOtherMonthProps) => React.ReactNode;
  renderDay: (props: RenderDayProps) => React.ReactNode;
  renderWeek: (props: RenderWeekProps) => React.ReactNode;
}

function WeekContainer(props: WeekContainerProps): JSX.Element {
  const {
    week,
    selectedInterval,
    isOutsideRange,
    isBlocked,
    renderOtherMonthDay,
    renderDay,
    renderWeek,
  } = props;

  const children = useMemo(() => {
    const som = startOfMonth(week.month);
    const eom = endOfMonth(week.month);

    return (
      <View style={styles.weekWrapper}>
        {week.days.map((day) => {
          const {
            withinSelected,
            selected,
            selectedStart,
            selectedEnd,
            today,
            outsideRange,
            blocked,
            isWithinCurrentMonth,
          } = getRenderDayState({
            som,
            eom,
            day,
            selectedInterval,
            isBlocked,
            isOutsideRange,
          });

          if (!isWithinCurrentMonth) {
            const hasSelectionNextMonth = selectedInterval
              ? isAfter(day, eom) &&
                isAfter(selectedInterval.end, eom) &&
                (isSameDay(selectedInterval.start, eom) ||
                  isBefore(selectedInterval.start, eom))
              : false;

            const hasSelectionPreviousMonth = selectedInterval
              ? isBefore(day, som) &&
                isBefore(selectedInterval.start, som) &&
                (isSameDay(selectedInterval.end, som) ||
                  isAfter(selectedInterval.end, som))
              : false;

            return (
              <OtherMonthDayContainer
                key={formatISODate(day)}
                day={day}
                renderOtherMonthDay={renderOtherMonthDay}
                withinSelected={
                  hasSelectionNextMonth || hasSelectionPreviousMonth
                }
              />
            );
          }

          return (
            <DayContainer
              key={formatISODate(day)}
              day={day}
              withinSelected={withinSelected}
              selected={selected}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              today={today}
              outsideRange={outsideRange}
              blocked={blocked}
              renderDay={renderDay}
            />
          );
        })}
      </View>
    );
  }, [
    week,
    selectedInterval,
    isOutsideRange,
    isBlocked,
    renderOtherMonthDay,
    renderDay,
  ]);

  return <Fragment>{renderWeek({ week, children })}</Fragment>;
}

interface GetRenderDayStateParams {
  day: Date;
  som: Date;
  eom: Date;
  selectedInterval?: DateInterval | null;
  isOutsideRange?: (day: Date) => boolean;
  isBlocked?: (day: Date) => boolean;
}

function getRenderDayState(params: GetRenderDayStateParams) {
  const { selectedInterval, day, som, eom, isOutsideRange, isBlocked } = params;

  const isWithinCurrentMonth = isWithinDateInterval(day, {
    start: som,
    end: eom,
  });
  const selectedStart = selectedInterval
    ? isSameDay(day, selectedInterval.start)
    : false;
  const selectedEnd = selectedInterval
    ? isSameDay(day, selectedInterval.end)
    : false;
  const selected = selectedStart || selectedEnd;
  const withinSelected =
    selectedInterval && !selected
      ? isWithinDateInterval(day, selectedInterval)
      : false;
  const outsideRange = isOutsideRange ? isOutsideRange(day) : false;
  const today = isSameDay(day, new Date());
  const blocked = isBlocked ? isBlocked(day) : false;

  return {
    withinSelected,
    selected,
    selectedStart,
    selectedEnd,
    today,
    outsideRange,
    blocked,
    isWithinCurrentMonth,
  };
}

interface DayContainerProps extends RenderDayState {
  day: Date;
  renderDay: (props: RenderDayProps) => React.ReactNode;
}

function DayContainer(props: DayContainerProps) {
  const {
    day,
    withinSelected,
    selected,
    selectedStart,
    selectedEnd,
    today,
    outsideRange,
    blocked,
    renderDay,
  } = props;

  return (
    <Fragment>
      {renderDay({
        day,
        withinSelected,
        selected,
        selectedStart,
        selectedEnd,
        today,
        outsideRange,
        blocked,
      })}
    </Fragment>
  );
}

interface OtherMonthDayContainerProps {
  day: Date;
  withinSelected: boolean;
  renderOtherMonthDay: (props: RenderOtherMonthProps) => React.ReactNode;
}

function OtherMonthDayContainer(props: OtherMonthDayContainerProps) {
  const { withinSelected, day, renderOtherMonthDay } = props;

  return (
    <Fragment>
      {renderOtherMonthDay({
        day,
        withinSelected,
      })}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  weekWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export function getWeeks(month: Date, firstDayOfWeek: DayOfWeek): Week[] {
  const dates = getDays(month, firstDayOfWeek);

  return chunk(dates, 7).map((week, index) => ({
    month,
    index,
    days: week,
  }));
}

function getDays(month: Date, firstDayOfWeek: DayOfWeek): Date[] {
  const currentDates = getMonthDatesFromDate(month);
  const startOfMonthDate = currentDates[0];
  const endOfMonthDate = endOfDay(currentDates[currentDates.length - 1]);

  const beforeDates = getDatesBefore(startOfMonthDate, firstDayOfWeek);
  const afterDates = getDatesAfter(endOfMonthDate, firstDayOfWeek);

  return beforeDates.concat(currentDates, afterDates);
}

function getMonthInterval(date: Date): DateInterval {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

function getMonthDatesFromDate(date: Date): Date[] {
  return eachDayOfInterval(getMonthInterval(date));
}

function getDatesBefore(startOfMonthDate: Date, firstDayOfWeek: DayOfWeek) {
  let beforeDates: Date[] = [];

  let from = startOfMonthDate;

  const firstDateOfWeek = getFirstDateOfWeek(from, firstDayOfWeek);

  if (!isSameDay(from, firstDateOfWeek)) {
    const sub = differenceInDays(from, firstDateOfWeek);
    from = subDays(from, sub);
  }

  if (isBefore(from, startOfMonthDate)) {
    beforeDates = eachDayOfInterval({
      start: from,
      end: subDays(startOfMonthDate, 1),
    });
  }

  return beforeDates;
}

function getDatesAfter(endOfMonthDate: Date, firstDayOfWeek: DayOfWeek) {
  let afterDates: Date[] = [];

  let to = endOfMonthDate;

  const lastDateOfWeek = getLastDateOfWeek(to, firstDayOfWeek);
  if (!isSameDay(to, lastDateOfWeek)) {
    const add = differenceInDays(lastDateOfWeek, to);

    to = addDays(to, add);
  }

  if (isAfter(to, endOfMonthDate)) {
    afterDates = eachDayOfInterval({
      start: addDays(endOfMonthDate, 1),
      end: to,
    });
  }

  return afterDates;
}

interface Week {
  month: Date;
  index: number;
  days: Date[];
}
