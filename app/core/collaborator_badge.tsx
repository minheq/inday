import React from 'react';
import { View } from 'react-native';
import { Avatar, DynamicStyleSheet, Text, tokens } from '../components';
import { Collaborator } from '../data/collaborators';

interface CollaboratorBadgeProps {
  collaborator: Collaborator;
}

export function CollaboratorBadge(props: CollaboratorBadgeProps): JSX.Element {
  const { collaborator } = props;

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
    borderRadius: tokens.radius,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  avatarWrapper: {
    paddingRight: 4,
  },
}));
