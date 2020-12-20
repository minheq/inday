import React, { Fragment, useCallback } from 'react';
import { ListPickerOption } from '../components/list_picker';

import {
  SelectOption,
  SelectOptionID,
  SingleOptionField,
  SingleOptionFieldValue,
} from '../data/fields';
import { Record } from '../data/records';
import { OptionBadge } from './option_badge';
import { FieldSingleSelectKindInput } from './field_single_select_kind_input';

interface FieldSingleOptionInputProps {
  record: Record;
  field: SingleOptionField;
  value: SingleOptionFieldValue;
  onDone: () => void;
}

export function FieldSingleOptionInput(
  props: FieldSingleOptionInputProps,
): JSX.Element {
  const { record, field, value, onDone } = props;
  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <FieldSingleSelectKindInput<SingleOptionFieldValue>
      recordID={record.id}
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
