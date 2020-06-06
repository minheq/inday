import React from 'react';
import { TextInput } from './text_input';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchInput(props: SearchInputProps) {
  const { value, onChange = () => {} } = props;

  return (
    <TextInput
      icon="search"
      value={value}
      onChange={onChange}
      placeholder="Search"
    />
  );
}
