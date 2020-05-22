import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from './icon';
import { tokens } from '../theme';
import { Button } from './button';

interface CloseButtonProps {
  onPress?: () => void;
}

export function CloseButton(props: CloseButtonProps) {
  const { onPress } = props;

  return (
    <Button style={styles.base} onPress={onPress}>
      <Icon name="x" size="xl" />
    </Button>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
});
