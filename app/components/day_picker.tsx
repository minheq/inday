import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';

import {
  DEFAULT_FIRST_DAY_OF_WEEK,
  eachDayOfWeek,
  FirstDayOfWeek,
  DayInterval,
  Day,
  Month,
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

interface DayPickerProps {
  value?: Day | null;
  onChange?: (value: Day) => void;
  isOutsideRange?: (day: Day) => boolean;
  isBlocked?: (day: Day) => boolean;
}

export function DayPicker(props: DayPickerProps): JSX.Element {
  const { value, onChange, isOutsideRange, isBlocked } = props;

  const selected = useMemo((): DayInterval | null => {
    if (value === null || value === undefined) {
      return null;
    }

    return { start: value, end: value };
  }, [value]);

  const [month, setMonth] = useState(
    selected ? Month.fromDay(selected.start) : Month.fromDate(new Date()),
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
      <MonthNavigator month={month} onChange={setMonth} />
      <Spacer size={16} />
      <WeekDates />
      <Spacer size={16} />
      <MonthTemplate
        selected={selected}
        month={month}
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
            {format(Day.toDate(day), 'd')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.dayRoot, withinSelected && styles.withinSelected]}>
      <Pressable onPress={() => onSelect(day)} style={styles.dayButton}>
        {selectedStart && !selectedEnd && (
          <View style={[styles.selectedEdge, styles.selectedStart]} />
        )}
        {selectedEnd && !selectedStart && (
          <View style={[styles.selectedEdge, styles.selectedEnd]} />
        )}
        <View style={[styles.dayWrapper, selected && styles.selectedDay]}>
          <Text color={selected ? 'contrast' : 'default'}>
            {format(Day.toDate(day), 'd')}
          </Text>
          {today && <View style={styles.todayMarker} />}
        </View>
      </Pressable>
    </View>
  );
}

interface OtherMonthDayProps {
  withinSelected: boolean;
  day: Day;
}

function OtherMonthDay(props: OtherMonthDayProps) {
  const { withinSelected } = props;

  return (
    <View style={[styles.dayRoot, withinSelected && styles.withinSelected]} />
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
  week?: Date;
}

function WeekDates(props: WeekDatesProps) {
  const {
    week = new Date(),
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  } = props;
  const dates = eachDayOfWeek(week, firstDayOfWeek);

  return (
    <View style={styles.weekDatesWrapper}>
      {dates.map((d) => (
        <View key={d.toISOString()} style={styles.dateWrapper}>
          <Text size="sm">{format(d, 'EEEEEE')}</Text>
        </View>
      ))}
    </View>
  );
}

interface MonthNavigatorProps {
  month: Month;
  onChange: (month: Month) => void;
}

function MonthNavigator(props: MonthNavigatorProps) {
  const { month, onChange } = props;
  const handlePressNext = useCallback(() => {
    onChange(Month.addMonths(month, 1));
  }, [month, onChange]);

  const handlePressPrevious = useCallback(() => {
    onChange(Month.subMonths(month, 1));
  }, [month, onChange]);

  return (
    <View style={styles.monthNavigatorWrapper}>
      <Pressable style={styles.arrowWrapper} onPress={handlePressPrevious}>
        <Icon name="ChevronLeft" size="sm" />
      </Pressable>
      <Text align="center">{format(Month.toDate(month), 'MMMM yyyy')}</Text>
      <Pressable style={styles.arrowWrapper} onPress={handlePressNext}>
        <Icon name="ChevronRight" size="sm" />
      </Pressable>
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
    borderRadius: 999,
    textAlign: 'center',
    height: 24,
    width: 24,
    borderWidth: 1,
  },
  withinSelected: {
    backgroundColor: 'rgba(82,68,134,0.15)',
  },
  todayMarker: {
    bottom: -4,
    width: 4,
    height: 4,
    paddingTop: 4,
    borderRadius: 999,
    backgroundColor: 'black',
  },
  selectedEdge: {
    backgroundColor: 'rgba(82,68,134,0.15)',
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  monthRoot: {
    width: '100%',
  },
  selectedDay: {
    backgroundColor: 'rgba(82, 68, 134, 1)',
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
