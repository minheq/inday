import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInput,
  Platform,
} from 'react-native';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import { TextFieldKindValue } from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';

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
  const themeStyles = useThemeStyles();

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (key === UIKey.Escape) {
        onRequestClose();
      }
      if (key === WhiteSpaceKey.Enter) {
        onSubmitEditing();
      }
    },
    [onSubmitEditing, onRequestClose],
  );

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange(nextValue as T);
    },
    [onChange],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={handleKeyPress}
      onChangeText={handleChange}
      value={value}
      style={[styles.textCellInput, themeStyles.text.default]}
    />
  );
}

const styles = StyleSheet.create({
  textCellInput: {
    height: 40,
    paddingHorizontal: 8,
    ...tokens.text.size.md,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
