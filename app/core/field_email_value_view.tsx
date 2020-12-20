import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../components/text';
import { EmailField, EmailFieldValue } from '../data/fields';

interface FieldEmailValueViewProps {
  field: EmailField;
  value: EmailFieldValue;
}

export function FieldEmailValueView(
  props: FieldEmailValueViewProps,
): JSX.Element {
  const { value } = props;

  return (
    <View style={styles.textCellContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
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
