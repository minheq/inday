import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInput,
  Platform,
  View,
} from 'react-native';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import {
  assertMultiLineTextFieldValue,
  FieldID,
  MultiLineTextFieldValue,
} from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';
import { DocumentID } from '../../../models/documents';
import { useDocumentFieldValueQuery } from '../../store/queries';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';
import { FlatButton } from '../../components/flat_button';

interface MultiLineTextValueEditProps {
  autoFocus: boolean;
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function MultiLineTextValueEdit(
  props: MultiLineTextValueEditProps,
): JSX.Element {
  const {
    autoFocus,
    fieldID,
    documentID,
    onRequestClose,
    onSubmitEditing,
  } = props;
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertMultiLineTextFieldValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleChange = useCallback(
    async (nextValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  return (
    <View>
      <MultiLineTextValueInput
        autoFocus={autoFocus}
        onChange={handleChange}
        value={value}
        onRequestClose={onRequestClose}
        onSubmitEditing={onSubmitEditing}
      />
      <View style={styles.actionsWrapper}>
        <FlatButton onPress={onRequestClose} title="Done" color="primary" />
      </View>
    </View>
  );
}

interface MultiLineTextValueInputProps {
  autoFocus: boolean;
  onChange: (value: MultiLineTextFieldValue) => void;
  value: MultiLineTextFieldValue;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function MultiLineTextValueInput(
  props: MultiLineTextValueInputProps,
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
      onChange(nextValue);
    },
    [onChange],
  );

  return (
    <TextInput
      multiline
      autoFocus={autoFocus}
      onKeyPress={handleKeyPress}
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
  actionsWrapper: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
