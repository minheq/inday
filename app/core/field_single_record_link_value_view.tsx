import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row } from '../components/row';

import {
  SingleRecordLinkFieldValue,
  SingleRecordLinkField,
} from '../data/fields';
import { RecordLinkBadge } from './record_link_badge';

interface FieldSingleRecordLinkValueViewProps {
  field: SingleRecordLinkField;
  value: SingleRecordLinkFieldValue;
}

export function FieldSingleRecordLinkValueView(
  props: FieldSingleRecordLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <View style={styles.cellWrapper} />;
  }

  return (
    <Row>
      <RecordLinkBadge recordID={value} />
    </Row>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    height: 32,
    flex: 1,
  },
});
