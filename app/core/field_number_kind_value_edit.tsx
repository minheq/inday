import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput,
  StyleSheet,
} from 'react-native';
import { toNumber } from '../../lib/number_utils';
import { tokens } from '../components/tokens';
import { NumberFieldKind, NumberFieldKindValue } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldNumberKindValueEditProps<T extends NumberFieldKindValue> {
  autoFocus: boolean;
  recordID: RecordID;
  field: NumberFieldKind;
  value: T;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function FieldNumberKindValueEdit<T extends NumberFieldKindValue>(
  props: FieldNumberKindValueEditProps<T>,
): JSX.Element {
  const { recordID, field, value, onKeyPress } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<NumberFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, field.id, toNumber(nextValue));
    },
    [updateRecordFieldValue, recordID, field],
  );

  return (
    <TextInput
      onKeyPress={onKeyPress}
      onChangeText={handleChange}
      value={value ? value.toString() : ''}
      style={styles.numberCellInput}
    />
  );
}

const styles = StyleSheet.create({
  numberCellInput: {
    height: 32,
    borderRadius: tokens.border.radius,
    textAlign: 'right',
    ...tokens.text.size.md,
  },
});
