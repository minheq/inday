import React, { useCallback } from 'react';

import { ListPicker, ListPickerOption } from '../../components/list_picker';
import { SingleSelectFieldKindValue } from '../../../models/fields';

interface SingleSelectKindValueEditProps<T extends SingleSelectFieldKindValue> {
  value: T;
  onChange: (value: T) => void;
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
  onRequestClose: () => void;
}

export function SingleSelectKindValueEdit<T extends SingleSelectFieldKindValue>(
  props: SingleSelectKindValueEditProps<T>,
): JSX.Element {
  const { onChange, value, options, renderLabel, onRequestClose } = props;

  const handleChange = useCallback(
    (nextValue: T) => {
      onChange(nextValue);
    },
    [onChange],
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
