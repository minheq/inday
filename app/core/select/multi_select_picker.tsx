import React from "react";

import {
  SelectOptionID,
  MultiSelectFieldValue,
  MultiSelectField,
} from "../../../models/fields";
import { ListMultiPicker } from "../../components/list_multi_picker";
import { useGetOptionOptions, useRenderOption } from "./single_select_picker";

interface MultiSelectPickerProps {
  value: SelectOptionID[];
  field: MultiSelectField;
  onChange: (value: MultiSelectFieldValue) => void;
  onRequestClose: () => void;
}

export function MultiSelectPicker(props: MultiSelectPickerProps): JSX.Element {
  const { value, field, onChange, onRequestClose } = props;

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  return (
    <ListMultiPicker<SelectOptionID>
      value={value}
      options={options}
      renderLabel={renderOption}
      onChange={onChange}
      onRequestClose={onRequestClose}
    />
  );
}
