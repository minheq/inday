import React, { Fragment, useCallback } from 'react';

import { ListPicker, ListPickerOption } from '../../components/list_picker';
import {
  SelectOption,
  SelectOptionID,
  SingleSelectField,
  SingleSelectFieldValue,
} from '../../../models/fields';
import { OptionBadge } from './option_badge';

interface SingleSelectPickerProps {
  value: SelectOptionID | null;
  field: SingleSelectField;
  onChange: (value: SingleSelectFieldValue) => void;
  onRequestClose: () => void;
}

export function SingleSelectPicker(
  props: SingleSelectPickerProps,
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
