import React from 'react';

import { Text } from '../components/text';
import { PhoneNumberField, PhoneNumberFieldValue } from '../data/fields';

interface FieldPhoneNumberValueViewProps {
  field: PhoneNumberField;
  value: PhoneNumberFieldValue;
}

export function FieldPhoneNumberValueView(
  props: FieldPhoneNumberValueViewProps,
): JSX.Element {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
