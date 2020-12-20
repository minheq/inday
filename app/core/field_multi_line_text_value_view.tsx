import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../components/text';
import { MultiLineTextField, MultiLineTextFieldValue } from '../data/fields';

interface FieldMultiLineTextValueViewProps {
  field: MultiLineTextField;
  value: MultiLineTextFieldValue;
}

export function FieldMultiLineTextValueView(
  props: FieldMultiLineTextValueViewProps,
): JSX.Element {
  const { value } = props;

  return (
    <View style={styles.textCellContainer}>
      <Text>{value}</Text>
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
