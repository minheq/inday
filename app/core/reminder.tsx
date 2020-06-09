import React from 'react';
import { Frequency, Recurrence } from '../modules/recurrence';
import { ListItem } from '../components/list_item';
import { Container } from '../components/container';
import { Spacing } from '../components/spacing';
import { BackButton } from '../components/back_button';
import { Row } from '../components/row';
import { useNavigation, NavigationProvider } from '../components/navigation';
import { Icon } from '../components/icon';
import { View, StyleSheet } from 'react-native';
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
import { TextInput } from '../components/text_input';
import { TimePicker } from '../components/time_picker';

interface ReminderContext {
  value?: Reminder | null;
  onChange: (value: Reminder) => void;
}

const ReminderContext = React.createContext<ReminderContext>({
  value: null,
  onChange: () => {},
});

function useReminder() {
  return React.useContext(ReminderContext);
}

export interface Reminder {
  time: ReminderTime | null;
  place: ReminderPlace | null;
}

interface ReminderTime {
  date: Date;
  time: Date | null;
  recurrence: Recurrence | null;
}

interface ReminderPlace {
  lat: number;
  lng: number;
  radius: number;
  when: 'leaving' | 'arriving';
}

interface ReminderProps {
  value?: Reminder | null;
  onChange: (value: Reminder) => void;
}

export function Reminder(props: ReminderProps) {
  return (
    <ReminderContext.Provider value={props}>
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
        />
      )}
      {value?.time?.date && <RecurrencePicker />}
    </Container>
  );
}

function formatRepeat(recurrence: Recurrence) {
  const { interval, frequency, byWeekDay } = recurrence;

  const frequencyText = {
    [Frequency.Yearly]: 'Year',
    [Frequency.Monthly]: 'Month',
    [Frequency.Weekly]: 'Week',
    [Frequency.Daily]: 'Day',
  };

  let text = `Every ${interval} ${frequencyText[frequency]}`;

  if (frequency === Frequency.Weekly && byWeekDay) {
    text += `on ${byWeekDay
      .map((weekDay) => format(setDay(new Date(), weekDay), 'EEE'))
      .join(', ')}`;
  }

  return text;
}

function formatEndRepeat(recurrence: Recurrence) {
  const { count, until } = recurrence;

  if (count) {
    return `After ${count} times`;
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
    <Container>
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
  const { value, onChange } = useReminder();
  const { back } = useNavigation();
  const options = useOptions();
  const selected = options.find((o) => o.selected);
  const custom = !selected && !!value?.time?.recurrence;

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
    <Container>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <ListItem
        description="Does not repeat"
        onPress={() => {
          handleRecurrenceChange(null);
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
            handleRecurrenceChange(o.value);
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
    (text: string) => {
      handleRecurrenceChange({
        ...recurrence,
        until: null,
        count: Number(text),
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
        <TextInput value={`${recurrence.count}`} onChange={handleChangeCount} />
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
