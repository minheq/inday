import React from 'react';
import { FlatButton } from './flat_button';

interface CloseButtonProps {
  onPress?: () => void;
}

export function CloseButton(props: CloseButtonProps): JSX.Element {
  const { onPress } = props;

  return <FlatButton onPress={onPress} icon="X" />;
}
