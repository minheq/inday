import React from "react";
import { StyleSheet, View } from "react-native";

import { useViewQuery, useCollectionViewsQuery } from "../../store/queries";
import { Spacer } from "../../components/spacer";
import { Text } from "../../components/text";
import { SpaceID } from "../../../models/spaces";
import { ViewID } from "../../../models/views";
import { Column } from "../../components/column";
import { ViewButton } from "./view_button";
import { theme } from "../../components/theme";

interface ViewListProps {
  spaceID: SpaceID;
  viewID: ViewID;
  onSelect: (viewID: ViewID) => void;
}

export function ViewList(props: ViewListProps): JSX.Element {
  const { viewID, onSelect } = props;
  const activeView = useViewQuery(viewID);
  const views = useCollectionViewsQuery(activeView.collectionID);

  return (
    <View style={styles.root}>
      <Text color="muted" size="sm" weight="bold">
        TEAM VIEWS
      </Text>
      <Spacer size={16} />
      <Column spacing={4}>
        {views.map((view) => (
          <ViewButton
            key={view.id}
            viewID={view.id}
            name={view.name}
            type={view.type}
            onPress={onSelect}
          />
        ))}
      </Column>
      <Spacer size={32} />
      <Text color="muted" size="sm" weight="bold">
        PERSONAL VIEWS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 8,
    backgroundColor: theme.base.white,
  },
});
