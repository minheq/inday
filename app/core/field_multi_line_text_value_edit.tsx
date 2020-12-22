import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInput,
} from 'react-native';
import { useThemeStyles } from '../components/theme';
import { tokens } from '../components/tokens';
import {
  MultiLineTextField,
  MultiLineTextFieldValue,
  TextFieldKindValue,
} from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldMultiLineTextValueEditProps {
  autoFocus: boolean;
  recordID: RecordID;
  field: MultiLineTextField;
  value: MultiLineTextFieldValue;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function FieldMultiLineTextValueEdit(
  props: FieldMultiLineTextValueEditProps,
): JSX.Element {
  const { autoFocus, recordID, field, value, onKeyPress } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<TextFieldKindValue>();
  const themeStyles = useThemeStyles();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, field.id, nextValue);
    },
    [updateRecordFieldValue, recordID, field],
  );

  return (
    <TextInput
      multiline
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
      onChangeText={handleChange}
      value={value}
      style={[styles.multilineTextCellInput, themeStyles.text.default]}
    />
  );
}

const styles = StyleSheet.create({
  multilineTextCellInput: {
    width: '100%',
    minHeight: 128,
    paddingTop: 8,
    paddingHorizontal: 8,
    borderRadius: tokens.border.radius,
    ...tokens.text.size.md,
  },
});
