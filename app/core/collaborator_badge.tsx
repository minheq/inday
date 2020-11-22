import React from 'react';
import { Badge } from '../components';
import { Collaborator } from '../data/collaborators';

interface CollaboratorBadgeProps {
  collaborator: Collaborator;
}

export function CollaboratorBadge(props: CollaboratorBadgeProps): JSX.Element {
  const { collaborator } = props;

  return <Badge showAvatar title={collaborator.name} />;
}
