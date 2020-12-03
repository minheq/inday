import React, { Fragment, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FirstDayOfWeek,
  DEFAULT_FIRST_DAY_OF_WEEK,
  Week,
  Day,
  DayInterval,
  Month,
} from '../../lib/datetime';

interface MonthTemplateProps {
  /** Date with which we infer the month from */
  month: Month;
  selected?: DayInterval | null;
  firstDayOfWeek?: FirstDayOfWeek;
  isOutsideRange?: (day: Day) => boolean;
  isDayBlocked?: (day: Day) => boolean;
  renderOtherMonthDay: (props: RenderOtherMonthProps) => React.ReactNode;
  renderDay: (props: RenderDayProps) => React.ReactNode;
  renderWeek: (props: RenderWeekProps) => React.ReactNode;
}

export interface RenderDayProps {
  day: Day;
  withinSelected: boolean;
  selected: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  today: boolean;
  outsideRange: boolean;
  blocked: boolean;
}

export interface RenderOtherMonthProps {
  day: Day;
  withinSelected: boolean;
}

export interface RenderWeekProps {
  week: Week;
  children: React.ReactNode;
}

export function MonthTemplate(props: MonthTemplateProps): JSX.Element {
  const {
    month,
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
    selected,
    isOutsideRange,
    isDayBlocked,
    renderDay,
    renderOtherMonthDay,
    renderWeek,
  } = props;
  const weeks = Month.getWeeks(month, firstDayOfWeek);

  return (
    <View>
      {weeks.map((week) => (
        <WeekContainer
          key={week.index}
          week={week}
          selected={selected}
          isOutsideRange={isOutsideRange}
          isDayBlocked={isDayBlocked}
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
  selected?: DayInterval | null;
  isOutsideRange?: (day: Day) => boolean;
  isDayBlocked?: (day: Day) => boolean;
  renderOtherMonthDay: (props: RenderOtherMonthProps) => React.ReactNode;
  renderDay: (props: RenderDayProps) => React.ReactNode;
  renderWeek: (props: RenderWeekProps) => React.ReactNode;
}

function WeekContainer(props: WeekContainerProps): JSX.Element {
  const {
    week,
    selected,
    isOutsideRange,
    isDayBlocked,
    renderOtherMonthDay,
    renderDay,
    renderWeek,
  } = props;
  const som = Month.startOfMonth(week.month);
  const eom = Month.endOfMonth(week.month);

  const children = useMemo(() => {
    return (
      <View style={styles.weekWrapper}>
        {week.days.map((day) => {
          const isWithinCurrentMonth = Month.isDayWithinMonth(week.month, day);
          const isSelectedStart = selected
            ? Day.isSame(day, selected.start)
            : false;
          const isSelectedEnd = selected
            ? Day.isSame(day, selected.end)
            : false;
          const isSelected = isSelectedStart || isSelectedEnd;
          const withinSelected =
            selected && !isSelected
              ? Day.isWithinDayInterval(day, selected)
              : false;
          const outsideRange = isOutsideRange ? isOutsideRange(day) : false;
          const today = Day.isSame(Day.fromDate(new Date()), day);
          const blocked = isDayBlocked ? isDayBlocked(day) : false;

          if (!isWithinCurrentMonth) {
            const hasSelectionNextMonth = selected
              ? Day.isAfter(day, eom) &&
                Day.isAfter(selected.end, eom) &&
                (Day.isSame(selected.start, eom) ||
                  Day.isBefore(selected.start, eom))
              : false;

            const hasSelectionPreviousMonth = selected
              ? Day.isBefore(day, som) &&
                Day.isBefore(selected.start, som) &&
                (Day.isSame(selected.end, som) ||
                  Day.isAfter(selected.end, som))
              : false;

            return (
              <OtherMonthDayContainer
                key={day}
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
              key={day}
              day={day}
              withinSelected={withinSelected}
              selected={isSelected}
              selectedStart={isSelectedStart}
              selectedEnd={isSelectedEnd}
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
    selected,
    isOutsideRange,
    isDayBlocked,
    renderOtherMonthDay,
    renderDay,
    som,
    eom,
  ]);

  return <Fragment>{renderWeek({ week, children })}</Fragment>;
}

interface DayContainerProps {
  day: Day;
  withinSelected: boolean;
  selected: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  today: boolean;
  outsideRange: boolean;
  blocked: boolean;
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
  day: Day;
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
