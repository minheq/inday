import React, { useCallback } from 'react';

import { ListPicker, ListPickerOption } from '../../components/list_picker';
import {
  assertSingleSelectFieldKindValue,
  FieldID,
  SelectOptionID,
} from '../../../models/fields';
import { PressableHighlightPopover } from '../../components/pressable_highlight_popover';
import { useDocumentFieldValueQuery } from '../../store/queries';
import { DocumentID } from '../../../models/documents';
import { CollaboratorID } from '../../../models/collaborators';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

interface SingleSelectKindValueEditProps<T> {
  fieldID: FieldID;
  documentID: DocumentID;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  children: React.ReactNode;
}

export function SingleSelectKindValueEdit<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: SingleSelectKindValueEditProps<T>): JSX.Element {
  const { fieldID, documentID, options, renderLabel, children } = props;
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertSingleSelectFieldKindValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleChange = useCallback(
    async (nextValue: T) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  return (
    <PressableHighlightPopover
      content={({ onRequestClose }) => (
        <SingleSelectKindValueInput<T>
          value={value}
          options={options}
          renderLabel={renderLabel}
          onChange={handleChange}
          onRequestClose={onRequestClose}
        />
      )}
    >
      {children}
    </PressableHighlightPopover>
  );
}

interface SingleSelectKindValueInputProps<
  T extends CollaboratorID | DocumentID | SelectOptionID
> {
  value: T | null;
  onChange: (value: T) => void;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onRequestClose: () => void;
}

export function SingleSelectKindValueInput<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: SingleSelectKindValueInputProps<T>): JSX.Element {
  const { onChange, value, options, renderLabel, onRequestClose } = props;

  const handleChange = useCallback(
    (nextValue: T) => {
      onChange(nextValue);
      onRequestClose();
    },
    [onChange, onRequestClose],
  );

  return (
    <ListPicker<T>
      value={value}
      options={options}
      renderLabel={renderLabel}
      onChange={handleChange}
      onRequestClose={onRequestClose}
    />
  );
}
