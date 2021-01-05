import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatISODate, parseISODate } from '../../../lib/date_utils';
import { DocumentID } from '../../../models/documents';
import { DateField, DateFieldValue } from '../../../models/fields';
import { DatePicker } from '../../components/date_picker';
import { FlatButton } from '../../components/flat_button';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

interface DateValueEditProps {
  documentID: DocumentID;
  field: DateField;
  value: DateFieldValue;
  onDone: () => void;
}

export function DateValueEdit(props: DateValueEditProps): JSX.Element {
  const { value, documentID, field, onDone } = props;
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation<DateFieldValue>();

  const handleChangeDate = useCallback(
    async (date: Date) => {
      await updateDocumentFieldValue(documentID, field.id, formatISODate(date));
      onDone();
    },
    [updateDocumentFieldValue, onDone, documentID, field],
  );

  const handleClear = useCallback(async () => {
    await updateDocumentFieldValue(documentID, field.id, null);
  }, [updateDocumentFieldValue, documentID, field]);

  return (
    <View style={styles.root}>
      <DatePicker
        value={value ? parseISODate(value) : null}
        onChange={handleChangeDate}
      />
      <View style={styles.actionRow}>
        <FlatButton onPress={handleClear} title="Clear" />
        <FlatButton onPress={onDone} color="primary" title="Done" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  actionRow: {
    paddingTop: 24,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
