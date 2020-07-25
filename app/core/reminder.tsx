import React from 'react';
import { Frequency, Recurrence } from '../lib/datetime/recurrence';
import { ListItem } from '../components/list_item';
import { Container } from '../components/container';
import { Spacing } from '../components/spacing';
import { BackButton } from '../components/back_button';
import { Row } from '../components/row';
import { useNavigation, NavigationProvider } from '../components/navigation';
import { Icon } from '../components/icon';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/button';
import { Column } from '../components/column';
import { Text } from '../components/text';
import {
  format,
  setDay,
  isBefore,
  isSameDay,
  addYears,
  addMonths,
  addWeeks,
  addDays,
} from 'date-fns';
import { SegmentedControl } from '../components/segmented_control';
import { Content } from '../components/content';
import { DayPicker } from '../components/day_picker';
import { TimePicker } from '../components/time_picker';
import { Picker, ListPicker } from '../components';
import { range } from '../utils/arrays';
import { WeekDay, getWeekDaysOptions } from '../utils/week';
import { Reminder } from '../data/types';

interface ReminderContext {
  value?: Reminder | null;
  onChange: (value: Reminder) => void;
  onRecurrenceChange: (recurrence: Recurrence | null) => void;
}

const ReminderContext = React.createContext<ReminderContext>({
  value: null,
  onChange: () => {},
  onRecurrenceChange: () => {},
});

function useReminder() {
  return React.useContext(ReminderContext);
}

interface ReminderProps {
  value?: Reminder | null;
  onChange?: (value: Reminder) => void;
}

export function Reminder(props: ReminderProps) {
  const { value, onChange = () => {} } = props;

  const handleRecurrenceChange = React.useCallback(
    (recurrence: Recurrence | null) => {
      if (value && value.time) {
        onChange({
          place: value.place,
          time: {
            date: value.time.date,
            time: value.time.time,
            recurrence,
          },
        });
      }
    },
    [value, onChange],
  );

  return (
    <ReminderContext.Provider
      value={{
        value,
        onChange,
        onRecurrenceChange: handleRecurrenceChange,
      }}
    >
      <NavigationProvider>
        <ReminderMenu />
      </NavigationProvider>
    </ReminderContext.Provider>
  );
}

function ReminderMenu() {
  const { navigate } = useNavigation();
  return (
    <Container>
      <Row>
        <Button>
          <Text>Today</Text>
        </Button>
        <Button>
          <Text>Tomorrow</Text>
        </Button>
        <Button>
          <Text>Next week</Text>
        </Button>
      </Row>
      <Row>
        <Button>
          <Text>Home</Text>
        </Button>
      </Row>
      <Column>
        <Button onPress={() => navigate(<ReminderTime />)}>
          <Text>Pick time</Text>
        </Button>
        <Button>
          <Text>Pick place</Text>
        </Button>
      </Column>
    </Container>
  );
}

function ReminderTime() {
  const { value, onChange } = useReminder();

  const handleDateChange = React.useCallback(
    (date: Date) => {
      if (value) {
        onChange({
          place: value.place,
          time: {
            date,
            time: value.time?.time ?? null,
            recurrence: value.time?.recurrence ?? null,
          },
        });
      } else {
        onChange({
          place: null,
          time: {
            date,
            time: null,
            recurrence: null,
          },
        });
      }
    },
    [value, onChange],
  );

  const handleTimeChange = React.useCallback(
    (time?: Date) => {
      if (value && value.time) {
        onChange({
          place: value.place,
          time: {
            date: value.time.date,
            time: time ?? null,
            recurrence: value.time.recurrence,
          },
        });
      }
    },
    [value, onChange],
  );

  return (
    <Container>
      <Text>Pick date</Text>
      <DayPicker value={value?.time?.date} onChange={handleDateChange} />
      {value?.time?.date && (
        <TimePicker
          placeholder="Set time"
          value={value.time.time ?? undefined}
          onChange={handleTimeChange}
          clearable
        />
      )}
      {value?.time?.date && <RecurrencePicker />}
    </Container>
  );
}

