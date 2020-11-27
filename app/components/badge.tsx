import React from 'react';
import { View } from 'react-native';
import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { tokens } from './tokens';

interface BadgeProps {
  title: string;
  color?: string;
}

export function Badge(props: BadgeProps): JSX.Element {
  const { title, color } = props;

  return (
    <View style={[styles.base, { backgroundColor: color }]}>
      <Text numberOfLines={1}>{title}</Text>
    </View>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    backgroundColor: tokens.colors.gray[100],
    borderRadius: tokens.border.radius.default,
    paddingHorizontal: 8,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
}));
