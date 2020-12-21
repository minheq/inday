import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { Text } from './text';
import { Spacer } from './spacer';
import { Icon } from './icon';
import {
  MonthRenderer,
  RenderDayProps,
  RenderOtherMonthProps,
  RenderWeekProps,
} from './month_renderer';
import { Picker, PickerOption } from './picker';
import { getSystemLocale } from '../lib/locale';
import {
  DayOfWeek,
  eachDayOfInterval,
  formatDate,
  addMonths,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachYearOfInterval,
  DateInterval,
  getFirstDateOfWeek,
  getLastDateOfWeek,
} from '../../lib/date_utils';
import { subMonths } from 'date-fns';
import { useThemeStyles } from './theme';

interface DatePickerProps {
  value?: Date | null;
  onChange?: (value: Date) => void;
  isOutsideRange?: (day: Date) => boolean;
  isBlocked?: (day: Date) => boolean;
  firstDayOfWeek?: DayOfWeek;
}

const DEFAULT_FIRST_DAY_OF_WEEK = 1;

export function DatePicker(props: DatePickerProps): JSX.Element {
  const {
    value,
    onChange,
    isOutsideRange,
    isBlocked,
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  } = props;
  const themeStyles = useThemeStyles();
  const selectedInterval = useMemo((): DateInterval | null => {
    if (value === null || value === undefined) {
      return null;
    }

    return { start: value, end: value };
  }, [value]);

  const [month, setMonth] = useState(
    selectedInterval
      ? selectedInterval.start.getMonth()
      : new Date().getMonth(),
  );

  const [year, setYear] = useState(new Date().getFullYear());
  const minYear = useMemo(() => year - 7, [year]);
  const maxYear = useMemo(() => year + 7, [year]);

  const yearsOptions: PickerOption<number>[] = useMemo(() => {
    return eachYearOfInterval({
      start: new Date(minYear, month),
      end: new Date(maxYear, month),
    }).map((_year) => ({
      value: _year.getFullYear(),
      label: formatDate(_year, getSystemLocale(), {
        year: 'numeric',
      }),
    }));
  }, [minYear, maxYear, month]);

  const monthOptions: PickerOption<number>[] = useMemo(() => {
    return eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    }).map((_month) => ({
      value: _month.getMonth(),
      label: formatDate(_month, getSystemLocale(), {
        month: 'long',
      }),
    }));
  }, []);

  const handleSelectDay = useCallback(
    (day: Date) => {
      if (onChange === null || onChange === undefined) {
        return;
      }

      onChange(day);
    },
    [onChange],
  );

  const handleChangeMonth = useCallback((_month: number) => {
    setMonth(_month);
  }, []);

  const handleChangeYear = useCallback((_year: number) => {
    setYear(_year);
  }, []);

  const date = useMemo(() => new Date(year, month), [year, month]);

  const handlePressNextMonth = useCallback(() => {
    const next = addMonths(date, 1);

    if (next.getFullYear() > date.getFullYear()) {
      setYear(next.getFullYear());
    }

    setMonth(next.getMonth());
  }, [date]);

  const handlePressPreviousMonth = useCallback(() => {
    const prev = subMonths(date, 1);

    if (prev.getFullYear() < date.getFullYear()) {
      setYear(prev.getFullYear());
    }

    setMonth(prev.getMonth());
  }, [date]);

  const renderDay = useCallback(
    (p: RenderDayProps) => {
      const {
        withinSelected,
        selected,
        selectedStart,
        selectedEnd,
        today,
        outsideRange,
        blocked,
        day,
      } = p;

      return (
        <DayDisplay
          day={day}
          withinSelected={withinSelected}
          selected={selected}
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          today={today}
          outsideRange={outsideRange}
          blocked={blocked}
          onSelect={handleSelectDay}
        />
      );
    },
    [handleSelectDay],
  );

  const renderOtherMonthDay = useCallback((p: RenderOtherMonthProps) => {
    const { withinSelected, day } = p;

    return <OtherMonthDay day={day} withinSelected={withinSelected} />;
  }, []);

  const renderWeek = useCallback((p: RenderWeekProps) => {
    const { children } = p;

    return <Week>{children}</Week>;
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.monthNavigatorWrapper}>
        <View style={styles.monthPickerWrapper}>
          <View style={styles.firstMonthPickerWrapper}>
            <Picker
              onChange={handleChangeMonth}
              options={monthOptions}
              value={month}
            />
          </View>
          <Picker
            onChange={handleChangeYear}
            options={yearsOptions}
            value={year}
          />
        </View>
        <View style={styles.monthArrowsWrapper}>
          <Pressable
            style={[styles.arrowWrapper, themeStyles.background.tint]}
            onPress={handlePressPreviousMonth}
          >
            <Icon name="ChevronLeft" />
          </Pressable>
          <Spacer direction="row" size={8} />
          <Pressable
            style={[styles.arrowWrapper, themeStyles.background.tint]}
            onPress={handlePressNextMonth}
          >
            <Icon name="ChevronRight" />
          </Pressable>
        </View>
      </View>
      <Spacer size={16} />
      <WeekDates firstDayOfWeek={firstDayOfWeek} />
      <Spacer size={16} />
      <MonthRenderer
        firstDayOfWeek={firstDayOfWeek}
        selectedInterval={selectedInterval}
        month={date}
        isOutsideRange={isOutsideRange}
        isBlocked={isBlocked}
        renderDay={renderDay}
        renderOtherMonthDay={renderOtherMonthDay}
        renderWeek={renderWeek}
      />
    </View>
  );
}

