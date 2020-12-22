import React from 'react';

import { Text } from '../components/text';
import { SingleLineTextField, SingleLineTextFieldValue } from '../data/fields';

interface FieldSingleLineTextValueViewProps {
  field: SingleLineTextField;
  value: SingleLineTextFieldValue;
}

export function FieldSingleLineTextValueView(
  props: FieldSingleLineTextValueViewProps,
): JSX.Element {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
