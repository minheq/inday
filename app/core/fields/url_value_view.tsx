import React from 'react';

import { Text } from '../../components/text';
import { URLField, URLFieldValue } from '../../../models/fields';

interface URLValueViewProps {
  field: URLField;
  value: URLFieldValue;
}

export function URLValueView(props: URLValueViewProps): JSX.Element {
  const { value } = props;

  return (
    <Text decoration="underline" numberOfLines={1}>
      {value}
    </Text>
  );
}
