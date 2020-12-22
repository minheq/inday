import React, { Fragment } from 'react';
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
    return <Fragment />;
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
