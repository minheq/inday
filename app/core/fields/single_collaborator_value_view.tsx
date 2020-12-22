import React, { Fragment } from 'react';

import { Row } from '../../components/row';
import {
  SingleCollaboratorFieldValue,
  SingleCollaboratorField,
} from '../../data/fields';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';

interface FieldSingleCollaboratorValueViewProps {
  field: SingleCollaboratorField;
  value: SingleCollaboratorFieldValue;
}

export function FieldSingleCollaboratorValueView(
  props: FieldSingleCollaboratorValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <Fragment />;
  }

  return (
    <Row>
      <CollaboratorBadge collaboratorID={value} key={value} />
    </Row>
  );
}
