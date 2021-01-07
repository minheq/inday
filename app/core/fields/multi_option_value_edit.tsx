import React from 'react';
import { DocumentID } from '../../../models/documents';

import {
  SelectOptionID,
  FieldID,
  assertMultiOptionField,
  assertMultiOptionFieldValue,
} from '../../../models/fields';
import { useDocumentFieldValueQuery, useFieldQuery } from '../../store/queries';
import { MultiOptionValueView } from './multi_option_value_view';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetOptionOptions,
  useRenderOption,
} from './single_option_value_edit';

interface MultiOptionValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
}

export function MultiOptionValueEdit(
  props: MultiOptionValueEditProps,
): JSX.Element {
  const { fieldID, documentID, onRequestClose } = props;
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertMultiOptionFieldValue(value);
  const field = useFieldQuery(fieldID);
  assertMultiOptionField(field);
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <MultiSelectKindValueEdit<SelectOptionID>
      fieldID={fieldID}
      documentID={documentID}
      renderLabel={renderOption}
      options={options}
      onRequestClose={onRequestClose}
    >
      <MultiOptionValueView value={value} field={field} />
    </MultiSelectKindValueEdit>
  );
}
