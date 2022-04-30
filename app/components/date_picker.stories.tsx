import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { DatePicker } from "./date_picker";

function Basic(): JSX.Element {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <View style={styles.container}>
      <DatePicker value={value} onChange={setValue} />
    </View>
  );
}

export function DatePickerStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 320,
  },
});
