import {
  Interval,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  addDays,
} from 'date-fns';
import * as React from 'react';

import { validateInterval, datesInInterval } from '../utils/interval';
import { getWeeksInMonth } from '../utils/month';
import {
  FirstDayOfWeek,
  DEFAULT_FIRST_DAY_OF_WEEK,
  eachDayOfWeek,
} from '../utils/week';
import { Text } from './text';
import { Spacing } from './spacing';
import { Icon } from './icon';
import { Pressable } from './pressable';
import { View, StyleSheet, Platform } from 'react-native';
import { Button } from './button';
import { Hoverable } from './hoverable';
import { useTheme } from '../theme';

const DEFAULT_MONTH_DAY_SIZE = 40;

interface DayPickerProps<TIsRange extends boolean = false> {
  /** Initial date used for navigation */
  startMonth?: Date;
  /** Selected value */
  value?: TIsRange extends true ? Interval : Date;
  onChange?: (value: TIsRange extends true ? Interval : Date) => void;
  range?: TIsRange;
  testID?: string;

  numberOfMonths?: number;
  orientation?: 'vertical' | 'horizontal';
  isOutsideRange?: (date: Date) => boolean;
  isBlocked?: (date: Date) => boolean;
}

const VERTICAL_MONTHS_INCREMENT = 2;

function hasBlockedDate(
  interval: Interval,
  isBlocked?: (date: Date) => boolean,
) {
  if (!isBlocked) return false;

  const dates = datesInInterval(interval, addDays);

  return dates.some(isBlocked);
}

export function DayPicker<TIsRange extends boolean = false>(
  props: DayPickerProps<TIsRange>,
) {
  const {
    range = false,
    startMonth = new Date(),
    value,
    onChange = () => {},
    isOutsideRange,
    isBlocked,
    numberOfMonths = 1,
    orientation = 'horizontal',
  } = props;
  const [interval, setInterval] = React.useState<Interval | null>(
    range ? (value as Interval) : null,
  );
  const [navigationDate, setNavigationDate] = React.useState(startMonth);
  const [noOfMonths, setNoOfMonths] = React.useState(numberOfMonths);

  React.useEffect(() => {
    setInterval(range ? (value as Interval) : null);
  }, [value, range]);

  const handleSelect = React.useCallback(
    (date: Date) => {
      if (range) {
        if (value) {
          const val = value as Interval;

          // When only start was selected, it means user just selected end
          if (isSameDay(val.start, val.end)) {
            if (isBefore(date, val.start)) {
              onChange({
                start: date,
                end: date,
              } as any);
            } else if (
              hasBlockedDate({ start: val.start, end: date }, isBlocked)
            ) {
              onChange({
                start: date,
                end: date,
              } as any);
            } else {
              onChange({
                start: val.start,
                end: date,
              } as any);
            }

            // When there is already an interval, reset to start only
          } else {
            onChange({
              start: date,
              end: date,
            } as any);
          }
        } else {
          onChange({
            start: date,
            end: date,
          } as any);
        }
      } else {
        onChange(date as any);
      }
    },
    [onChange, range, value, isBlocked],
  );

  const handleHoverIn = React.useCallback(
    (date: Date) => {
      if (value && interval) {
        const val = value as Interval;

        if (isSameDay(val.start, val.end)) {
          if (isBefore(date, val.start)) {
            setInterval(range ? (value as Interval) : null);
          } else if (
            hasBlockedDate({ start: val.start, end: date }, isBlocked)
          ) {
            setInterval(range ? (value as Interval) : null);
          } else {
            setInterval({
              start: val.start,
              end: date,
            } as any);
          }
        }
      }
    },
    [interval, range, value, isBlocked],
  );

  const handleHoverOut = React.useCallback(() => {
    setInterval(range ? (value as Interval) : null);
  }, [range, value]);

  const handlePressNext = React.useCallback(() => {
    setNavigationDate(addMonths(navigationDate, 1));
  }, [navigationDate]);

  const handlePressPrevious = React.useCallback(() => {
    setNavigationDate(subMonths(navigationDate, 1));
  }, [navigationDate]);

  const handlePressMore = React.useCallback(() => {
    setNoOfMonths(noOfMonths + VERTICAL_MONTHS_INCREMENT);
  }, [noOfMonths]);

  const months = [];

  for (let index = 0; index < noOfMonths; index++) {
    months.push(index);
  }

  return (
    <View style={styles.root}>
      {orientation === 'horizontal' && (
        <View style={styles.arrowsWrapper}>
          <Button style={styles.arrow} onPress={handlePressPrevious}>
            <Icon name="arrow-left" size="lg" />
          </Button>
          <Button style={styles.arrow} onPress={handlePressNext}>
            <Icon name="arrow-right" size="lg" />
          </Button>
        </View>
      )}
      <View
        style={
          orientation === 'horizontal'
            ? styles.monthsWrapperHorizontal
            : styles.monthsWrapperVertical
        }
      >
        {months.map((index) => {
          const month = addMonths(navigationDate, index);
          const isLast = index === months.length - 1;

          return (
            <React.Fragment key={month.getMonth()}>
              <View style={styles.monthWrapper}>
                <Hoverable onHoverOut={handleHoverOut}>
                  <Month
                    selected={
                      (value
                        ? range
                          ? interval
                          : { start: value, end: value }
                        : undefined) as Interval | undefined
                    }
                    date={month}
                    onSelect={handleSelect}
                    isOutsideRange={isOutsideRange}
                    isBlocked={isBlocked}
                    onHoverIn={handleHoverIn}
                  />
                </Hoverable>
              </View>
              {!isLast && <Spacing width={48} height={48} />}
            </React.Fragment>
          );
        })}
      </View>
      {orientation === 'vertical' && (
        <>
          <Spacing height={48} />
          <Button style={styles.moreButton} onPress={handlePressMore}>
            <Icon name="chevron-down" size="lg" />
          </Button>
        </>
      )}
    </View>
  );
}

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

