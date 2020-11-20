import React from 'react';
import { View } from 'react-native';
import { Avatar } from './avatar';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { tokens } from './tokens';

interface BadgeProps {
  avatarSourceURI?: string;
  showAvatar?: boolean;
  title: string;
  color?: string;
}

export function Badge(props: BadgeProps): JSX.Element {
  const { title, showAvatar = false, color, avatarSourceURI } = props;

  return (
    <View style={[styles.base, { backgroundColor: color }]}>
      {showAvatar === true && (
        <View style={styles.avatarWrapper}>
          <Avatar size="sm" sourceURI={avatarSourceURI} name={title} />
        </View>
      )}
      <Text numberOfLines={1}>{title}</Text>
    </View>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  base: {
    backgroundColor: theme.background.tint,
    borderRadius: tokens.radius,
    paddingHorizontal: 8,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  avatarWrapper: {
    paddingRight: 4,
  },
}));
