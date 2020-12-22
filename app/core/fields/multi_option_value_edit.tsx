import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  MultiOptionField,
} from '../../data/fields';
import { RecordID } from '../../data/records';
import { FieldMultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetOptionOptions,
  useRenderOption,
} from './single_option_value_edit';

interface FieldMultiOptionValueEditProps {
  recordID: RecordID;
  field: MultiOptionField;
  value: MultiOptionFieldValue;
  onDone: () => void;
}

export function FieldMultiOptionValueEdit(
  props: FieldMultiOptionValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <FieldMultiSelectKindValueEdit<SelectOptionID>
      recordID={recordID}
      fieldID={field.id}
      renderLabel={renderOption}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
