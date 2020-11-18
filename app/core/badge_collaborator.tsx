import React from 'react';
import { Badge } from '../components';
import { palette } from '../components/palette';
import { Collaborator } from '../data/collaborators';

interface BadgeCollaboratorProps {
  collaborator: Collaborator;
}

export function BadgeCollaborator(props: BadgeCollaboratorProps): JSX.Element {
  const { collaborator } = props;

  return (
    <Badge color={palette.blue[50]} showAvatar title={collaborator.name} />
  );
}
