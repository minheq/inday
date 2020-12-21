import React, { createContext, Fragment, useContext } from 'react';
import { useGetView, useGetCollectionViews } from '../data/store';
import { FlatButton } from '../components/flat_button';
import { Spacer } from '../components/spacer';
import { Text } from '../components/text';
import { SpaceID } from '../data/spaces';
import { ViewID } from '../data/views';
import { View } from 'react-native';

const ViewsMenuContext = createContext({
  spaceID: '1',
  viewID: '1',
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

  return (
    <View flex={1} padding={8} color="content" borderRightWidth={1}>
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
