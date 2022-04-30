import React, { useState } from "react";
import { View } from "react-native";

import { Picker } from "./picker";
import { Spacer } from "./spacer";

function Basic(): JSX.Element {
  const [value, setValue] = useState(1);
  return (
    <View>
      <Picker
        value={value}
        onChange={setValue}
        options={[
          { value: 1, label: "Option A" },
          { value: 2, label: "Option B" },
          { value: 3, label: "Option C" },
        ]}
      />
    </View>
  );
}

function WithSearch(): JSX.Element {
  const [value, setValue] = useState(1);
  return (
    <View>
      <Picker
        searchable
        value={value}
        onChange={setValue}
        options={[
          { value: 1, label: "Option A" },
          { value: 2, label: "Option B" },
          { value: 3, label: "Option C" },
        ]}
      />
    </View>
  );
}

export function PickerStories(): JSX.Element {
  return (
    <View>
      <Basic />
      <Spacer size={40} />
      <WithSearch />
    </View>
  );
}