interface DayDisplayProps {
  day: Date;
  withinSelected: boolean;
  selected: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  today: boolean;
  outsideRange: boolean;
  blocked: boolean;
  onSelect: (day: Date) => void;
}

function DayDisplay(props: DayDisplayProps) {
  const {
    day,
    withinSelected,
    selected,
    selectedStart,
    selectedEnd,
    today,
    outsideRange,
    blocked,
    onSelect,
  } = props;
  const themeStyles = useThemeStyles();
  if (outsideRange || blocked) {
    return (
      <View style={styles.dayRoot}>
        <View style={styles.dayWrapper}>
          <Text decoration="line-through" color="muted">
            {formatDate(day, getSystemLocale(), {
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.dayRoot,
        withinSelected && themeStyles.background.lightPrimary,
      ]}
    >
      <Pressable onPress={() => onSelect(day)} style={styles.dayButton}>
        {({ hovered }: { hovered: boolean }) => (
          <Fragment>
            {selectedStart && !selectedEnd && (
              <View
                style={[
                  styles.selectedEdge,
                  themeStyles.background.lightPrimary,
                  styles.selectedStart,
                ]}
              />
            )}
            {selectedEnd && !selectedStart && (
              <View
                style={[
                  styles.selectedEdge,
                  themeStyles.background.lightPrimary,
                  styles.selectedEnd,
                ]}
              />
            )}
            <View
              style={[
                styles.dayWrapper,
                today && styles.todayWrapper,
                hovered && themeStyles.background.lightPrimary,
                selected && styles.selectedDay,
              ]}
            >
              <Text
                color={selected ? 'contrast' : today ? 'primary' : 'default'}
              >
                {formatDate(day, getSystemLocale(), {
                  day: 'numeric',
                })}
              </Text>
            </View>
          </Fragment>
        )}
      </Pressable>
    </View>
  );
}

interface OtherMonthDayProps {
  withinSelected: boolean;
  day: Date;
}

function OtherMonthDay(props: OtherMonthDayProps) {
  const { withinSelected, day } = props;
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.dayRoot,
        styles.otherDay,
        withinSelected && themeStyles.background.lightPrimary,
      ]}
    >
      <Text color="muted">
        {formatDate(day, getSystemLocale(), {
          day: 'numeric',
        })}
      </Text>
    </View>
  );
}

interface WeekProps {
  children: React.ReactNode;
}

function Week(props: WeekProps) {
  const { children } = props;

  return <View style={styles.week}>{children}</View>;
}

interface WeekDatesProps {
  firstDayOfWeek: DayOfWeek;
}

function WeekDates(props: WeekDatesProps) {
  const { firstDayOfWeek } = props;
  const dates = eachDateOfWeek(new Date(), firstDayOfWeek);

  return (
    <View style={styles.weekDatesWrapper}>
      {dates.map((d) => (
        <View key={d.toISOString()} style={styles.dateWrapper}>
          <Text size="sm">
            {formatDate(d, getSystemLocale(), { weekday: 'narrow' })}
          </Text>
        </View>
      ))}
    </View>
  );
}

const getWeekInterval = (
  date: Date,
  firstDayOfWeek: DayOfWeek,
): DateInterval => {
  return {
    start: startOfDay(getFirstDateOfWeek(date, firstDayOfWeek)),
    end: endOfDay(getLastDateOfWeek(date, firstDayOfWeek)),
  };
};

const eachDateOfWeek = (
  date = new Date(),
  firstDayOfWeek: DayOfWeek,
): Date[] => {
  return eachDayOfInterval(getWeekInterval(date, firstDayOfWeek));
};

const styles = StyleSheet.create({
  root: {},
  dayRoot: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 0,
  },
  dayWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    textAlign: 'center',
    height: 40,
    width: 40,
  },
  arrowWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    textAlign: 'center',
    height: 32,
    width: 32,
  },
  todayWrapper: {},
  selectedEdge: {
    position: 'absolute',
    zIndex: -1,
    width: '50%',
    right: 0,
    height: '100%',
  },
  selectedStart: {
    right: 0,
  },
  selectedEnd: {
    left: 0,
  },
  monthNavigatorWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthArrowsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  week: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  otherDay: {
    opacity: 0.5,
  },
  weekDatesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  firstMonthPickerWrapper: {
    paddingRight: 8,
  },
  selectedDay: {},
  dateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
});
