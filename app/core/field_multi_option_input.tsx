import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  FieldID,
  assertMultiOptionField,
} from '../data/fields';
import { RecordID } from '../data/records';
import { useGetField } from '../data/store';
import { FieldMultiSelectKindInput } from './field_multi_select_kind_input';
import {
  useGetOptionOptions,
  useRenderOption,
} from './field_single_option_input';

interface FieldMultiOptionInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: MultiOptionFieldValue;
  onDone: () => void;
}

export function FieldMultiOptionInput(
  props: FieldMultiOptionInputProps,
): JSX.Element {
  const { recordID, fieldID, value, onDone } = props;
  const field = useGetField(fieldID);
  assertMultiOptionField(field);
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <FieldMultiSelectKindInput<SelectOptionID>
      recordID={recordID}
      fieldID={fieldID}
      renderLabel={renderOption}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
