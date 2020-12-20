import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../components/text';
import { URLField, URLFieldValue } from '../data/fields';

interface FieldURLValueViewProps {
  field: URLField;
  value: URLFieldValue;
}

export function FieldURLValueView(props: FieldURLValueViewProps): JSX.Element {
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
