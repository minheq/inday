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
import { TextFieldKind, TextFieldKindValue } from '../../data/fields';
import { RecordID } from '../../data/records';
import { useUpdateRecordFieldValue } from '../../data/store';

interface FieldTextKindValueEditProps<T extends TextFieldKindValue> {
  autoFocus: boolean;
  recordID: RecordID;
  field: TextFieldKind;
  value: T;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function FieldTextKindValueEdit<T extends TextFieldKindValue>(
  props: FieldTextKindValueEditProps<T>,
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
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
      onChangeText={handleChange}
      value={value}
      style={[styles.textCellInput, themeStyles.text.default]}
    />
  );
}

const styles = StyleSheet.create({
  textCellInput: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 8,
    ...tokens.text.size.md,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
