import React, { useState } from "react";
import { View } from "react-native";

import { Checkbox } from "./checkbox";

function Basic(): JSX.Element {
  const [value, setValue] = useState(false);

  return <Checkbox value={value} onChange={setValue} />;
}

export function CheckboxStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
