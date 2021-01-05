import React, { Fragment } from 'react';
import { formatUnit } from '../../../lib/unit';
import { Text } from '../../components/text';
import { NumberField, NumberFieldValue } from '../../../models/fields';
import { getSystemLocale } from '../../lib/locale';

interface NumberValueViewProps {
  field: NumberField;
  value: NumberFieldValue;
}

export function NumberValueView(props: NumberValueViewProps): JSX.Element {
  const { value, field } = props;

  if (value !== null) {
    switch (field.style) {
      case 'decimal':
        return (
          <Text numberOfLines={1} align="right">
            {Intl.NumberFormat(getSystemLocale(), {
              style: 'decimal',
              minimumFractionDigits: field.minimumFractionDigits,
              maximumFractionDigits: field.maximumFractionDigits,
            }).format(value)}
          </Text>
        );
      case 'unit':
        return (
          <Text numberOfLines={1} align="right">
            {formatUnit(value, getSystemLocale(), field.unit)}
          </Text>
        );
      case 'integer':
        return (
          <Text numberOfLines={1} align="right">
            {value}
          </Text>
        );
    }
  }

  return <Fragment />;
}
