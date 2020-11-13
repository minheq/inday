import React from 'react';
import { FlatButton } from './flat_button';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton(props: BackButtonProps): JSX.Element {
  const { onPress } = props;

  return <FlatButton onPress={onPress} icon="ChevronLeft" />;
}
