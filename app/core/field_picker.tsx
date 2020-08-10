import React from 'react';
import { Picker } from '../components';
import { Field, FieldID } from '../data/fields';

interface FieldPickerProps {
  value?: FieldID;
  fields: Field[];
  onChange?: (value: FieldID) => void;
}

export function FieldPicker(props: FieldPickerProps) {
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
