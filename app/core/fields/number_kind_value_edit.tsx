import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { toNumber } from '../../../lib/number_utils';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import { NumberFieldKindValue } from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';

interface NumberKindValueEditProps<T extends NumberFieldKindValue> {
  value: T;
  onChange: (value: T) => void;
  autoFocus: boolean;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function NumberKindValueEdit<T extends NumberFieldKindValue>(
  props: NumberKindValueEditProps<T>,
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
      onChangeText={handleChange}
      value={value ? value.toString() : ''}
      style={[styles.numberCellInput, themeStyles.text.default]}
    />
  );
}

const styles = StyleSheet.create({
  numberCellInput: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 8,
    textAlign: 'right',
    ...tokens.text.size.md,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
