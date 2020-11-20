import React from 'react';
import { Badge } from '../components';
import { palette } from '../components/palette';
import { Collaborator } from '../data/collaborators';

interface CollaboratorBadgeProps {
  collaborator: Collaborator;
}

export function CollaboratorBadge(props: CollaboratorBadgeProps): JSX.Element {
  const { collaborator } = props;

  return (
    <Badge color={palette.blue[50]} showAvatar title={collaborator.name} />
  );
}
