import React from "react";

import { ListItem } from "./list_item";
import { Column } from "./column";
import { View } from "react-native";

function Basic(): JSX.Element {
  return (
    <Column>
      <ListItem title="Title" description="Description" />
      <ListItem title="Title" />
      <ListItem description="Description" />
    </Column>
  );
}

export function ListItemStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}
