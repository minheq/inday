import React from 'react';
import { Button } from './button';

interface CloseButtonProps {
  onPress?: () => void;
}

export function CloseButton(props: CloseButtonProps): JSX.Element {
  const { onPress } = props;

  return <Button onPress={onPress} icon="X" />;
}
