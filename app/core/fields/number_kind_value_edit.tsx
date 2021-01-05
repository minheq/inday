import React, { useCallback } from 'react';
import {
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { toNumber } from '../../../lib/number_utils';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import { NumberFieldKind, NumberFieldKindValue } from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

interface NumberKindValueEditProps<T extends NumberFieldKindValue> {
  autoFocus: boolean;
  documentID: DocumentID;
  field: NumberFieldKind;
  value: T;
  onKeyPress: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
}

export function NumberKindValueEdit<T extends NumberFieldKindValue>(
  props: NumberKindValueEditProps<T>,
): JSX.Element {
  const { autoFocus, documentID, field, value, onKeyPress } = props;
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation<NumberFieldKindValue>();
  const themeStyles = useThemeStyles();

  const handleChange = useCallback(
    async (nextValue: string) => {
      await updateDocumentFieldValue(documentID, field.id, toNumber(nextValue));
    },
    [updateDocumentFieldValue, documentID, field],
  );

  return (
    <TextInput
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
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
});
