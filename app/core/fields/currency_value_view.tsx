import React, { Fragment } from 'react';
import { formatCurrency } from '../../../lib/currency';
import { Text } from '../../components/text';
import { CurrencyField, CurrencyFieldValue } from '../../data/fields';
import { getSystemLocale } from '../../lib/locale';

interface CurrencyValueViewProps {
  field: CurrencyField;
  value: CurrencyFieldValue;
}

export function CurrencyValueView(props: CurrencyValueViewProps): JSX.Element {
  const { value, field } = props;

  if (value === null) {
    return <Fragment />;
  }

  return (
    <Text numberOfLines={1} align="right">
      {formatCurrency(value, getSystemLocale(), field.currency)}
    </Text>
  );
}
