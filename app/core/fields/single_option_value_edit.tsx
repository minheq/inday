import React, { Fragment, useCallback } from 'react';

import { ListPickerOption } from '../../components/list_picker';
import {
  SelectOption,
  SelectOptionID,
  SingleOptionField,
  SingleOptionFieldValue,
} from '../../../models/fields';
import { OptionBadge } from './option_badge';
import { SingleSelectKindPicker } from './single_select_kind_value_edit';

interface SingleOptionPickerProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
  onChange: (value: SingleOptionFieldValue) => void;
  onRequestClose: () => void;
}

export function SingleOptionPicker(
  props: SingleOptionPickerProps,
): JSX.Element {
  const { value, field, onChange, onRequestClose } = props;
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <SingleSelectKindPicker<SelectOptionID>
      value={value}
      onChange={onChange}
      renderLabel={renderOption}
      options={options}
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
