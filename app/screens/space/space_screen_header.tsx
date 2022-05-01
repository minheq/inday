import React, { memo, useCallback, useContext } from "react";
import { StyleSheet, View } from "react-native";

import { PressableHighlight } from "../../components/pressable_highlight";
import { Icon } from "../../components/icon";
import { Row } from "../../components/row";
import { Text } from "../../components/text";
import { Collection, CollectionID } from "../../../models/collections";

import {
  useSpaceQuery,
  useSpaceCollectionsQuery,
  useViewQuery,
} from "../../store/queries";
import { SpaceID } from "../../../models/spaces";
import { theme } from "../../components/theme";
import { useNavigation } from "../../config/routes";
import { SpaceScreenContext } from "./space_screen_context";
import { BackButton } from "../../components/back_button";
import { IconButton } from "../../components/icon_button";
import { Spacer } from "../../components/spacer";

export const SpaceScreenHeader = memo(
  function SpaceScreenHeader(): JSX.Element {
    const navigation = useNavigation();
    const context = useContext(SpaceScreenContext);
    const { spaceID, viewID } = context;
    const space = useSpaceQuery(spaceID);
    const view = useViewQuery(viewID);
    const collections = useSpaceCollectionsQuery(space.id);
    const activeCollection = collections.find(
      (c) => c.id === view.collectionID
    );
    const handlePressBack = useCallback(() => {
      navigation.back();
    }, [navigation]);

    if (!activeCollection) {
      throw new Error(`Could not find collection for viewID=${viewID}`);
    }

    return (
      <View style={styles.header}>
        <View style={styles.leftSide}>
          <View style={styles.title}>
            <BackButton onPress={handlePressBack} />
            <Text weight="bold">{space.name}</Text>
          </View>
          <Spacer direction="row" size={16} />
          <CollectionsTabs
            activeCollectionID={activeCollection.id}
            spaceID={spaceID}
          />
        </View>
        <TopMenu />
      </View>
    );
  }
);

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

export function TopMenu() {
  return (
    <Row spacing={4}>
      <IconButton icon="Users" title="Share" />
      <IconButton icon="Bolt" title="Automate" />
      <IconButton icon="Help" title="Help" />
      <IconButton icon="DotsInCircle" title="More" />
    </Row>
  );
}

const styles = StyleSheet.create({
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    height: 56,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: theme.neutral.light,
  },
  addCollectionItem: {
    paddingHorizontal: 8,
  },
  collectionItem: {
    minWidth: 40,
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
    height: "100%",
    flexDirection: "row",
  },
});
