import React, { useCallback } from 'react';
import { Picker as RNPicker } from '@react-native-community/picker';

import { StyleSheet } from 'react-native';
import { tokens, useTheme } from './theme';

export interface Option<TValue extends string | number = any> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface PickerProps<TValue extends string | number = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value?: TValue) => void;
  disabled?: boolean;
}

export function Picker<TValue extends string | number = any>(
  props: PickerProps<TValue>,
) {
  const { value, options, onChange = () => {} } = props;
  const theme = useTheme();

  const handleChange = useCallback(
    (newValue: string | number) => {
      onChange(newValue as TValue);
    },
    [onChange],
  );

  return (
    <RNPicker
      style={[
        styles.picker,
        {
          borderColor: theme.border.color.default,
          color: theme.text.color.default,
        },
      ]}
      selectedValue={value}
      onValueChange={handleChange}
    >
      {options.map((o) => (
        <RNPicker.Item label={o.label} value={o.value} />
      ))}
    </RNPicker>
  );
}

const styles = StyleSheet.create({
  picker: {
    padding: 8,
    borderRadius: tokens.radius,
    ...tokens.text.size.md,
  },
});
