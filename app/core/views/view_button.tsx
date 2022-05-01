import React, { useCallback } from "react";

import { ViewID, ViewType } from "../../../models/views";
import { getViewIcon, getViewIconColor } from "./icon_helpers";

import { Button, ButtonAlign, ButtonAppearance } from "../../components/button";

export interface ViewButtonProps {
  viewID: ViewID;
  name: string;
  type: ViewType;
  appearance?: ButtonAppearance;
  align?: ButtonAlign;
  onPress: (viewID: ViewID) => void;
}

export function ViewButton(props: ViewButtonProps): JSX.Element {
  const { viewID, align, name, type, appearance, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(viewID);
  }, [onPress, viewID]);

  return (
    <Button
      icon={getViewIcon(type)}
      iconColor={getViewIconColor(type)}
      appearance={appearance}
      title={name}
      align={align}
      onPress={handlePress}
    />
  );
}
