import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../components/text';
import { SingleLineTextField, SingleLineTextFieldValue } from '../data/fields';

interface FieldSingleLineTextValueViewProps {
  field: SingleLineTextField;
  value: SingleLineTextFieldValue;
}

export function FieldSingleLineTextValueView(
  props: FieldSingleLineTextValueViewProps,
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
