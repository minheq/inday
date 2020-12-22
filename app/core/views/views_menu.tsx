import React, { createContext, Fragment, useContext } from 'react';
import { useGetView, useGetCollectionViews } from '../../data/store';
import { FlatButton } from '../../components/flat_button';
import { Spacer } from '../../components/spacer';
import { Text } from '../../components/text';
import { SpaceID } from '../../data/spaces';
import { ViewID } from '../../data/views';
import { StyleSheet, View } from 'react-native';
import { useThemeStyles } from '../../components/theme';

interface ViewsMenuContext {
  spaceID: SpaceID;
  viewID: ViewID;
}
const ViewsMenuContext = createContext<ViewsMenuContext>({
  spaceID: 'spc',
  viewID: 'viw',
});

interface ViewsMenuProps {
  spaceID: SpaceID;
  viewID: ViewID;
}

export function ViewsMenu(props: ViewsMenuProps): JSX.Element {
  const { spaceID, viewID } = props;

  return (
    <ViewsMenuContext.Provider value={{ spaceID, viewID }}>
      <Views />
    </ViewsMenuContext.Provider>
  );
}

function Views() {
  const { viewID } = useContext(ViewsMenuContext);
  const activeView = useGetView(viewID);
  const views = useGetCollectionViews(activeView.collectionID);
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.root, themeStyles.background.content]}>
      <Text color="muted" size="sm" weight="bold">
        TEAM VIEWS
      </Text>
      <Spacer size={16} />
      {views.map((view) => (
        <Fragment key={view.id}>
          <FlatButton title={view.name} icon="Table" />
          <Spacer size={4} />
        </Fragment>
      ))}
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
    borderRightWidth: 1,
  },
});
