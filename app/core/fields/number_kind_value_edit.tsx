import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import { toNumber } from '../../../lib/number_utils';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import {
  assertNumberFieldKindValue,
  FieldID,
  NumberFieldKindValue,
} from '../../../models/fields';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';
import { DocumentID } from '../../../models/documents';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';
import { useDocumentFieldValueQuery } from '../../store/queries';
import { FlatButton } from '../../components/flat_button';

interface NumberKindValueEditProps {
  autoFocus: boolean;
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function NumberKindValueEdit(
  props: NumberKindValueEditProps,
): JSX.Element {
  const {
    autoFocus,
    fieldID,
    documentID,
    onRequestClose,
    onSubmitEditing,
  } = props;

  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertNumberFieldKindValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleChange = useCallback(
    async (nextValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  return (
    <View>
      <NumberKindValueInput
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

interface NumberKindValueInputProps<T extends NumberFieldKindValue> {
  value: T;
  onChange: (value: T) => void;
  autoFocus: boolean;
  onRequestClose: () => void;
  onSubmitEditing: () => void;
}

export function NumberKindValueInput<T extends NumberFieldKindValue>(
  props: NumberKindValueInputProps<T>,
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
      if (nextValue === '') {
        onChange(null as T);
      } else {
        onChange(toNumber(nextValue) as T);
      }
    },
    [onChange],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={handleKeyPress}
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
  actionsWrapper: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
