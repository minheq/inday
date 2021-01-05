import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatButton } from '../../components/flat_button';
import { ListPickerOption } from '../../components/list_picker';
import { MultiListPicker } from '../../components/multi_list_picker';
import { CollaboratorID } from '../../../models/collaborators';
import {
  FieldID,
  MultiSelectFieldKindValue,
  SelectOptionID,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

interface MultiSelectKindValueEditProps<T> {
  documentID: DocumentID;
  fieldID: FieldID;
  value: T[];
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onDone: () => void;
}

export function MultiSelectKindValueEdit<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: MultiSelectKindValueEditProps<T>): JSX.Element {
  const { onDone, value, options, renderLabel, documentID, fieldID } = props;
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation<MultiSelectFieldKindValue>();

  const handleChange = useCallback(
    async (nextValue: T[]) => {
      await updateDocumentFieldValue(
        documentID,
        fieldID,
        nextValue as MultiSelectFieldKindValue,
      );
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  const handleClear = useCallback(async () => {
    await updateDocumentFieldValue(documentID, fieldID, []);
    onDone();
  }, [updateDocumentFieldValue, documentID, fieldID, onDone]);

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
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
