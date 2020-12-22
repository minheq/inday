import React, { Fragment, useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SelectOption,
  SelectOptionID,
  SingleOptionField,
  SingleOptionFieldValue,
} from '../../data/fields';
import { RecordID } from '../../data/records';
import { OptionBadge } from './option_badge';
import { FieldSingleSelectKindValueEdit } from './single_select_kind_value_edit';

interface FieldSingleOptionValueEditProps {
  recordID: RecordID;
  field: SingleOptionField;
  value: SingleOptionFieldValue;
  onDone: () => void;
}

export function FieldSingleOptionValueEdit(
  props: FieldSingleOptionValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <FieldSingleSelectKindValueEdit<SingleOptionFieldValue>
      recordID={recordID}
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
