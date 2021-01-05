import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { FlatButton } from '../../components/flat_button';
import { ListPicker, ListPickerOption } from '../../components/list_picker';
import { FieldID, SingleSelectFieldKindValue } from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

interface SingleSelectKindValueEditProps<T extends SingleSelectFieldKindValue> {
  documentID: DocumentID;
  fieldID: FieldID;
  value: T;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onDone: () => void;
}

export function SingleSelectKindValueEdit<T extends SingleSelectFieldKindValue>(
  props: SingleSelectKindValueEditProps<T>,
): JSX.Element {
  const { onDone, value, options, renderLabel, documentID, fieldID } = props;
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation<SingleSelectFieldKindValue>();

  const handleChange = useCallback(
    async (nextValue: SingleSelectFieldKindValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
      onDone();
    },
    [updateDocumentFieldValue, documentID, fieldID, onDone],
  );

  const handleClear = useCallback(async () => {
    await updateDocumentFieldValue(documentID, fieldID, null);
    onDone();
  }, [updateDocumentFieldValue, documentID, fieldID, onDone]);

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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
