import React, { useCallback } from 'react';
import { StyleSheet, Platform } from 'react-native';

import { TextFieldKindValue } from '../../../models/fields';
import { TextInput } from '../../components/text_input';

interface TextKindValueInputProps<T extends TextFieldKindValue> {
  autoFocus: boolean;
  value: T;
  onChange: (value: T) => void;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function TextKindValueInput<T extends TextFieldKindValue>(
  props: TextKindValueInputProps<T>,
): JSX.Element {
  const { autoFocus, onChange, value, onRequestClose, onSubmitEditing } = props;

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange(nextValue as T);
    },
    [onChange],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onRequestClose={onRequestClose}
      onSubmitEditing={onSubmitEditing}
      onChange={handleChange}
      value={value}
      style={styles.textCellInput}
    />
  );
}

const styles = StyleSheet.create({
  textCellInput: {
    height: 40,
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
