import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { tokens } from './tokens';
import { Icon, IconName } from './icon';
import { Spacer } from './spacer';
import { Text } from './text';

interface IconButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  icon?: IconName;
}

export function IconButton(props: IconButtonProps): JSX.Element {
  const { onPress, icon, disabled = false, title } = props;

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed, hovered }) => [styles.root]}
      onPress={onPress}
    >
      {icon && <Icon name={icon} />}
      <Spacer size={4} />
      {title && <Text size="xs">{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: tokens.radius,
    minWidth: 40,
    height: 40,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
