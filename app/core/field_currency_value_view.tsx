import React from 'react';
import { StyleSheet, View } from 'react-native';
import { formatCurrency } from '../../lib/currency';
import { Text } from '../components/text';
import { CurrencyField, CurrencyFieldValue } from '../data/fields';
import { getSystemLocale } from '../lib/locale';

interface FieldCurrencyValueViewProps {
  field: CurrencyField;
  value: CurrencyFieldValue;
}

export function FieldCurrencyValueView(
  props: FieldCurrencyValueViewProps,
): JSX.Element {
  const { value, field } = props;

  if (value === null) {
    return <View style={styles.cellWrapper} />;
  }

  return (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1} align="right">
        {formatCurrency(value, getSystemLocale(), field.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    height: 32,
    flex: 1,
  },
  textCellContainer: {
    height: 32,
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
