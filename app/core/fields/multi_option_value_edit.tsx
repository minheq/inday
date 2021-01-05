import React from 'react';

import {
  SelectOptionID,
  MultiOptionFieldValue,
  MultiOptionField,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetOptionOptions,
  useRenderOption,
} from './single_option_value_edit';

interface MultiOptionValueEditProps {
  documentID: DocumentID;
  field: MultiOptionField;
  value: MultiOptionFieldValue;
  onDone: () => void;
}

export function MultiOptionValueEdit(
  props: MultiOptionValueEditProps,
): JSX.Element {
  const { documentID, field, value, onDone } = props;
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <MultiSelectKindValueEdit<SelectOptionID>
      documentID={documentID}
      fieldID={field.id}
      renderLabel={renderOption}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
