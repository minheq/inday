import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatISODate, parseISODate } from '../../lib/date_utils';
import { DatePicker } from '../components/date_picker';
import { FlatButton } from '../components/flat_button';
import { DateFieldValue, FieldID } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldDateInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: DateFieldValue;
  onDone: () => void;
}

export function FieldDateInput(props: FieldDateInputProps): JSX.Element {
  const { value, recordID, fieldID, onDone } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<DateFieldValue>();

  const handleChangeDate = useCallback(
    (date: Date) => {
      updateRecordFieldValue(recordID, fieldID, formatISODate(date));
      onDone();
    },
    [updateRecordFieldValue, onDone, recordID, fieldID],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, null);
  }, [updateRecordFieldValue, recordID, fieldID]);

  return (
    <View>
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
  actionRow: {
    paddingTop: 24,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
