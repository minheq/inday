import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Icon } from '../../components/icon';
import { Row } from '../../components/row';
import { Text } from '../../components/text';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import { Collection, CollectionID } from '../../data/collections';

import { SpaceID } from '../../data/spaces';
import {
  useGetSpace,
  useGetSpaceCollections,
  useGetView,
} from '../../data/store';
import { ViewID } from '../../data/views';

interface CollectionsTabsProps {
  spaceID: SpaceID;
  viewID: ViewID;
}

export function CollectionsTabs(props: CollectionsTabsProps): JSX.Element {
  const { spaceID, viewID } = props;
  const space = useGetSpace(spaceID);
  const view = useGetView(viewID);
  const collections = useGetSpaceCollections(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error(
      `Active collection not found. Expected to find collectionID=${view.collectionID} in viewID=${view.id}`,
    );
  }

  return (
    <CollectionTabsView
      collections={collections}
      activeCollectionID={activeCollection.id}
    />
  );
}

interface CollectionTabsViewProps {
  collections: Collection[];
  activeCollectionID: CollectionID;
}

const CollectionTabsView = memo(function CollectionTabsView(
  props: CollectionTabsViewProps,
) {
  const { collections, activeCollectionID } = props;
  const themeStyles = useThemeStyles();
  return (
    <View style={[styles.collectionTabsRoot, themeStyles.border.default]}>
      <Row>
        <PressableHighlight
          style={[styles.collectionItem, styles.addCollectionItem]}
        >
          <Icon name="Plus" color="muted" />
        </PressableHighlight>
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
  const themeStyles = useThemeStyles();

  const handlePress = useCallback(() => {
    onPress(collection.id);
  }, [onPress, collection]);

  return (
    <PressableHighlight
      onPress={handlePress}
      style={[
        styles.collectionItem,
        active && styles.activeCollectionItem,
        themeStyles.border.primary,
      ]}
    >
      <Text
        weight={active ? 'bold' : 'normal'}
        color={active ? 'primary' : 'muted'}
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
    borderTopLeftRadius: tokens.border.radius,
    borderTopRightRadius: tokens.border.radius,
    minWidth: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  activeCollectionItem: {
    borderBottomWidth: 2,
  },
  collectionTabsRoot: {
    zIndex: 2,
    borderBottomWidth: 1,
  },
});
