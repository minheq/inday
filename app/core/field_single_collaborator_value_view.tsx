import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row } from '../components/row';

import {
  SingleCollaboratorFieldValue,
  SingleCollaboratorField,
} from '../data/fields';
import { CollaboratorBadge } from './collaborator_badge';

interface FieldSingleCollaboratorValueViewProps {
  field: SingleCollaboratorField;
  value: SingleCollaboratorFieldValue;
}

export function FieldSingleCollaboratorValueView(
  props: FieldSingleCollaboratorValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <View style={styles.cellWrapper} />;
  }

  return (
    <Row>
      <CollaboratorBadge collaboratorID={value} key={value} />
    </Row>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    height: 32,
    flex: 1,
  },
});
