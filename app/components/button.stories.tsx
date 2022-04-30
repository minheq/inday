import React from "react";
import { View } from "react-native";

import { Button } from "./button";
import { Row } from "./row";

function Basic(): JSX.Element {
  return (
    <Row>
      <Button
        onPress={() => {
          return;
        }}
        icon="Bolt"
        title="Hello"
      />
    </Row>
  );
}

export function ButtonStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