function formatRepeat(recurrence: Recurrence) {
  const {
    interval,
    frequency,
    byWeekDay,
    byMonthDay,
    bySetPosition,
  } = recurrence;

  const frequencyText = {
    [Frequency.Yearly]: 'Year',
    [Frequency.Monthly]: 'Month',
    [Frequency.Weekly]: 'Week',
    [Frequency.Daily]: 'Day',
  };

  let text = `Every ${interval} ${frequencyText[frequency]}`;

  if (frequency === Frequency.Weekly && byWeekDay) {
    text += ` on ${byWeekDay
      .map((weekDay) => format(setDay(new Date(), weekDay), 'EEE'))
      .join(', ')}`;
  }

  if (frequency === Frequency.Monthly && byMonthDay) {
    text += ` on ${byMonthDay
      .map((monthDay) => format(setDay(new Date(), monthDay), 'do'))
      .join(', ')}`;
  }

  if (frequency === Frequency.Monthly && bySetPosition && byWeekDay) {
    switch (bySetPosition[0]) {
      case 1:
        text += ' on first';
        break;
      case 2:
        text += ' on second';
        break;
      case 3:
        text += ' on third';
        break;
      case 4:
        text += ' on fourth';
        break;
      case -1:
        text += ' on last';
        break;
      default:
        break;
    }

    const options = getWeekDaysOptions();

    text += ` ${options.find((o) => o.value === byWeekDay[0])?.label}`;
  }

  return text;
}

function formatEndRepeat(recurrence: Recurrence) {
  const { count, until } = recurrence;

  if (count) {
    return `After ${count} occurrences`;
  }

  if (until) {
    return `Until ${format(until, 'do MMMM yyyy')}`;
  }

  return 'Never';
}

function useOptions() {
  const { value } = useReminder();

  if (!value?.time?.date) {
    return [];
  }

  const startDate = value.time.date;
  const recurrence = value.time.recurrence;

  const options: Option[] = [
    {
      label: 'Daily',
      value: { startDate, frequency: Frequency.Daily, interval: 1 },
    },
    {
      label: 'Weekly',
      value: { startDate, frequency: Frequency.Weekly, interval: 1 },
    },
    {
      label: 'Biweekly',
      value: { startDate, frequency: Frequency.Weekly, interval: 2 },
    },
    {
      label: 'Monthly',
      value: { startDate, frequency: Frequency.Monthly, interval: 1 },
    },
    {
      label: 'Every 3 months',
      value: { startDate, frequency: Frequency.Monthly, interval: 3 },
    },
    {
      label: 'Every 6 months',
      value: { startDate, frequency: Frequency.Monthly, interval: 6 },
    },
    {
      label: 'Yearly',
      value: { startDate, frequency: Frequency.Yearly, interval: 1 },
    },
  ].map((o) => ({
    label: o.label,
    value: o.value,
    selected:
      !recurrence?.byMonthDay &&
      !recurrence?.byWeekDay &&
      !recurrence?.bySetPosition &&
      o.value.frequency === recurrence?.frequency &&
      o.value.interval === recurrence?.interval,
  }));

  return options;
}

export function RecurrencePicker() {
  const { value } = useReminder();
  const { navigate } = useNavigation();
  const options = useOptions();

  if (!value?.time?.date) {
    return null;
  }

  const recurrence = value.time.recurrence;
  const selected = options.find((o) => o.selected);
  const custom = !selected && !!value?.time?.recurrence;
  const exist = custom || !!selected;

  return (
    <Container flex={1}>
      <RecurrencePickerButton
        label="Repeat"
        description={
          selected
            ? selected.label
            : recurrence
            ? formatRepeat(recurrence)
            : 'Does not repeat'
        }
        onPress={() => navigate(<RecurrenceOptions />)}
      />
      {exist && recurrence && (
        <RecurrencePickerButton
          label="End repeat"
          description={formatEndRepeat(recurrence)}
          onPress={() => navigate(<RecurrenceEndRepeatOptions />)}
        />
      )}
    </Container>
  );
}

