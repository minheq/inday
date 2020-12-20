import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../components/text';
import { PhoneNumberField, PhoneNumberFieldValue } from '../data/fields';

interface FieldPhoneNumberValueViewProps {
  field: PhoneNumberField;
  value: PhoneNumberFieldValue;
}

export function FieldPhoneNumberValueView(
  props: FieldPhoneNumberValueViewProps,
): JSX.Element {
  const { value } = props;

  return (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textCellContainer: {
    height: 32,
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
