import React, { Fragment, useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SelectOption,
  SelectOptionID,
  SingleOptionField,
  SingleOptionFieldValue,
} from '../../data/fields';
import { DocumentID } from '../../data/documents';
import { OptionBadge } from './option_badge';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';

interface SingleOptionValueEditProps {
  documentID: DocumentID;
  field: SingleOptionField;
  value: SingleOptionFieldValue;
  onDone: () => void;
}

export function SingleOptionValueEdit(
  props: SingleOptionValueEditProps,
): JSX.Element {
  const { documentID, field, value, onDone } = props;

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <SingleSelectKindValueEdit<SingleOptionFieldValue>
      documentID={documentID}
      fieldID={field.id}
      renderLabel={renderOption}
      options={options}
      value={value}
      onDone={onDone}
    />
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
