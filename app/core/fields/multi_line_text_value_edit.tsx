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
import {
  MultiLineTextField,
  MultiLineTextFieldValue,
  TextFieldKindValue,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { useUpdateDocumentFieldValue } from '../../store/queries';

interface MultiLineTextValueEditProps {
  autoFocus: boolean;
  documentID: DocumentID;
  field: MultiLineTextField;
  value: MultiLineTextFieldValue;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function MultiLineTextValueEdit(
  props: MultiLineTextValueEditProps,
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
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
