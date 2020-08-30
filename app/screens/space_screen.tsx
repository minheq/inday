import React, { useCallback, createContext, useContext } from 'react';
import { Screen, Container, Row, BackButton, Button } from '../components';
import {
  useRoute,
  RouteProp,
  NavigationHelpers,
} from '@react-navigation/native';
import { RootStackParamsMap } from '../linking';
import { useGetSpace, useGetView, useGetSpaceCollections } from '../data/store';
import { Space } from '../data/spaces';
import { Slide } from '../components/slide';

import { OrganizeMenu } from '../core/organize_menu';
import { ViewsMenu } from '../core/views_menu';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { View, ViewType, assertListView } from '../data/views';
import { ListViewDisplay } from '../core/list_view_display';

type SpaceScreenParams = RouteProp<RootStackParamsMap, 'Space'>;

const SpaceScreenContext = createContext({
  spaceID: '1',
  viewID: '1',
  collectionID: '1',
});

export function SpaceScreen() {
  const route = useRoute<SpaceScreenParams>();

  const { spaceID, viewID } = route.params;
  const view = useGetView(viewID);

  return (
    <SpaceScreenContext.Provider
      value={{ spaceID, viewID, collectionID: view.collectionID }}
    >
      <Screen>
        <CollectionsMenu />
        <MainContent />
      </Screen>
    </SpaceScreenContext.Provider>
  );
}

interface SpaceScreenHeaderProps {
  route: RouteProp<RootStackParamsMap, 'Space'>;
  navigation: NavigationHelpers<RootStackParamsMap>;
}

export function SpaceScreenHeader(props: SpaceScreenHeaderProps) {
  const { route, navigation } = props;

  const space = useGetSpace(route.params.spaceID);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const canGoBack = navigation.canGoBack();

  return (
    <Row>
      <Container flex={1}>
        <Row alignItems="center">
          {canGoBack && <BackButton onPress={handlePressBack} />}
        </Row>
      </Container>
      <Container flex={1}>
        <SpaceTitle space={space} />
      </Container>
      <Container flex={1}>
        <TopMenu />
      </Container>
    </Row>
  );
}

interface SpaceTitleProps {
  space: Space;
}

function SpaceTitle(props: SpaceTitleProps) {
  const { space } = props;

  return (
    <Row alignItems="center" justifyContent="center" expanded>
      <Button title={space.name} />
    </Row>
  );
}

function TopMenu() {
  return (
    <Row expanded alignItems="center" justifyContent="flex-end">
      <Button onPress={() => {}} title="Collaborator" iconBefore="user" />
      <Button onPress={() => {}} title="Automation" iconBefore="settings" />
      <Button onPress={() => {}} title="More" iconBefore="more-horizontal" />
    </Row>
  );
}

function CollectionsMenu() {
  const context = useContext(SpaceScreenContext);
  const space = useGetSpace(context.spaceID);
  const view = useGetView(context.viewID);
  const collections = useGetSpaceCollections(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error(
      `Active collection not found. Expected to find collectionID=${view.collectionID} in viewID=${view.id}`,
    );
  }

  return (
    <Container color="content" borderBottomWidth={1}>
      <Row>
        {collections.map((collection) => (
          <Button
            key={collection.id}
            state={activeCollection.id === collection.id ? 'active' : 'default'}
            radius={0}
            title={collection.name}
          />
        ))}
      </Row>
    </Container>
  );
}

function MainContent() {
  const [slide, setSlide] = React.useState<'views' | 'organize' | null>(null);
  const context = useContext(SpaceScreenContext);
  const { spaceID, viewID, collectionID } = context;
  const space = useGetSpace(spaceID);
  const view = useGetView(viewID);
  const collections = useGetSpaceCollections(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  const handleToggleView = React.useCallback(() => {
    if (slide !== 'views') {
      setSlide('views');
    } else {
      setSlide(null);
    }
  }, [slide]);

  const handleToggleOrganize = React.useCallback(() => {
    if (slide !== 'organize') {
      setSlide('organize');
    } else {
      setSlide(null);
    }
  }, [slide]);

  if (activeCollection === undefined) {
    throw new Error('Invalid collection');
  }

  const ViewDisplay = displaysByViewType[view.type];

  return (
    <Container flex={1}>
      <ViewBar
        onToggleView={handleToggleView}
        onToggleOrganize={handleToggleOrganize}
      />
      <Row expanded flex={1}>
        <Slide width={240} open={slide === 'views'}>
          <Container width={240} expanded color="content" borderRightWidth={1}>
            {slide === 'views' && (
              <ViewsMenu spaceID={spaceID} viewID={viewID} />
            )}
          </Container>
        </Slide>
        <ViewDisplay view={view} />
        <Slide width={360} open={slide === 'organize'}>
          <Container flex={1} width={360} color="content" borderLeftWidth={1}>
            <AutoSizer>
              {({ height }) => (
                <Container height={height}>
                  {slide === 'organize' && (
                    <OrganizeMenu
                      spaceID={spaceID}
                      viewID={viewID}
                      collectionID={collectionID}
                    />
                  )}
                </Container>
              )}
            </AutoSizer>
          </Container>
        </Slide>
      </Row>
    </Container>
  );
}

interface ViewBarProps {
  onToggleView: () => void;
  onToggleOrganize: () => void;
}

function ViewBar(props: ViewBarProps) {
  const { onToggleView, onToggleOrganize } = props;
  const context = useContext(SpaceScreenContext);
  const view = useGetView(context.viewID);

  return (
    <Container borderBottomWidth={1} color="content" padding={4}>
      <Row alignItems="center" justifyContent="space-between">
        <Button onPress={onToggleView} title={view.name} iconBefore="layout" />
        <Button onPress={onToggleOrganize} title="Organize" />
      </Row>
    </Container>
  );
}

interface ViewDisplayProps {
  view: View;
}

const displaysByViewType: {
  [viewType in ViewType]: (props: ViewDisplayProps) => JSX.Element;
} = {
  list: (props: ViewDisplayProps) => {
    const { view } = props;

    assertListView(view);

    return <ListViewDisplay view={view} />;
  },
  board: () => <></>,
};
