import React, { Fragment, useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  assertSingleOptionField,
  FieldID,
  SelectOption,
  SelectOptionID,
  SingleOptionFieldValue,
} from '../../../models/fields';
import { OptionBadge } from './option_badge';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import { useFieldQuery } from '../../store/queries';

interface SingleOptionValueEditProps {
  onChange: (value: SingleOptionFieldValue) => void;
  value: SingleOptionFieldValue;
  fieldID: FieldID;
  onRequestClose: () => void;
}

export function SingleOptionValueEdit(
  props: SingleOptionValueEditProps,
): JSX.Element {
  const { fieldID, value, onChange, onRequestClose } = props;
  const field = useFieldQuery(fieldID);
  assertSingleOptionField(field);
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <SingleSelectKindValueEdit<SingleOptionFieldValue>
      renderLabel={renderOption}
      options={options}
      value={value}
      onChange={onChange}
      onRequestClose={onRequestClose}
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
