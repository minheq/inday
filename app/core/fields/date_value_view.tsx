import React, { Fragment } from 'react';
import { formatDate, parseISODate } from '../../../lib/date_utils';

import { Text } from '../../components/text';
import { DateField, DateFieldValue } from '../../../models/fields';
import { getSystemLocale } from '../../lib/locale';

interface DateValueViewProps {
  field: DateField;
  value: DateFieldValue;
}

export function DateValueView(props: DateValueViewProps): JSX.Element {
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
