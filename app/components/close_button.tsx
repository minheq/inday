import React from 'react';
import { Icon } from './icon';
import { Button } from './button';
import { Container } from './container';

interface CloseButtonProps {
  onPress?: () => void;
}

export function CloseButton(props: CloseButtonProps) {
  const { onPress } = props;

  return (
    <Button onPress={onPress}>
      <Container center width={40} height={40}>
        <Icon name="x" size="xl" />
      </Container>
    </Button>
  );
}