export const Month = (props: MonthProps) => {
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

  if (selected) validateInterval(selected);

  const som = startOfMonth(date);
  const eom = endOfMonth(date);
  const month = getWeeksInMonth(date, firstDayOfWeek);

  return (
    <View style={styles.monthRoot}>
      <View style={styles.monthNameWrapper}>
        <Text align="center">{format(date, 'MMMM yyyy')}</Text>
      </View>
      <Spacing height={16} />
      <WeekDates />
      <Spacing height={16} />
      <View>
        {month.weeks.map((week, weekIndex) => (
          <View style={styles.weekContainer} key={weekIndex}>
            {week.days.map((day, dayIndex) => {
              const isWithinCurrentMonth = isSameMonth(day, date);
              const isSelectedStart =
                selected && isSameDay(day, selected.start);
              const isSelectedEnd = selected && isSameDay(day, selected.end);
              const isSelected = isSelectedStart || isSelectedEnd;
              const isWithinSelection =
                selected && !isSelected
                  ? isWithinInterval(day, selected)
                  : false;

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
    </View>
  );
};

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

interface WeekDatesProps {
  firstDayOfWeek?: FirstDayOfWeek;
  date?: Date;
}

const WeekDates = (props: WeekDatesProps) => {
  const {
    date = new Date(),
    firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK,
  } = props;
  const dates = eachDayOfWeek(date, firstDayOfWeek);

  return (
    <View style={styles.container}>
      {dates.map((d) => (
        <View key={d.toISOString()} style={styles.dateWrapper}>
          <Text size="sm">{format(d, 'EEEEEE')}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  arrowsWrapper: {
    display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
    width: '100%',
    left: 0,
    top: 0,
  },
  monthsWrapperHorizontal: {
    display: 'flex',
  },
  monthsWrapperVertical: {
    display: 'flex',
    flexDirection: 'column',
  },
  monthWrapper: {},
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
  monthNameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
  },
  monthRoot: {
    width: '100%',
  },
  weekContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  dayRoot: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  dateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
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
