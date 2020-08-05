import {
  format,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  addDays,
} from 'date-fns';
import * as React from 'react';

import {
  validateInterval,
  datesInInterval,
  FirstDayOfWeek,
  DEFAULT_FIRST_DAY_OF_WEEK,
  eachDayOfWeek,
  Interval,
} from '../../lib/datetime';
import { Text } from './text';
import { Spacer } from './spacer';
import { Icon } from './icon';
import { Month } from './month';
import { View, StyleSheet } from 'react-native';
import { Button } from './button';
import { Container } from './container';
import { useHoverable } from '../hooks/use_hoverable';

interface DayPickerProps<TIsRange extends boolean = false> {
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
  if (!isBlocked) {
    return false;
  }

  const dates = datesInInterval(interval, addDays);

  return dates.some(isBlocked);
}

export function DayPicker<TIsRange extends boolean = false>(
  props: DayPickerProps<TIsRange>,
) {
  const {
    range = false,
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
  const initialNavigationDate = (value
    ? range
      ? (value as Interval).start
      : value
    : new Date()) as Date;
  const [navigationDate, setNavigationDate] = React.useState(
    initialNavigationDate,
  );
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

  const selected = (value
    ? range
      ? interval
      : { start: value, end: value }
    : undefined) as Interval | undefined;

  const { onHoverIn, onHoverOut } = useHoverable({
    onHoverOut: handleHoverOut,
  });

  if (selected) {
    validateInterval(selected);
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
          const last = index === months.length - 1;

          return (
            <React.Fragment key={month.getMonth()}>
              <View style={styles.monthWrapper}>
                <View
                  // @ts-ignore
                  onMouseEnter={onHoverIn}
                  onMouseLeave={onHoverOut}
                  style={styles.monthRoot}
                >
                  <View style={styles.monthNameWrapper}>
                    <Text align="center">{format(month, 'MMMM yyyy')}</Text>
                  </View>
                  <Spacer size={16} />
                  <WeekDates />
                  <Spacer size={16} />
                  <Month
                    selected={selected}
                    date={month}
                    onSelect={handleSelect}
                    isOutsideRange={isOutsideRange}
                    isBlocked={isBlocked}
                    onHoverIn={handleHoverIn}
                  />
                </View>
              </View>
              {!last && <Container width={48} height={48} />}
            </React.Fragment>
          );
        })}
      </View>
      {orientation === 'vertical' && (
        <>
          <Spacer size={48} />
          <Button style={styles.moreButton} onPress={handlePressMore}>
            <Icon name="chevron-down" size="lg" />
          </Button>
        </>
      )}
    </View>
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
    size: 40,
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
    size: 40,
  },
  monthRoot: {
    width: '100%',
  },
  dateWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
});