function RecurrenceOptions() {
  const { value, onRecurrenceChange } = useReminder();
  const { navigate, back } = useNavigation();
  const options = useOptions();
  const selected = options.find((o) => o.selected);
  const custom = !selected && !!value?.time?.recurrence;

  return (
    <Container>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <ListItem
        description="Does not repeat"
        onPress={() => {
          onRecurrenceChange(null);
          back();
        }}
        actions={
          !value?.time?.recurrence && (
            <Icon name="check" color="primary" size="lg" />
          )
        }
      />
      {options.map((o) => (
        <ListItem
          key={o.label}
          onPress={() => {
            onRecurrenceChange(o.value);
            back();
          }}
          description={o.label}
          actions={
            o.selected && <Icon name="check" color="primary" size="lg" />
          }
        />
      ))}
      <Spacing height={16} />
      <ListItem
        description="Custom"
        onPress={() => {
          if (!value?.time?.recurrence && value?.time?.date) {
            onRecurrenceChange({
              startDate: value?.time?.date,
              frequency: Frequency.Daily,
              interval: 1,
            });
          }

          navigate(<RecurrenceCustomOptions />);
        }}
        actions={
          custom ? (
            <Icon name="check" color="primary" size="lg" />
          ) : (
            <Icon name="chevron-right" size="lg" />
          )
        }
      />
    </Container>
  );
}

