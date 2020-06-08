import React from 'react';
import { InputItem } from './input_item';

export interface Option<TValue = any> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface PickerProps<TValue = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value: TValue) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function Picker<TValue = any>(props: PickerProps<TValue>) {
  const { value, options, onChange = () => {}, label, placeholder } = props;

  const selected = value && options.find((o) => o.value === value);

  return (
    <InputItem
      label={label}
      description={selected?.label}
      placeholder={placeholder}
      icon="chevron-down"
    />
  );
}
