import React from 'react';
import { Icon } from './icon';
import { Pressable } from './pressable';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton(props: BackButtonProps) {
  const { onPress } = props;

  return (
    <Pressable onPress={onPress}>
      <Icon name="arrow-left" size="xl" />
    </Pressable>
  );
}
