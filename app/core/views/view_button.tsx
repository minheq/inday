import React, { useCallback } from "react";

import { ViewID, ViewType } from "../../../models/views";
import { getViewIcon, getViewIconColor } from "./icon_helpers";

import { Button, ButtonAppearance } from "../../components/button";

export interface ViewButtonProps {
  viewID: ViewID;
  name: string;
  type: ViewType;
  appearance?: ButtonAppearance;
  onPress: (viewID: ViewID) => void;
}

export function ViewButton(props: ViewButtonProps): JSX.Element {
  const { viewID, name, type, appearance, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(viewID);
  }, [onPress, viewID]);

  return (
    <Button
      icon={getViewIcon(type)}
      iconColor={getViewIconColor(type)}
      appearance={appearance}
      title={name}
      onPress={handlePress}
    />
  );
}
