import React from 'react';

import {
  SelectOptionID,
  MultiOptionField,
  MultiOptionFieldValue,
} from '../data/fields';
import { Record } from '../data/records';
import { FieldMultiSelectKindInput } from './field_multi_select_kind_input';
import {
  useGetOptionOptions,
  useRenderOption,
} from './field_single_option_input';

interface FieldMultiOptionInputProps {
  record: Record;
  field: MultiOptionField;
  value: MultiOptionFieldValue;
  onDone: () => void;
}

export function FieldMultiOptionInput(
  props: FieldMultiOptionInputProps,
): JSX.Element {
  const { record, field, value, onDone } = props;
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <FieldMultiSelectKindInput<SelectOptionID>
      recordID={record.id}
      fieldID={field.id}
      renderLabel={renderOption}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
