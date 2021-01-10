import React, { Fragment, useCallback } from 'react';

import { ListPicker, ListPickerOption } from '../../components/list_picker';
import {
  SelectOption,
  SelectOptionID,
  SingleOptionField,
  SingleOptionFieldValue,
} from '../../../models/fields';
import { OptionBadge } from './option_badge';

interface SingleOptionPickerProps {
  value: SelectOptionID | null;
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
    <ListPicker<SelectOptionID>
      value={value}
      options={options}
      renderLabel={renderOption}
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
