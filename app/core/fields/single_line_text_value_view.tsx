import React from 'react';

import { Text } from '../../components/text';
import {
  SingleLineTextField,
  SingleLineTextFieldValue,
} from '../../data/fields';

interface SingleLineTextValueViewProps {
  field: SingleLineTextField;
  value: SingleLineTextFieldValue;
}

export function SingleLineTextValueView(
  props: SingleLineTextValueViewProps,
): JSX.Element {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
