import React from 'react';
import { Text } from './text';
import { StyleSheet, View } from 'react-native';
import { Button } from './button';
import { useTheme } from '../theme';

interface Option<TValue = any> {
  label: string;
  value: TValue;
}

interface SegmentedControlProps<TValue = any> {
  value?: TValue;
  onChange?: (value: TValue) => void;
  options?: Option<TValue>[];
}

export function SegmentedControl(props: SegmentedControlProps) {
  const { value, onChange = () => {}, options = [] } = props;
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <Button
            key={option.value}
            style={[
              styles.control,
              selected && {
                backgroundColor: theme.container.color.primary,
              },
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text color={selected ? 'white' : 'default'}>{option.label}</Text>
          </Button>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
    height: 40,
  },
});
