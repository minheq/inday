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
import { MultiLineTextFieldValue } from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';

interface MultiLineTextValueInputProps {
  autoFocus: boolean;
  onChange: (value: MultiLineTextFieldValue) => void;
  value: MultiLineTextFieldValue;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function MultiLineTextValueInput(
  props: MultiLineTextValueInputProps,
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
      onChange(nextValue);
    },
    [onChange],
  );

  return (
    <TextInput
      multiline
      autoFocus={autoFocus}
      onKeyPress={handleKeyPress}
      onChangeText={handleChange}
      value={value}
      style={[styles.multilineTextCellInput, themeStyles.text.default]}
    />
  );
}

const styles = StyleSheet.create({
  multilineTextCellInput: {
    minHeight: 128,
    paddingTop: 8,
    paddingHorizontal: 8,
    borderRadius: tokens.border.radius,
    ...tokens.text.size.md,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
