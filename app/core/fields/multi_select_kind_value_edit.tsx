import React, { useCallback } from 'react';

import { ListPickerOption } from '../../components/list_picker';
import { MultiListPicker } from '../../components/multi_list_picker';
import { CollaboratorID } from '../../../models/collaborators';
import { SelectOptionID } from '../../../models/fields';
import { DocumentID } from '../../../models/documents';

interface MultiSelectKindPickerProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onRequestClose: () => void;
}

export function MultiSelectKindPicker<
  T extends CollaboratorID | DocumentID | SelectOptionID
>(props: MultiSelectKindPickerProps<T>): JSX.Element {
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
