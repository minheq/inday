import React from 'react';
import { TextInput } from './text_input';

export interface SearchInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SearchInput(props: SearchInputProps) {
  const { value, onValueChange = () => {} } = props;

  return (
    <TextInput
      icon="search"
      value={value}
      onValueChange={onValueChange}
      placeholder="Search"
    />
  );
}
