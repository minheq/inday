import React, { createContext, Fragment, useContext } from 'react';
import { useGetView, useGetCollectionViews } from '../data/store';
import { Container, Text, Spacer, Button } from '../components';
import { SpaceID } from '../data/spaces';
import { ViewID } from '../data/views';

const ViewsMenuContext = createContext({
  spaceID: '1',
  viewID: '1',
});

interface ViewsMenuProps {
  spaceID: SpaceID;
  viewID: ViewID;
}

export function ViewsMenu(props: ViewsMenuProps) {
  const { spaceID, viewID } = props;

  return (
    <ViewsMenuContext.Provider value={{ spaceID, viewID }}>
      <Views />
    </ViewsMenuContext.Provider>
  );
}

function Views() {
  const context = useContext(ViewsMenuContext);
  const activeView = useGetView(context.viewID);
  const views = useGetCollectionViews(activeView.collectionID);

  return (
    <Container flex={1} padding={8} color="content" borderRightWidth={1}>
      <Text color="muted" size="sm" bold>
        TEAM VIEWS
      </Text>
      <Spacer size={16} />
      {views.map((view) => (
        <Fragment key={view.id}>
          <Button
            title={view.name}
            iconBefore="layout"
            alignTitle="left"
            state={activeView.id === view.id ? 'active' : 'default'}
          />
          <Spacer size={4} />
        </Fragment>
      ))}
      <Spacer size={32} />
      <Text color="muted" size="sm" bold>
        PERSONAL VIEWS
      </Text>
    </Container>
  );
}
