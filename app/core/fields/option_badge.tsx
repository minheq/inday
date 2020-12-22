import React from 'react';
import { Badge } from '../../components/badge';
import { SelectOption } from '../../data/fields';

interface OptionBadgeProps {
  option: SelectOption;
}

export function OptionBadge(props: OptionBadgeProps): JSX.Element {
  const { option } = props;

  return <Badge title={option.label} color={option.color} />;
}
