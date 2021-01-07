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
  assertTextFieldKindValue,
  FieldID,
  TextFieldKindValue,
} from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';
import { DocumentID } from '../../../models/documents';
import { FlatButton } from '../../components/flat_button';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';
import { useDocumentFieldValueQuery } from '../../store/queries';

interface TextKindValueEditProps {
  autoFocus: boolean;
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function TextKindValueEdit(props: TextKindValueEditProps): JSX.Element {
  const {
    autoFocus,
    fieldID,
    documentID,
    onRequestClose,
    onSubmitEditing,
  } = props;

  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertTextFieldKindValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleChange = useCallback(
    async (nextValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  return (
    <View>
      <TextKindValueInput
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onRequestClose={onRequestClose}
        onSubmitEditing={onSubmitEditing}
      />
      <View style={styles.actionsWrapper}>
        <FlatButton onPress={onRequestClose} title="Done" color="primary" />
      </View>
    </View>
  );
}

interface TextKindValueInputProps<T extends TextFieldKindValue> {
  autoFocus: boolean;
  value: T;
  onChange: (value: T) => void;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function TextKindValueInput<T extends TextFieldKindValue>(
  props: TextKindValueInputProps<T>,
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
      onChange(nextValue as T);
    },
    [onChange],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={handleKeyPress}
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
  actionsWrapper: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
