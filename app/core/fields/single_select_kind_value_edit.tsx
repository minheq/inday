import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlatButton } from '../../components/flat_button';
import { ListPicker, ListPickerOption } from '../../components/list_picker';
import { FieldID, SingleSelectFieldKindValue } from '../../data/fields';
import { RecordID } from '../../data/records';
import { useUpdateRecordFieldValue } from '../../data/store';

interface FieldSingleSelectKindValueEditProps<
  T extends SingleSelectFieldKindValue
> {
  recordID: RecordID;
  fieldID: FieldID;
  value: T;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onDone: () => void;
}

export function FieldSingleSelectKindValueEdit<
  T extends SingleSelectFieldKindValue
>(props: FieldSingleSelectKindValueEditProps<T>): JSX.Element {
  const { onDone, value, options, renderLabel, recordID, fieldID } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<SingleSelectFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: SingleSelectFieldKindValue) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
      onDone();
    },
    [updateRecordFieldValue, recordID, fieldID, onDone],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, null);
    onDone();
  }, [updateRecordFieldValue, recordID, fieldID, onDone]);

  return (
    <View>
      <ListPicker<T>
        value={value}
        options={options}
        renderLabel={renderLabel}
        onChange={handleChange}
        onRequestClose={onDone}
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
