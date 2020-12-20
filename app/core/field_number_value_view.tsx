import React from 'react';
import { StyleSheet, View } from 'react-native';
import { formatUnit } from '../../lib/unit';
import { Text } from '../components/text';
import { NumberField, NumberFieldValue } from '../data/fields';
import { RecordID } from '../data/records';
import { getSystemLocale } from '../lib/locale';

interface FieldNumberValueViewProps {
  recordID: RecordID;
  field: NumberField;
  value: NumberFieldValue;
}

export function FieldNumberValueView(
  props: FieldNumberValueViewProps,
): JSX.Element {
  const { value, field } = props;

  if (value !== null) {
    switch (field.style) {
      case 'decimal':
        return (
          <View style={styles.textCellContainer}>
            <Text numberOfLines={1} align="right">
              {Intl.NumberFormat(getSystemLocale(), {
                style: 'decimal',
                minimumFractionDigits: field.minimumFractionDigits,
                maximumFractionDigits: field.maximumFractionDigits,
              }).format(value)}
            </Text>
          </View>
        );
      case 'unit':
        return (
          <View style={styles.textCellContainer}>
            <Text numberOfLines={1} align="right">
              {formatUnit(value, getSystemLocale(), field.unit)}
            </Text>
          </View>
        );
      case 'integer':
        return (
          <View style={styles.textCellContainer}>
            <Text numberOfLines={1} align="right">
              {value}
            </Text>
          </View>
        );
    }
  }

  return <View style={styles.cellWrapper} />;
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
