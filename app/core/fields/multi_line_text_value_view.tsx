import React from 'react';

import { Text } from '../../components/text';
import { MultiLineTextField, MultiLineTextFieldValue } from '../../data/fields';

interface MultiLineTextValueViewProps {
  field: MultiLineTextField;
  value: MultiLineTextFieldValue;
}

export function MultiLineTextValueView(
  props: MultiLineTextValueViewProps,
): JSX.Element {
  const { value } = props;

  return <Text>{value}</Text>;
}
