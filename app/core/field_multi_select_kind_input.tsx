import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatButton } from '../components/flat_button';
import { ListPickerOption } from '../components/list_picker';
import { MultiListPicker } from '../components/multi_list_picker';
import { CollaboratorID } from '../data/collaborators';
import {
  FieldID,
  MultiSelectFieldKindValue,
  SelectOptionID,
} from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldMultiSelectKindInputProps<T> {
  recordID: RecordID;
  fieldID: FieldID;
  value: T[];
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onDone: () => void;
}

export function FieldMultiSelectKindInput<
  T extends CollaboratorID | RecordID | SelectOptionID
>(props: FieldMultiSelectKindInputProps<T>): JSX.Element {
  const { onDone, value, options, renderLabel, recordID, fieldID } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<MultiSelectFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: T[]) => {
      updateRecordFieldValue(
        recordID,
        fieldID,
        nextValue as MultiSelectFieldKindValue,
      );
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, []);
    onDone();
  }, [updateRecordFieldValue, recordID, fieldID, onDone]);

  return (
    <View>
      <MultiListPicker<T>
        value={value}
        options={options}
        renderLabel={renderLabel}
        onChange={handleChange}
        onRequestClose={onDone}
      />
      <View style={styles.actionRow}>
        <FlatButton onPress={handleClear} title="Clear all" />
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
