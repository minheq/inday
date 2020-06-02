import React from 'react';
import { Icon } from './icon';
import { Button } from './button';

interface CloseButtonProps {
  onPress?: () => void;
}

export function CloseButton(props: CloseButtonProps) {
  const { onPress } = props;

  return (
    <Button onPress={onPress}>
      <Icon name="x" size="xl" />
    </Button>
  );
}
