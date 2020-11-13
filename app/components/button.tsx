import React from 'react';
import { Pressable } from 'react-native';
import { tokens } from './tokens';
import { Icon, IconName } from './icon';
import { Spacer } from './spacer';
import { Text } from './text';
import { DynamicStyleSheet } from './stylesheet';

type ButtonColor = 'primary' | 'muted' | 'default';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  color?: ButtonColor;
  icon?: IconName;
}

export function Button(props: ButtonProps): JSX.Element {
  const { onPress, icon, disabled = false, color = 'default', title } = props;

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed, hovered }: any) => [
        styles.root,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {icon && <Icon name={icon} color={color} />}
      <Spacer size={4} />
      {title && <Text color={color}>{title}</Text>}
    </Pressable>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  root: {
    borderRadius: tokens.radius,
    minWidth: 40,
    height: 40,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hovered: {
    backgroundColor: theme.button.hovered,
  },
  pressed: {
    backgroundColor: theme.button.pressed,
  },
}));
