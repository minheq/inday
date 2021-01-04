import React from 'react';

import { Text } from '../../components/text';
import {
  PhoneNumberField,
  PhoneNumberFieldValue,
} from '../../../models/fields';

interface PhoneNumberValueViewProps {
  field: PhoneNumberField;
  value: PhoneNumberFieldValue;
}

export function PhoneNumberValueView(
  props: PhoneNumberValueViewProps,
): JSX.Element {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
