import React, { useCallback } from 'react';

import { ListPicker, ListPickerOption } from '../../components/list_picker';
import { SelectOptionID } from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { CollaboratorID } from '../../../models/collaborators';

interface SingleSelectKindPickerProps<
  T extends CollaboratorID | DocumentID | SelectOptionID
> {
  value: T | null;
  onChange: (value: T) => void;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onRequestClose: () => void;
}

export function SingleSelectKindPicker<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: SingleSelectKindPickerProps<T>): JSX.Element {
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
