import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/button';
import { Icon } from '../components/icon';
import { Row } from '../components/row';
import { Text } from '../components/text';
import { useThemeStyles } from '../components/theme';
import { tokens } from '../components/tokens';
import { Collection, CollectionID } from '../data/collections';

import { SpaceID } from '../data/spaces';
import { useGetSpace, useGetSpaceCollections, useGetView } from '../data/store';
import { ViewID } from '../data/views';

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
    <View style={styles.collectionTabsRoot}>
      <Row>
        <Button style={[styles.collectionItem, styles.addCollectionItem]}>
          <Icon name="Plus" color="muted" />
        </Button>
        {collections.map((collection) => (
          <CollectionItem
            active={collection.id === activeCollection.id}
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
}

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
    <Button
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
    </Button>
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
