import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatISODate, parseISODate } from '../../lib/date_utils';
import { DatePicker } from '../components/date_picker';
import { FlatButton } from '../components/flat_button';
import { DateField, DateFieldValue } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldDateValueEditProps {
  recordID: RecordID;
  field: DateField;
  value: DateFieldValue;
  onDone: () => void;
}

export function FieldDateValueEdit(
  props: FieldDateValueEditProps,
): JSX.Element {
  const { value, recordID, field, onDone } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<DateFieldValue>();

  const handleChangeDate = useCallback(
    (date: Date) => {
      updateRecordFieldValue(recordID, field.id, formatISODate(date));
      onDone();
    },
    [updateRecordFieldValue, onDone, recordID, field],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, field.id, null);
  }, [updateRecordFieldValue, recordID, field]);

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
