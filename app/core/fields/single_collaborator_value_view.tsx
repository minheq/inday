import React, { Fragment } from 'react';

import { Row } from '../../components/row';
import {
  SingleCollaboratorFieldValue,
  SingleCollaboratorField,
} from '../../../models/fields';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';

interface SingleCollaboratorValueViewProps {
  field: SingleCollaboratorField;
  value: SingleCollaboratorFieldValue;
}

export function SingleCollaboratorValueView(
  props: SingleCollaboratorValueViewProps,
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
