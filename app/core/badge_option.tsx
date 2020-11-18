import React from 'react';
import { Badge } from '../components';
import { SelectOption } from '../data/fields';

interface BadgeOptionProps {
  option: SelectOption;
}

export function BadgeOption(props: BadgeOptionProps): JSX.Element {
  const { option } = props;

  return <Badge title={option.label} color={option.color} />;
}
