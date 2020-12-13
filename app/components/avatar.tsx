import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { take } from '../../lib/array_utils';
import { Text, TextSize } from './text';
import { tokens } from './tokens';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  size?: AvatarSize;
  sourceURI?: string;
  name: string;
}

export function Avatar(props: AvatarProps): JSX.Element {
  const { sourceURI, size = 'md', name } = props;

  if (sourceURI === undefined) {
    return (
      <View style={[styles.base, styles.initials, styles[size]]}>
        <Text size={getTextSize(size)}>{getInitials(name, size)}</Text>
      </View>
    );
  }

  return (
    <Image
      style={styles.base}
      source={{
        uri: sourceURI,
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      width={sizeMap[size]}
      height={sizeMap[size]}
    />
  );
}

function getTextSize(size: AvatarSize): TextSize {
  switch (size) {
    case 'lg':
      return 'md';
    case 'md':
      return 'sm';
    case 'sm':
      return 'xs';
    default:
      return 'sm';
  }
}

function getInitials(name: string, size: AvatarSize): string {
  let initials = 2;

  if (size === 'sm') {
    initials = 1;
  }

  return take(name.split(' '), initials)
    .map((c) => c.charAt(0).toUpperCase())
    .join('');
}

const sizeMap: { [size in AvatarSize]: number } = {
  sm: 24,
  md: 32,
  lg: 48,
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    backgroundColor: tokens.colors.gray[200],
  },
  sm: {
    width: 24,
    height: 24,
  },
  md: {
    width: 32,
    height: 32,
  },
  lg: {
    width: 56,
    height: 56,
  },
});
