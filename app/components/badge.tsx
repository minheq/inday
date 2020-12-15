import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './text';
import { useTheme } from './theme';
import { tokens } from './tokens';

interface BadgeProps {
  title: string;
  color?: string;
  textColor?: string;
}

export function Badge(props: BadgeProps): JSX.Element {
  const { title, color, textColor } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        styles.base,
        theme === 'dark' ? styles.baseDark : styles.baseLight,
        { backgroundColor: color },
      ]}
    >
      <Text customColor={textColor} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.border.radius,
    paddingHorizontal: 8,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  baseDark: {
    backgroundColor: tokens.colors.coolGray[50],
  },
  baseLight: {
    backgroundColor: tokens.colors.gray[100],
  },
});
