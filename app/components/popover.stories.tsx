import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Popover } from "./popover";
import { Text } from "./text";
import { useThemeStyles } from "./theme";

function Basic(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const targetRef = useRef<View>(null);
  const themeStyles = useThemeStyles();

  return (
    <View>
      <Pressable ref={targetRef} onPress={() => setVisible(true)}>
        <Text>Open</Text>
      </Pressable>
      <Popover
        targetRef={targetRef}
        onRequestClose={() => setVisible(false)}
        visible={visible}
        content={
          <View style={[styles.popoverContent, themeStyles.background.primary]}>
            <Text></Text>
          </View>
        }
      />
    </View>
  );
}

export function PopoverStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}

const styles = StyleSheet.create({
  popoverContent: {
    width: 300,
    height: 300,
  },
});
