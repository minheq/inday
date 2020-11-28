import { useGetCollaborator } from '../data/store';
import React from 'react';
import { View } from 'react-native';
import { Avatar, DynamicStyleSheet, Text, tokens } from '../components';
import { UserID } from '../data/user';

interface CollaboratorBadgeProps {
  collaboratorID: UserID;
}

export function CollaboratorBadge(props: CollaboratorBadgeProps): JSX.Element {
  const { collaboratorID } = props;
  const collaborator = useGetCollaborator(collaboratorID);

  return (
    <View style={styles.base}>
      <View style={styles.avatarWrapper}>
        <Avatar size="sm" name={collaborator.name} />
      </View>
      <Text numberOfLines={1}>{collaborator.name}</Text>
    </View>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    borderRadius: tokens.border.radius.default,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  avatarWrapper: {
    paddingRight: 4,
  },
}));
