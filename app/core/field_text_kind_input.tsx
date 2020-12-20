import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInput,
} from 'react-native';
import { tokens } from '../components/tokens';
import { FieldID, TextFieldKindValue } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldTextKindInputProps<T extends TextFieldKindValue> {
  autoFocus: boolean;
  recordID: RecordID;
  fieldID: FieldID;
  value: T;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function FieldTextKindInput<T extends TextFieldKindValue>(
  props: FieldTextKindInputProps<T>,
): JSX.Element {
  const { autoFocus, recordID, fieldID, value, onKeyPress } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<TextFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
      onChangeText={handleChange}
      value={value}
      style={styles.textCellInput}
    />
  );
}

const styles = StyleSheet.create({
  textCellInput: {
    height: 32,
    borderRadius: tokens.border.radius,
    ...tokens.text.size.md,
  },
});
