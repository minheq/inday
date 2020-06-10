import {
  Interval,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import * as React from 'react';

import { getWeeksInMonth } from '../utils/month';
import { FirstDayOfWeek, DEFAULT_FIRST_DAY_OF_WEEK } from '../utils/week';
import { Text } from './text';
import { Pressable } from './pressable';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme';

const DEFAULT_MONTH_DAY_SIZE = 40;

interface MonthProps {
  onSelect?: (date: Date) => void;
  /**
   * Date with which we infer the month from
   */
  date?: Date;
  selected?: Interval;
  firstDayOfWeek?: FirstDayOfWeek;
  isOutsideRange?: (date: Date) => boolean;
  isBlocked?: (date: Date) => boolean;
  onHoverIn?: (date: Date) => void;
  onHoverOut?: (date: Date) => void;
}

export function Month(props: MonthProps) {
  const {
    date = new Date(),
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
    onSelect,
    selected,
    isOutsideRange = () => false,
    isBlocked = () => false,
    onHoverIn = () => {},
    onHoverOut = () => {},
  } = props;
  const som = startOfMonth(date);
  const eom = endOfMonth(date);
  const month = getWeeksInMonth(date, firstDayOfWeek);

  return (
    <View>
      {month.weeks.map((week, weekIndex) => (
        <View style={styles.weekContainer} key={weekIndex}>
          {week.days.map((day, dayIndex) => {
            const isWithinCurrentMonth = isSameMonth(day, date);
            const isSelectedStart = selected && isSameDay(day, selected.start);
            const isSelectedEnd = selected && isSameDay(day, selected.end);
            const isSelected = isSelectedStart || isSelectedEnd;
            const isWithinSelection =
              selected && !isSelected ? isWithinInterval(day, selected) : false;

            if (!isWithinCurrentMonth) {
              const hasSelectionNextMonth =
                selected &&
                isAfter(day, eom) &&
                isAfter(selected.end, eom) &&
                (isSameDay(selected.start, eom) ||
                  isBefore(selected.start, eom));

              const hasSelectionPreviousMonth =
                selected &&
                isBefore(day, som) &&
                isBefore(selected.start, som) &&
                (isSameDay(selected.end, som) || isAfter(selected.end, som));

              if (hasSelectionNextMonth || hasSelectionPreviousMonth) {
                return <EmptyDay key={day.getDay()} isWithinSelection />;
              }

              return <EmptyDay key={day.getDay()} />;
            }

            return (
              <Day
                key={day.getDay()}
                onSelect={onSelect}
                onHoverIn={onHoverIn}
                onHoverOut={onHoverOut}
                isWithinSelection={isWithinSelection}
                index={dayIndex}
                isSelected={isSelected}
                isSelectedStart={isSelectedStart}
                isSelectedEnd={isSelectedEnd}
                date={day}
                isOutsideRange={isOutsideRange(day)}
                isBlocked={isBlocked(day)}
                isToday={isSameDay(new Date(), day)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

interface DayProps {
  date: Date;
  index: number;
  isWithinSelection?: boolean;
  isSelected?: boolean;
  isSelectedStart?: boolean;
  isSelectedEnd?: boolean;
  isToday?: boolean;
  onSelect?: (date: Date) => void;
  isOutsideRange?: boolean;
  isBlocked?: boolean;
  onHoverIn?: (date: Date) => void;
  onHoverOut?: (date: Date) => void;
}

const Day = (props: DayProps) => {
  const {
    isWithinSelection,
    isSelected,
    date,
    onSelect = () => {},
    isOutsideRange,
    isBlocked,
    isSelectedStart,
    isSelectedEnd,
    isToday,
    onHoverIn = () => {},
    onHoverOut = () => {},
  } = props;
  const theme = useTheme();

  if (isOutsideRange || isBlocked) {
    return (
      <View style={[styles.dayRoot, styles.disabled]}>
        <View style={styles.dayWrapper}>
          <Text decoration="line-through" color="muted">
            {format(date, 'd')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.dayRoot, isWithinSelection && styles.withinSelection]}>
      <Pressable
        onHoverIn={() => onHoverIn(date)}
        onHoverOut={() => onHoverOut(date)}
        onPress={() => onSelect(date)}
        style={styles.dayButton}
      >
        {({ hovered }) => (
          <>
            {isSelectedStart && !isSelectedEnd && (
              <View style={[styles.selectedEdge, styles.selectedStart]} />
            )}
            {isSelectedEnd && !isSelectedStart && (
              <View style={[styles.selectedEdge, styles.selectedEnd]} />
            )}
            <View
              style={[
                styles.dayWrapper,
                hovered && {
                  backgroundColor: theme.container.color.tint,
                },
                isSelected && {
                  backgroundColor: theme.container.color.primary,
                },
              ]}
            >
              <Text color={isSelected ? 'white' : 'default'}>
                {format(date, 'd')}
              </Text>
              {isToday && <View style={styles.todayMarker} />}
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
};

interface EmptyDayProps {
  isWithinSelection?: boolean;
}

function EmptyDay(props: EmptyDayProps) {
  const { isWithinSelection } = props;

  return (
    <View
      style={[styles.dayRoot, isWithinSelection && styles.withinSelection]}
    />
  );
}

const styles = StyleSheet.create({
  dayRoot: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  dayButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // cursor: 'pointer',
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
    height: DEFAULT_MONTH_DAY_SIZE,
    width: DEFAULT_MONTH_DAY_SIZE,
  },
  withinSelection: {},
  // @ts-ignore
  disabled: {
    ...Platform.select({
      web: {
        userSelect: 'none',
      },
    }),
  },
  weekContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  todayMarker: {
    bottom: 4,
    width: 4,
    height: 4,
    paddingTop: 4,
    borderRadius: 999,
  },
  selectedEdge: {
    zIndex: -1,
    // backgroundColor: cssVariables.backgroundLightPrimary,
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
});
