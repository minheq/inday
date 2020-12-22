import React, { Fragment } from 'react';
import { formatDate, parseISODate } from '../../lib/date_utils';

import { Text } from '../components/text';
import { DateField, DateFieldValue } from '../data/fields';
import { getSystemLocale } from '../lib/locale';

interface FieldDateValueViewProps {
  field: DateField;
  value: DateFieldValue;
}

export function FieldDateValueView(
  props: FieldDateValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <Fragment />;
  }

  return (
    <Text numberOfLines={1} align="right">
      <Text>{formatDate(parseISODate(value), getSystemLocale())}</Text>
    </Text>
  );
}
