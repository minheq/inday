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
import { TextFieldKind, TextFieldKindValue } from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { useUpdateDocumentFieldValue } from '../../store/mutations';

interface TextKindValueEditProps<T extends TextFieldKindValue> {
  autoFocus: boolean;
  documentID: DocumentID;
  field: TextFieldKind;
  value: T;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
}

export function TextKindValueEdit<T extends TextFieldKindValue>(
  props: TextKindValueEditProps<T>,
): JSX.Element {
  const { autoFocus, documentID, field, value, onKeyPress } = props;
  const updateDocumentFieldValue = useUpdateDocumentFieldValue<TextFieldKindValue>();
  const themeStyles = useThemeStyles();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateDocumentFieldValue(documentID, field.id, nextValue);
    },
    [updateDocumentFieldValue, documentID, field],
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
