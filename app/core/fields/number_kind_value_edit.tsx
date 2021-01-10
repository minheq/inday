import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleSheet,
  Platform,
} from 'react-native';
import { toNumber } from '../../../lib/number_utils';
import { useThemeStyles } from '../../components/theme';
import { NumberFieldKindValue } from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';
import { TextInput } from '../../components/text_input';

interface NumberKindValueInputProps<T extends NumberFieldKindValue> {
  value: T;
  onChange: (value: T) => void;
  autoFocus: boolean;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function NumberKindValueInput<T extends NumberFieldKindValue>(
  props: NumberKindValueInputProps<T>,
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
      if (nextValue === '') {
        onChange(null as T);
      } else {
        onChange(toNumber(nextValue) as T);
      }
    },
    [onChange],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      value={value ? value.toString() : ''}
      style={[styles.numberCellInput, themeStyles.text.default]}
    />
  );
}

const styles = StyleSheet.create({
  numberCellInput: {
    height: 40,
    paddingHorizontal: 8,
    textAlign: 'right',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
