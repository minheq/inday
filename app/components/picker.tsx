import React from 'react';
import { Container } from './container';
import { useToggle } from '../hooks/use_toggle';
import { WheelPicker } from './wheel_picker';
import { PickerButton } from './picker_button';

export interface Option<TValue = any> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface PickerProps<TValue = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value?: TValue) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function Picker<TValue = any>(props: PickerProps<TValue>) {
  const { value, options, onChange = () => {}, label, placeholder } = props;
  const [open, popover] = useToggle();

  const selected = value && options.find((o) => o.value === value);

  return (
    <Container>
      <PickerButton
        label={label}
        description={selected?.label}
        placeholder={placeholder}
        clearable={!!value}
        onPress={popover.toggle}
        onClear={onChange}
      />
      {open && (
        <WheelPicker options={options} onChange={onChange} value={value} />
      )}
    </Container>
  );
}
