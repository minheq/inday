import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  MultiOptionField,
} from '../../data/fields';
import { RecordID } from '../../data/records';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetOptionOptions,
  useRenderOption,
} from './single_option_value_edit';

interface MultiOptionValueEditProps {
  recordID: RecordID;
  field: MultiOptionField;
  value: MultiOptionFieldValue;
  onDone: () => void;
}

export function MultiOptionValueEdit(
  props: MultiOptionValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <MultiSelectKindValueEdit<SelectOptionID>
      recordID={recordID}
      fieldID={field.id}
      renderLabel={renderOption}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
