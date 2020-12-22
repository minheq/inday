import React from 'react';

import { Text } from '../components/text';
import { MultiLineTextField, MultiLineTextFieldValue } from '../data/fields';

interface FieldMultiLineTextValueViewProps {
  field: MultiLineTextField;
  value: MultiLineTextFieldValue;
}

export function FieldMultiLineTextValueView(
  props: FieldMultiLineTextValueViewProps,
): JSX.Element {
  const { value } = props;

  return <Text>{value}</Text>;
}
