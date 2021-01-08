import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { ListPickerOption } from '../../components/list_picker';
import { MultiListPicker } from '../../components/multi_list_picker';
import { CollaboratorID } from '../../../models/collaborators';
import {
  assertMultiSelectFieldKindValue,
  FieldID,
  MultiSelectFieldKindValue,
  SelectOptionID,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { PressableHighlightPopover } from '../../components/pressable_highlight_popover';
import { useDocumentFieldValueQuery } from '../../store/queries';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

interface MultiSelectKindValueEditProps<T> {
  fieldID: FieldID;
  documentID: DocumentID;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  children: React.ReactNode;
}

export function MultiSelectKindValueEdit<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: MultiSelectKindValueEditProps<T>): JSX.Element {
  const { fieldID, documentID, options, renderLabel, children } = props;
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertMultiSelectFieldKindValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

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

  return (
    <PressableHighlightPopover
      content={({ onRequestClose }) => (
        <MultiSelectKindValueInput<T>
          value={value as T[]}
          options={options}
          renderLabel={renderLabel}
          onChange={handleChange}
          onRequestClose={onRequestClose}
        />
      )}
      style={styles.pressable}
    >
      {children}
    </PressableHighlightPopover>
  );
}

interface MultiSelectKindValueInputProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onRequestClose: () => void;
}

export function MultiSelectKindValueInput<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: MultiSelectKindValueInputProps<T>): JSX.Element {
  const { onChange, value, options, onRequestClose, renderLabel } = props;

  const handleChange = useCallback(
    (nextValue: T[]) => {
      onChange(nextValue);
    },
    [onChange],
  );

  return (
    <MultiListPicker<T>
      value={value}
      options={options}
      renderLabel={renderLabel}
      onChange={handleChange}
      onRequestClose={onRequestClose}
    />
  );
}

const styles = StyleSheet.create({
  pressable: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
