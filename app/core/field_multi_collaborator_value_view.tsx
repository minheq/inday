import React from 'react';
import { StyleSheet, View } from 'react-native';
import { isEmpty } from '../../lib/lang_utils';
import { Row } from '../components/row';

import {
  MultiCollaboratorFieldValue,
  MultiCollaboratorField,
} from '../data/fields';
import { CollaboratorBadge } from './collaborator_badge';

interface FieldMultiCollaboratorValueViewProps {
  field: MultiCollaboratorField;
  value: MultiCollaboratorFieldValue;
}

export function FieldMultiCollaboratorValueView(
  props: FieldMultiCollaboratorValueViewProps,
): JSX.Element {
  const { value } = props;

  if (isEmpty(value)) {
    return <View style={styles.cellWrapper} />;
  }

  return (
    <Row spacing={4}>
      {value.map((collaboratorID) => (
        <CollaboratorBadge
          collaboratorID={collaboratorID}
          key={collaboratorID}
        />
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
