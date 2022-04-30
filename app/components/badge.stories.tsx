import React from "react";
import { View } from "react-native";

import { Badge } from "./badge";
import { Spacer } from "./spacer";

function Basic(): JSX.Element {
  return <Badge title="Badge" />;
}

function Color(): JSX.Element {
  return <Badge color="turquoise" textColor="white" title="Badge" />;
}

export function BadgeStories(): JSX.Element {
  return (
    <View>
      <Basic />
      <Spacer size={16} />
      <Color />
    </View>
  );
}
