import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  MultiOptionField,
} from '../../../models/fields';
import { ListMultiPicker } from '../../components/list_multi_picker';
import { useGetOptionOptions, useRenderOption } from './option_picker';

interface MultiOptionPickerProps {
  value: SelectOptionID[];
  field: MultiOptionField;
  onChange: (value: MultiOptionFieldValue) => void;
  onRequestClose: () => void;
}

export function MultiOptionPicker(props: MultiOptionPickerProps): JSX.Element {
  const { value, field, onChange, onRequestClose } = props;

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <ListMultiPicker<SelectOptionID>
      value={value}
      options={options}
      renderLabel={renderOption}
      onChange={onChange}
      onRequestClose={onRequestClose}
    />
  );
}
