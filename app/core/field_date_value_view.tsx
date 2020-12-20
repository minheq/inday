import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    return <View style={styles.cellWrapper} />;
  }

  return (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1} align="right">
        <Text>{formatDate(parseISODate(value), getSystemLocale())}</Text>
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
