import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { PressableHighlight } from "../../components/pressable_highlight";
import { Icon } from "../../components/icon";
import { Row } from "../../components/row";
import { Text } from "../../components/text";
import { Collection, CollectionID } from "../../../models/collections";

import { useSpaceQuery, useSpaceCollectionsQuery } from "../../store/queries";
import { SpaceID } from "../../../models/spaces";
import { theme } from "../../components/theme";

interface CollectionsTabsProps {
  spaceID: SpaceID;
  activeCollectionID: CollectionID;
}

export function CollectionsTabs(props: CollectionsTabsProps): JSX.Element {
  const { spaceID, activeCollectionID } = props;
  const space = useSpaceQuery(spaceID);
  const collections = useSpaceCollectionsQuery(space.id);

  return (
    <CollectionTabsView
      collections={collections}
      activeCollectionID={activeCollectionID}
    />
  );
}

interface CollectionTabsViewProps {
  collections: Collection[];
  activeCollectionID: CollectionID;
}

const CollectionTabsView = memo(function CollectionTabsView(
  props: CollectionTabsViewProps
) {
  const { collections, activeCollectionID } = props;

  return (
    <View style={styles.collectionTabsRoot}>
      <Row spacing={2}>
        {collections.map((collection) => (
          <CollectionItem
            active={collection.id === activeCollectionID}
            key={collection.id}
            collection={collection}
            onPress={() => {
              return;
            }}
          />
        ))}
        <PressableHighlight
          style={[styles.collectionItem, styles.addCollectionItem]}
        >
          <Icon name="Plus" color="muted" />
        </PressableHighlight>
      </Row>
    </View>
  );
});

interface CollectionItemProps {
  active: boolean;
  collection: Collection;
  onPress: (collectionID: CollectionID) => void;
}

function CollectionItem(props: CollectionItemProps) {
  const { active, collection, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(collection.id);
  }, [onPress, collection]);

  return (
    <PressableHighlight
      onPress={handlePress}
      style={[styles.collectionItem, active && styles.activeCollectionItem]}
    >
      <Text
        weight={active ? "bold" : "normal"}
        color={active ? "primary" : "muted"}
      >
        {collection.name}
      </Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  addCollectionItem: {
    paddingHorizontal: 8,
  },
  collectionItem: {
    minWidth: 40,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  activeCollectionItem: {
    borderBottomWidth: 2,
    borderColor: theme.primary.default,
  },
  collectionTabsRoot: {
    zIndex: 2,
    borderBottomWidth: 1,
    borderColor: theme.neutral.light,
  },
});
