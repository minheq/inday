import React from 'react';

import { Text } from '../../components/text';
import { URLField, URLFieldValue } from '../../data/fields';

interface FieldURLValueViewProps {
  field: URLField;
  value: URLFieldValue;
}

export function FieldURLValueView(props: FieldURLValueViewProps): JSX.Element {
  const { value } = props;

  return (
    <Text decoration="underline" numberOfLines={1}>
      {value}
    </Text>
  );
}
