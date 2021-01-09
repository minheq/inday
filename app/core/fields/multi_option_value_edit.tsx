import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  MultiOptionField,
} from '../../../models/fields';
import { MultiSelectKindPicker } from './multi_select_kind_value_edit';
import {
  useGetOptionOptions,
  useRenderOption,
} from './single_option_value_edit';

interface MultiOptionPickerProps {
  value: MultiOptionFieldValue;
  field: MultiOptionField;
  onChange: (value: MultiOptionFieldValue) => void;
  onRequestClose: () => void;
}

export function MultiOptionPicker(props: MultiOptionPickerProps): JSX.Element {
  const { value, field, onChange, onRequestClose } = props;

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <MultiSelectKindPicker<SelectOptionID>
      value={value}
      onChange={onChange}
      renderLabel={renderOption}
      options={options}
      onRequestClose={onRequestClose}
    />
  );
}
