import React, { Fragment } from 'react';
import { isEmpty } from '../../../lib/lang_utils';
import { Row } from '../../components/row';

import {
  MultiCollaboratorFieldValue,
  MultiCollaboratorField,
} from '../../../models/fields';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';

interface MultiCollaboratorValueViewProps {
  field: MultiCollaboratorField;
  value: MultiCollaboratorFieldValue;
}

export function MultiCollaboratorValueView(
  props: MultiCollaboratorValueViewProps,
): JSX.Element {
  const { value } = props;

  if (isEmpty(value)) {
    return <Fragment />;
  }

  return (
    <Row spacing={8}>
      {value.map((collaboratorID) => (
        <CollaboratorBadge
          collaboratorID={collaboratorID}
          key={collaboratorID}
        />
      ))}
    </Row>
  );
}
