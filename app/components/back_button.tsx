import React from "react";
import { Button } from "./button";

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton(props: BackButtonProps): JSX.Element {
  const { onPress } = props;

  return <Button onPress={onPress} icon="ChevronLeft" />;
}
