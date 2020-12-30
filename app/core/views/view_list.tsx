import React from 'react';
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
}

export function ViewList(props: ViewListProps): JSX.Element {
  const { viewID } = props;
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
          <ViewButton key={view.id} view={view} />
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
}

function ViewButton(props: ViewButtonProps) {
  const { view } = props;
  const theme = useTheme();

  return (
    <PressableHighlight style={styles.button}>
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
