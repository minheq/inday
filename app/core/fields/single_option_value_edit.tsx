import React, { Fragment, useCallback } from 'react';

import { ListPickerOption } from '../../components/list_picker';
import {
  assertSingleOptionField,
  assertSingleOptionFieldValue,
  FieldID,
  SelectOption,
  SelectOptionID,
} from '../../../models/fields';
import { OptionBadge } from './option_badge';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import { useDocumentFieldValueQuery, useFieldQuery } from '../../store/queries';
import { SingleOptionValueView } from './single_option_value_view';
import { DocumentID } from '../../../models/documents';

interface SingleOptionValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
}

export function SingleOptionValueEdit(
  props: SingleOptionValueEditProps,
): JSX.Element {
  const { fieldID, documentID } = props;
  const field = useFieldQuery(fieldID);
  assertSingleOptionField(field);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertSingleOptionFieldValue(value);
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <SingleSelectKindValueEdit<SelectOptionID>
      fieldID={fieldID}
      documentID={documentID}
      renderLabel={renderOption}
      options={options}
    >
      <SingleOptionValueView field={field} value={value} />
    </SingleSelectKindValueEdit>
  );
}

export function useRenderOption(
  options: SelectOption[],
): (id: SelectOptionID) => JSX.Element {
  return useCallback(
    (id: SelectOptionID) => {
      const option = options.find((o) => o.id === id);

      if (option === undefined) {
        return <Fragment />;
      }

      return <OptionBadge option={option} key={option.id} />;
    },
    [options],
  );
}

export function useGetOptionOptions(
  options: SelectOption[],
): ListPickerOption<SelectOptionID>[] {
  return options.map((option) => ({
    value: option.id,
    label: option.label,
  }));
}
