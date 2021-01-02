import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useGetView, useGetCollectionViews } from '../../data/store';
import { Spacer } from '../../components/spacer';
import { Text } from '../../components/text';
import { SpaceID } from '../../data/spaces';
import { ViewID } from '../../data/views';
import { useThemeStyles } from '../../components/theme';
import { Column } from '../../components/column';
import { ViewButton } from './view_button';

interface ViewListProps {
  spaceID: SpaceID;
  viewID: ViewID;
  onSelect: (viewID: ViewID) => void;
}

export function ViewList(props: ViewListProps): JSX.Element {
  const { viewID, onSelect } = props;
  const activeView = useGetView(viewID);
  const views = useGetCollectionViews(activeView.collectionID);

  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.root, themeStyles.background.content]}>
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
  },
});