function RecurrenceCustomOptions() {
  const { value, onRecurrenceChange } = useReminder();
  const { back } = useNavigation();
  const recurrence = value?.time?.recurrence;
  const [monthOption, setMonthOption] = React.useState(1);

  if (!recurrence) {
    throw new Error('Expected recurrence');
  }

  const handleChangeOption = React.useCallback(
    (opt: number) => {
      if (!value?.time?.date) {
        return;
      }

      switch (opt) {
        case 1:
          onRecurrenceChange({
            startDate: value.time.date,
            frequency: Frequency.Daily,
            interval: recurrence.interval,
          });
          break;
        case 2:
          onRecurrenceChange({
            startDate: value.time.date,
            frequency: Frequency.Weekly,
            interval: recurrence.interval,
          });
          break;
        case 3:
          onRecurrenceChange({
            startDate: value.time.date,
            frequency: Frequency.Monthly,
            interval: recurrence.interval,
          });
          break;
        case 4:
          onRecurrenceChange({
            startDate: value.time.date,
            frequency: Frequency.Yearly,
            interval: recurrence.interval,
          });
          break;
        default:
          break;
      }
    },
    [value, recurrence, onRecurrenceChange],
  );

  const handleChangeInterval = React.useCallback(
    (interval?: number) => {
      if (interval) {
        onRecurrenceChange({
          ...recurrence,
          interval,
        });
      }
    },
    [recurrence, onRecurrenceChange],
  );

  const handleChangeSetPosition = React.useCallback(
    (bySetPosition?: number) => {
      if (bySetPosition) {
        onRecurrenceChange({
          ...recurrence,
          bySetPosition: bySetPosition ? [bySetPosition] : undefined,
        });
      }
    },
    [recurrence, onRecurrenceChange],
  );

  const handleChangeWeekDay = React.useCallback(
    (byWeekDay: WeekDay[]) => {
      onRecurrenceChange({
        ...recurrence,
        byWeekDay,
      });
    },
    [recurrence, onRecurrenceChange],
  );

  const handleChangeMonthDay = React.useCallback(
    (byMonthDay: number[]) => {
      onRecurrenceChange({
        ...recurrence,
        byMonthDay,
      });
    },
    [recurrence, onRecurrenceChange],
  );

  const handleChangeMonthOption = React.useCallback(
    (opt: number) => {
      if (opt === 1) {
        onRecurrenceChange({
          ...recurrence,
          byMonthDay: [1],
        });
      } else {
        onRecurrenceChange({
          ...recurrence,
          byWeekDay: [WeekDay.Monday],
          bySetPosition: [1],
        });
      }
      setMonthOption(opt);
    },
    [recurrence, onRecurrenceChange],
  );

  let selected = 1;
  let label = 'days';

  if (recurrence.frequency === Frequency.Weekly) {
    selected = 2;
    label = 'weeks';
  } else if (recurrence.frequency === Frequency.Monthly) {
    selected = 3;
    label = 'months';
  } else if (recurrence.frequency === Frequency.Yearly) {
    selected = 4;
    label = 'years';
  }

  let content: React.ReactNode;

  switch (selected) {
    case 2:
      content = (
        <ListPicker
          label="On"
          multi
          value={recurrence.byWeekDay}
          options={getWeekDaysOptions()}
          onChange={handleChangeWeekDay}
        />
      );
      break;
    case 3:
      content = (
        <>
          <SegmentedControl
            value={monthOption}
            onChange={handleChangeMonthOption}
            options={[
              { value: 1, label: 'Each' },
              { value: 2, label: 'On the...' },
            ]}
          />
          <Spacing height={16} />
          {monthOption === 1 && (
            <Container flex={1}>
              <ScrollView>
                <ListPicker
                  multi
                  label="Each day"
                  options={range(1, 31).map((i) => ({
                    value: i,
                    label: `Day ${i}`,
                  }))}
                  value={value?.time?.recurrence?.byMonthDay ?? [1]}
                  onChange={handleChangeMonthDay}
                />
              </ScrollView>
            </Container>
          )}
          {monthOption === 2 && (
            <>
              <Picker
                label="On"
                options={[
                  { value: 1, label: 'First' },
                  { value: 2, label: 'Second' },
                  { value: 3, label: 'Third' },
                  { value: 4, label: 'Fourth' },
                  { value: -1, label: 'Last' },
                ]}
                value={value?.time?.recurrence?.bySetPosition?.[0] ?? 1}
                onChange={handleChangeSetPosition}
              />
              <Picker
                label="Weekday"
                value={recurrence.byWeekDay?.[0]}
                options={[
                  { value: WeekDay.Monday, label: 'Monday' },
                  { value: WeekDay.Tuesday, label: 'Tuesday' },
                  { value: WeekDay.Wednesday, label: 'Wednesday' },
                  { value: WeekDay.Thursday, label: 'Thursday' },
                  { value: WeekDay.Friday, label: 'Friday' },
                  { value: WeekDay.Saturday, label: 'Saturday' },
                  { value: WeekDay.Sunday, label: 'Sunday' },
                ]}
                onChange={(weekday) =>
                  handleChangeWeekDay(weekday ? [weekday] : [])
                }
              />
            </>
          )}
        </>
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <Container flex={1}>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <Text size="lg" bold>
        Custom repeat by
      </Text>
      <Spacing height={8} />
      <SegmentedControl
        value={selected}
        onChange={handleChangeOption}
        options={[
          { value: 1, label: 'Day' },
          { value: 2, label: 'Week' },
          { value: 3, label: 'Month' },
          { value: 4, label: 'Year' },
        ]}
      />
      <Spacing height={16} />
      <Picker
        label="Every"
        options={range(1, 999).map((i) => ({
          value: i,
          label: `${i} ${label}`,
        }))}
        value={value?.time?.recurrence?.interval ?? 1}
        onChange={handleChangeInterval}
      />
      <Spacing height={8} />
      {content}
    </Container>
  );
}

function RecurrenceEndRepeatOptions() {
  const { value, onChange } = useReminder();
  const { back } = useNavigation();
  const recurrence = value?.time?.recurrence;

  if (!recurrence) {
    throw new Error('Expected recurrence');
  }

  const handleRecurrenceChange = React.useCallback(
    (rec: Recurrence | null) => {
      if (value && value.time) {
        onChange({
          place: value.place,
          time: {
            date: value.time.date,
            time: value.time.time,
            recurrence: rec,
          },
        });
      }
    },
    [value, onChange],
  );

  const handleChangeOption = React.useCallback(
    (option: number) => {
      switch (option) {
        case 1:
          handleRecurrenceChange({
            ...recurrence,
            until: null,
            count: null,
          });
          break;
        case 2:
          switch (recurrence.frequency) {
            case Frequency.Yearly:
              handleRecurrenceChange({
                ...recurrence,
                until: addYears(recurrence.startDate, 1),
                count: null,
              });
              break;
            case Frequency.Monthly:
              handleRecurrenceChange({
                ...recurrence,
                until: addMonths(recurrence.startDate, 1),
                count: null,
              });
              break;
            case Frequency.Weekly:
              handleRecurrenceChange({
                ...recurrence,
                until: addWeeks(recurrence.startDate, 1),
                count: null,
              });
              break;
            case Frequency.Daily:
              handleRecurrenceChange({
                ...recurrence,
                until: addDays(recurrence.startDate, 1),
                count: null,
              });
              break;
            default:
              handleRecurrenceChange({
                ...recurrence,
                until: new Date(),
                count: null,
              });
          }
          break;
        case 3:
          handleRecurrenceChange({
            ...recurrence,
            until: null,
            count: 10,
          });
          break;
        default:
          throw new Error('Invalid option');
      }
    },
    [recurrence, handleRecurrenceChange],
  );

  const handleChangeDate = React.useCallback(
    (date: Date) => {
      handleRecurrenceChange({
        ...recurrence,
        until: date,
        count: null,
      });
    },
    [recurrence, handleRecurrenceChange],
  );

  const handleChangeCount = React.useCallback(
    (count?: number) => {
      handleRecurrenceChange({
        ...recurrence,
        until: null,
        count,
      });
    },
    [recurrence, handleRecurrenceChange],
  );

  let selected: 1 | 2 | 3 = 1;

  if (recurrence.until) {
    selected = 2;
  }

  if (recurrence.count) {
    selected = 3;
  }

  let content: React.ReactNode;

  switch (selected) {
    case 1:
      content = null;
      break;
    case 2:
      if (!recurrence.until) {
        return null;
      }

      content = (
        <DayPicker
          isOutsideRange={(date) => {
            return (
              isBefore(date, recurrence.startDate) ||
              isSameDay(date, recurrence.startDate)
            );
          }}
          value={recurrence.until}
          onChange={handleChangeDate}
        />
      );
      break;
    case 3:
      content = (
        <Picker
          label="After"
          options={range(1, 999).map((i) => ({
            value: i,
            label: `${i} occurrences`,
          }))}
          value={recurrence.count ?? undefined}
          onChange={handleChangeCount}
        />
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <Container expanded>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <Content>
        <Text size="lg" bold>
          Ends repeat
        </Text>
        <Spacing height={8} />
        <SegmentedControl
          value={selected}
          onChange={handleChangeOption}
          options={[
            { value: 1, label: 'Never' },
            { value: 2, label: 'By date' },
            { value: 3, label: 'By count' },
          ]}
        />
        <Spacing height={16} />
        {content}
      </Content>
    </Container>
  );
}

interface Option {
  label: string;
  value: Recurrence;
  selected?: boolean;
}

interface RecurrencePickerButtonProps {
  onPress?: () => void;
  label?: string;
  description?: string;
  placeholder?: string;
}

export function RecurrencePickerButton(props: RecurrencePickerButtonProps) {
  const { description, placeholder, label, onPress } = props;

  return (
    <Button onPress={onPress} style={styles.button}>
      <Container
        paddingVertical={8}
        paddingLeft={16}
        paddingRight={40}
        shape="rounded"
        height={56}
      >
        <Column expanded justifyContent="center">
          <Text bold size="xs">
            {label}
          </Text>
          <Text color={description ? 'default' : 'muted'}>
            {description || placeholder}
          </Text>
        </Column>
      </Container>
      <View style={styles.arrowRight}>
        <Icon name="chevron-right" size="lg" />
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  arrowRight: {
    position: 'absolute',
    right: 16,
    top: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
