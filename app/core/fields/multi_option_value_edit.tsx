import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  FieldID,
  assertMultiOptionField,
} from '../../../models/fields';
import { useFieldQuery } from '../../store/queries';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetOptionOptions,
  useRenderOption,
} from './single_option_value_edit';

interface MultiOptionValueEditProps {
  value: MultiOptionFieldValue;
  onChange: (value: MultiOptionFieldValue) => void;
  fieldID: FieldID;
  onRequestClose: () => void;
}

export function MultiOptionValueEdit(
  props: MultiOptionValueEditProps,
): JSX.Element {
  const { fieldID, value, onChange, onRequestClose } = props;
  const field = useFieldQuery(fieldID);
  assertMultiOptionField(field);
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <MultiSelectKindValueEdit<SelectOptionID>
      renderLabel={renderOption}
      options={options}
      value={value}
      onChange={onChange}
      onRequestClose={onRequestClose}
    />
  );
}
