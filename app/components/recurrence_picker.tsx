import React from 'react';
import { Frequency, Recurrence } from '../modules/recurrence';
import { ListItem } from './list_item';
import { Container } from './container';
import { Spacing } from './spacing';
import { BackButton } from './back_button';
import { Row } from './row';
import { useNavigation } from './navigation';
import { Icon } from './icon';
import { View, StyleSheet } from 'react-native';
import { Button } from './button';
import { Column } from './column';
import { Text } from './text';

interface RecurrencePickerProps {
  startDate: Date;
  value?: Recurrence | null;
  onChange?: (value: Recurrence | null) => void;
}

export function RecurrencePicker(props: RecurrencePickerProps) {
  const { onChange, value, startDate } = props;
  const { navigate } = useNavigation();

  return (
    <Container>
      <RecurrencePickerButton
        label="Repeat"
        description="Does not repeat"
        onPress={() =>
          navigate(
            <RecurrenceOptions
              onChange={onChange}
              value={value}
              startDate={startDate}
            />,
          )
        }
      />
    </Container>
  );
}

function RecurrenceOptions(props: RecurrencePickerProps) {
  const { onChange = () => {}, value, startDate } = props;
  const { back } = useNavigation();

  const options: Option[] = [
    { label: 'Daily', value: { startDate, frequency: Frequency.Daily } },
    { label: 'Weekly', value: { startDate, frequency: Frequency.Weekly } },
    {
      label: 'Biweekly',
      value: { startDate, frequency: Frequency.Weekly, interval: 2 },
    },
    { label: 'Monthly', value: { startDate, frequency: Frequency.Monthly } },
    {
      label: 'Every 3 months',
      value: { startDate, frequency: Frequency.Monthly, interval: 3 },
    },
    {
      label: 'Every 6 months',
      value: { startDate, frequency: Frequency.Monthly, interval: 6 },
    },
    { label: 'Yearly', value: { startDate, frequency: Frequency.Yearly } },
  ].map((o) => {
    return {
      label: o.label,
      value: o.value,
      selected:
        o.value.frequency === value?.frequency &&
        o.value.interval === value?.interval,
    };
  });

  return (
    <Container>
      <Row>
        <BackButton onPress={back} />
      </Row>
      <ListItem
        description="Does not repeat"
        onPress={() => {
          onChange(null);
          back();
        }}
        actions={
          value === null && <Icon name="check" color="primary" size="lg" />
        }
      />
      {options.map((o) => (
        <ListItem
          key={o.label}
          onPress={() => {
            onChange(o.value);
            back();
          }}
          description={o.label}
          actions={
            o.selected && <Icon name="check" color="primary" size="lg" />
          }
        />
      ))}
      <Spacing height={16} />
      <ListItem description="Custom" />
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
