import React from 'react';
import { Picker } from '../../components/picker';
import { Field, FieldID } from '../../data/fields';

interface FieldPickerProps {
  value?: FieldID;
  fields: Field[];
  onChange?: (value: FieldID) => void;
}

export function FieldPicker(props: FieldPickerProps): JSX.Element {
  const { fields, onChange, value } = props;

  return (
    <Picker
      value={value}
      onChange={onChange}
      options={fields.map((f) => ({
        label: f.name,
        value: f.id,
      }))}
      searchable
    />
  );
}
