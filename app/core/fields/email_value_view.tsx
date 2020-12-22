import React from 'react';

import { Text } from '../../components/text';
import { EmailField, EmailFieldValue } from '../../data/fields';

interface EmailValueViewProps {
  field: EmailField;
  value: EmailFieldValue;
}

export function EmailValueView(props: EmailValueViewProps): JSX.Element {
  const { value } = props;

  return (
    <Text decoration="underline" numberOfLines={1}>
      {value}
    </Text>
  );
}
