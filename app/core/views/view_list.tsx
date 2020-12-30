import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { useGetView, useGetCollectionViews } from '../../data/store';
import { Spacer } from '../../components/spacer';
import { Text } from '../../components/text';
import { SpaceID } from '../../data/spaces';
import { ViewID } from '../../data/views';
import { useTheme, useThemeStyles } from '../../components/theme';
import { Column } from '../../components/column';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Icon } from '../../components/icon';
import { View as CollectionView } from '../../data/views';
import { getViewIcon, getViewIconColor } from './icon_helpers';
import { tokens } from '../../components/tokens';

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
          <ViewButton key={view.id} view={view} onSelect={onSelect} />
        ))}
      </Column>
      <Spacer size={32} />
      <Text color="muted" size="sm" weight="bold">
        PERSONAL VIEWS
      </Text>
    </View>
  );
}

interface ViewButtonProps {
  view: CollectionView;
  onSelect: (viewID: ViewID) => void;
}

function ViewButton(props: ViewButtonProps) {
  const { view, onSelect } = props;
  const theme = useTheme();

  const handlePress = useCallback(() => {
    onSelect(view.id);
  }, [onSelect, view]);

  return (
    <PressableHighlight onPress={handlePress} style={styles.button}>
      <Icon
        name={getViewIcon(view.type)}
        customColor={getViewIconColor(view.type, theme.colorScheme)}
      />
      <Spacer direction="row" size={4} />
      <Text>{view.name}</Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 8,
  },
  button: {
    borderRadius: tokens.border.radius,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    height: 40,
  },
});
