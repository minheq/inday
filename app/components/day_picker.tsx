import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';

import {
  DEFAULT_FIRST_DAY_OF_WEEK,
  eachDayOfWeek,
  FirstDayOfWeek,
  DayInterval,
  Day,
  Month,
  Year,
} from '../../lib/datetime';
import { Text } from './text';
import { Spacer } from './spacer';
import { Icon } from './icon';
import {
  MonthTemplate,
  RenderDayProps,
  RenderOtherMonthProps,
  RenderWeekProps,
} from './month_template';
import { DynamicStyleSheet } from './stylesheet';
import { tokens } from './tokens';
import { Button } from './button';
import { Date } from '../../lib/js_utils';
import { Picker, PickerOption } from './picker';
import { getSystemLocale } from '../lib/locale';

interface DayPickerProps {
  value?: Day | null;
  onChange?: (value: Day) => void;
  maxDay?: Day;
  minDay?: Day;
  isOutsideRange?: (day: Day) => boolean;
  isDayBlocked?: (day: Day) => boolean;
}

export function DayPicker(props: DayPickerProps): JSX.Element {
  const {
    value,
    onChange,
    minDay = Day.subYears(Day.today(), 2),
    maxDay = Day.addYears(Day.today(), 2),
    isOutsideRange,
    isDayBlocked,
  } = props;

  const yearsOptions: PickerOption<Year>[] = useMemo(() => {
    return Year.eachYearOfInterval({
      start: Year.fromDay(minDay),
      end: Year.fromDay(maxDay),
    }).map((year) => ({
      value: year,
      label: Date.format(Year.toDate(year), getSystemLocale(), {
        year: 'numeric',
      }),
    }));
  }, [minDay, maxDay]);
  const monthOptions: PickerOption<Month>[] = useMemo(() => {
    return Month.eachMonthOfInterval({
      start: Month.fromDay(minDay),
      end: Month.fromDay(maxDay),
    }).map((month) => ({
      value: month,
      label: Date.format(Month.toDate(month), getSystemLocale(), {
        month: 'long',
      }),
    }));
  }, [minDay, maxDay]);

  const selected = useMemo((): DayInterval | null => {
    if (value === null || value === undefined) {
      return null;
    }

    return { start: value, end: value };
  }, [value]);

  const [month, setMonth] = useState(
    selected ? Month.fromDay(selected.start) : Month.fromDate(Date.new()),
  );

  const handleSelectDay = useCallback(
    (day: Day) => {
      if (onChange === null || onChange === undefined) {
        return;
      }

      onChange(day);
    },
    [onChange],
  );

  const handlePressNext = useCallback(() => {
    setMonth(Month.addMonths(month, 1));
  }, [month]);

  const handlePressPrevious = useCallback(() => {
    setMonth(Month.subMonths(month, 1));
  }, [month]);

  const renderDay = useCallback(
    (p: RenderDayProps) => <DayDisplay {...p} onSelect={handleSelectDay} />,
    [handleSelectDay],
  );
  const renderOtherMonthDay = useCallback(
    (p: RenderOtherMonthProps) => <OtherMonthDay {...p} />,
    [],
  );
  const renderWeek = useCallback((p: RenderWeekProps) => <Week {...p} />, []);

  return (
    <View style={styles.root}>
      <View style={styles.monthNavigatorWrapper}>
        <View style={styles.pickerWrapper}>
          <Picker
            options={yearsOptions}
            value={value ? Year.fromDay(value) : null}
          />
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            options={monthOptions}
            value={value ? Month.fromDay(value) : null}
          />
        </View>
        <View style={styles.monthArrowsWrapper}>
          <Button style={styles.arrowWrapper} onPress={handlePressPrevious}>
            <Icon name="ChevronLeft" />
          </Button>
          <Spacer direction="row" size={8} />
          <Button style={styles.arrowWrapper} onPress={handlePressNext}>
            <Icon name="ChevronRight" />
          </Button>
        </View>
      </View>
      <Spacer size={16} />
      <WeekDates />
      <Spacer size={16} />
      <MonthTemplate
        selected={selected}
        month={month}
        isOutsideRange={isOutsideRange}
        isDayBlocked={isDayBlocked}
        renderDay={renderDay}
        renderOtherMonthDay={renderOtherMonthDay}
        renderWeek={renderWeek}
      />
    </View>
  );
}

interface DayDisplayProps {
  day: Day;
  withinSelected: boolean;
  selected: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  today: boolean;
  outsideRange: boolean;
  blocked: boolean;
  onSelect: (day: Day) => void;
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

  if (outsideRange || blocked) {
    return (
      <View style={styles.dayRoot}>
        <View style={styles.dayWrapper}>
          <Text decoration="line-through" color="muted">
            {Date.format(Day.toDate(day), getSystemLocale(), {
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.dayRoot, withinSelected && styles.withinSelected]}>
      <Pressable onPress={() => onSelect(day)} style={styles.dayButton}>
        {({ hovered }: { hovered: boolean }) => (
          <Fragment>
            {selectedStart && !selectedEnd && (
              <View style={[styles.selectedEdge, styles.selectedStart]} />
            )}
            {selectedEnd && !selectedStart && (
              <View style={[styles.selectedEdge, styles.selectedEnd]} />
            )}
            <View
              style={[
                styles.dayWrapper,
                today && styles.todayWrapper,
                hovered && styles.hoveredDay,
                selected && styles.selectedDay,
              ]}
            >
              <Text
                color={selected ? 'contrast' : today ? 'primary' : 'default'}
              >
                {Date.format(Day.toDate(day), getSystemLocale(), {
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
  day: Day;
}

function OtherMonthDay(props: OtherMonthDayProps) {
  const { withinSelected, day } = props;

  return (
    <View
      style={[
        styles.dayRoot,
        styles.otherDay,
        withinSelected && styles.withinSelected,
      ]}
    >
      <Text color="muted">
        {Date.format(Day.toDate(day), getSystemLocale(), { day: 'numeric' })}
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
  firstDayOfWeek?: FirstDayOfWeek;
}

function WeekDates(props: WeekDatesProps) {
  const { firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK } = props;
  const dates = eachDayOfWeek(Date.new(), firstDayOfWeek);

  return (
    <View style={styles.weekDatesWrapper}>
      {dates.map((d) => (
        <View key={d.toISOString()} style={styles.dateWrapper}>
          <Text size="sm">
            {Date.format(d, getSystemLocale(), { weekday: 'narrow' })}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = DynamicStyleSheet.create(() => ({
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
    borderRadius: tokens.border.radius.default,
    borderColor: tokens.colors.gray[300],
    textAlign: 'center',
    height: 32,
    width: 32,
    borderWidth: 1,
    ...tokens.shadow.elevation1,
  },
  todayWrapper: {},
  withinSelected: {
    backgroundColor: tokens.colors.lightBlue[50],
  },
  selectedEdge: {
    backgroundColor: tokens.colors.lightBlue[50],
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
  hoveredDay: {
    backgroundColor: tokens.colors.lightBlue[100],
  },
  monthsWrapperHorizontal: {
    display: 'flex',
  },
  monthsWrapperVertical: {
    display: 'flex',
    flexDirection: 'column',
  },
  week: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  otherDay: {
    opacity: 0.5,
  },
  arrow: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    padding: 8,
  },
  moreButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    width: '100%',
  },
  weekDatesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerWrapper: {
    flex: 1,
  },
  monthRoot: {
    width: '100%',
  },
  selectedDay: {
    backgroundColor: tokens.colors.lightBlue[700],
  },
  dateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
}));
