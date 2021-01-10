import React, { Fragment } from 'react';

import { isEmpty } from '../../../lib/lang_utils';
import { Row } from '../../components/row';
import { CollaboratorBadge } from './collaborator_badge';
import { CollaboratorID } from '../../../models/collaborators';

interface CollaboratorBadgeListProps {
  collaboratorIDs: CollaboratorID[];
}

export function CollaboratorBadgeList(
  props: CollaboratorBadgeListProps,
): JSX.Element {
  const { collaboratorIDs } = props;

  if (isEmpty(collaboratorIDs)) {
    return <Fragment />;
  }

  return (
    <Row spacing={8}>
      {collaboratorIDs.map((collaboratorID) => (
        <CollaboratorBadge
          collaboratorID={collaboratorID}
          key={collaboratorID}
        />
      ))}
    </Row>
  );
}
