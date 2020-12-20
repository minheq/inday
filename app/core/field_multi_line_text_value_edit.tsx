import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInput,
} from 'react-native';
import { tokens } from '../components/tokens';
import {
  FieldID,
  MultiLineTextFieldValue,
  TextFieldKindValue,
} from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldMultiLineTextValueEditProps {
  autoFocus: boolean;
  recordID: RecordID;
  fieldID: FieldID;
  value: MultiLineTextFieldValue;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function FieldMultiLineTextValueEdit(
  props: FieldMultiLineTextValueEditProps,
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
      multiline
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
      onChangeText={handleChange}
      value={value}
      style={styles.multilineTextCellInput}
    />
  );
}

const styles = StyleSheet.create({
  multilineTextCellInput: {
    paddingTop: 3 + 1,
    minHeight: 128,
    borderRadius: tokens.border.radius,
    ...tokens.text.size.md,
  },
});
