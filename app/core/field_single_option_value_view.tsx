import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row } from '../components/row';

import { SingleOptionFieldValue, SingleOptionField } from '../data/fields';
import { OptionBadge } from './option_badge';

interface FieldSingleOptionValueViewProps {
  field: SingleOptionField;
  value: SingleOptionFieldValue;
}

export function FieldSingleOptionValueView(
  props: FieldSingleOptionValueViewProps,
): JSX.Element {
  const { value, field } = props;

  const selected = field.options.find((o) => o.id === value);

  if (value === null || selected === undefined) {
    return <View style={styles.cellWrapper} />;
  }

  return (
    <Row>
      <OptionBadge option={selected} />
    </Row>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    height: 32,
    flex: 1,
  },
});
