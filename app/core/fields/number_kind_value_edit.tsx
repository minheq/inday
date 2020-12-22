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
import { NumberFieldKind, NumberFieldKindValue } from '../../data/fields';
import { RecordID } from '../../data/records';
import { useUpdateRecordFieldValue } from '../../data/store';

interface NumberKindValueEditProps<T extends NumberFieldKindValue> {
  autoFocus: boolean;
  recordID: RecordID;
  field: NumberFieldKind;
  value: T;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function NumberKindValueEdit<T extends NumberFieldKindValue>(
  props: NumberKindValueEditProps<T>,
): JSX.Element {
  const { autoFocus, recordID, field, value, onKeyPress } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<NumberFieldKindValue>();
  const themeStyles = useThemeStyles();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, field.id, toNumber(nextValue));
    },
    [updateRecordFieldValue, recordID, field],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
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
