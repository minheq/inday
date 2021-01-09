import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { formatISODate, parseISODate } from '../../../lib/date_utils';
import { DocumentID } from '../../../models/documents';
import {
  assertDateField,
  assertDateFieldValue,
  DateFieldValue,
  FieldID,
} from '../../../models/fields';
import { DatePicker } from '../../components/date_picker';
import { FlatButton } from '../../components/flat_button';
import { PressableHighlightPopover } from '../../components/pressable_highlight_popover';
import { Spacer } from '../../components/spacer';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';
import { useDocumentFieldValueQuery, useFieldQuery } from '../../store/queries';
import { DateValueView } from './date_value_view';

interface DateValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
}

export function DateValueEdit(props: DateValueEditProps): JSX.Element {
  const { fieldID, documentID } = props;
  const field = useFieldQuery(fieldID);
  assertDateField(field);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertDateFieldValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleChange = useCallback(
    async (nextValue: DateFieldValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  const handleClear = useCallback(async () => {
    await updateDocumentFieldValue(documentID, fieldID, null);
  }, [updateDocumentFieldValue, documentID, fieldID]);

  return (
    <PressableHighlightPopover
      content={({ onRequestClose }) => (
        <View>
          <DateValueInput
            value={value}
            onChange={handleChange}
            onRequestClose={onRequestClose}
          />
          <Spacer size={16} />
          <View style={styles.actions}>
            <FlatButton onPress={handleClear} title="Clear" />
            <FlatButton onPress={onRequestClose} title="Done" color="primary" />
          </View>
        </View>
      )}
      style={styles.pressable}
    >
      <DateValueView field={field} value={value} />
    </PressableHighlightPopover>
  );
}

interface DateValueInputProps {
  value: DateFieldValue;
  onChange: (value: DateFieldValue) => void;
  onRequestClose: () => void;
}

export function DateValueInput(props: DateValueInputProps): JSX.Element {
  const { value, onChange, onRequestClose } = props;

  const handleChangeDate = useCallback(
    (date: Date) => {
      onRequestClose();
      onChange(formatISODate(date));
    },
    [onChange, onRequestClose],
  );

  return (
    <DatePicker
      value={value ? parseISODate(value) : null}
      onChange={handleChangeDate}
    />
  );
}

const styles = StyleSheet.create({
  pressable: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
