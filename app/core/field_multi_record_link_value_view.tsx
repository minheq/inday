import React from 'react';
import { StyleSheet, View } from 'react-native';
import { isEmpty } from '../../lib/lang_utils';
import { Row } from '../components/row';

import {
  MultiRecordLinkFieldValue,
  MultiRecordLinkField,
} from '../data/fields';
import { RecordLinkBadge } from './record_link_badge';

interface FieldMultiRecordLinkValueViewProps {
  field: MultiRecordLinkField;
  value: MultiRecordLinkFieldValue;
}

export function FieldMultiRecordLinkValueView(
  props: FieldMultiRecordLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (isEmpty(value)) {
    return <View style={styles.cellWrapper} />;
  }

  return (
    <Row spacing={4}>
      {value.map((recordID) => (
        <RecordLinkBadge recordID={recordID} key={recordID} />
      ))}
    </Row>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    height: 32,
    flex: 1,
  },
});
