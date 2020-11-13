import React, { useCallback, createContext, useContext } from 'react';
import {
  Screen,
  Container,
  Row,
  BackButton,
  Text,
  IconButton,
  Spacer,
  FlatButton,
} from '../components';
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
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { RecordID } from '../data/records';

type SpaceScreenParams = RouteProp<RootStackParamsMap, 'Space'>;

type SidePanelState = 'views' | 'organize' | null;

const sidePanelState = atom<SidePanelState>({
  key: 'SpaceScreen_SidePanel',
  default: null,
});

const SpaceScreenContext = createContext({
  spaceID: '1',
  viewID: '1',
  collectionID: '1',
});

export function SpaceScreen(): JSX.Element {
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

export function SpaceScreenHeader(props: SpaceScreenHeaderProps): JSX.Element {
  const { route, navigation } = props;

  const space = useGetSpace(route.params.spaceID);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Row justifyContent="space-between">
      <Container>
        <Row alignItems="center">
          <BackButton onPress={handlePressBack} />
          <Text size="lg" bold>
            {space.name}
          </Text>
        </Row>
      </Container>
      <Container>
        <TopMenu />
      </Container>
    </Row>
  );
}

function TopMenu() {
  const [sidePanel, setSidePanel] = useRecoilState(sidePanelState);

  const handleToggleView = React.useCallback(() => {
    if (sidePanel !== 'views') {
      setSidePanel('views');
    } else {
      setSidePanel(null);
    }
  }, [sidePanel, setSidePanel]);

  const handleToggleOrganize = React.useCallback(() => {
    if (sidePanel !== 'organize') {
      setSidePanel('organize');
    } else {
      setSidePanel(null);
    }
  }, [sidePanel, setSidePanel]);

  return (
    <Row>
      <IconButton icon="Search" title="Search" />
      <Spacer size={4} />
      <IconButton icon="Users" title="Share" />
      <Spacer size={4} />
      <IconButton icon="Bolt" title="Automate" />
      <Spacer size={4} />
      <IconButton icon="Help" title="Help" />
      <Spacer size={4} />
      <IconButton icon="DotsInCircle" title="More" />
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
          <FlatButton
            color="muted"
            key={collection.id}
            title={collection.name}
          />
        ))}
        <FlatButton icon="Plus" color="muted" />
      </Row>
    </Container>
  );
}

function MainContent() {
  const sidePanel = useRecoilValue(sidePanelState);
  const context = useContext(SpaceScreenContext);
  const { spaceID, viewID, collectionID } = context;
  const space = useGetSpace(spaceID);
  const view = useGetView(viewID);
  const collections = useGetSpaceCollections(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error('Invalid collection');
  }

  const handleOpenRecord = useCallback((recordID: RecordID) => {
    console.log('Open record', recordID);
  }, []);

  const ViewDisplay = displaysByViewType[view.type];

  return (
    <Container flex={1}>
      <Row expanded flex={1}>
        <Slide width={240} open={sidePanel === 'views'}>
          <Container width={240} expanded color="content" borderRightWidth={1}>
            {sidePanel === 'views' && (
              <ViewsMenu spaceID={spaceID} viewID={viewID} />
            )}
          </Container>
        </Slide>
        <ViewDisplay onOpenRecord={handleOpenRecord} view={view} />
        <Slide width={360} open={sidePanel === 'organize'}>
          <Container flex={1} width={360} color="content" borderLeftWidth={1}>
            <AutoSizer>
              {({ height }) => (
                <Container height={height}>
                  {sidePanel === 'organize' && (
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

interface ViewDisplayProps {
  view: View;
  onOpenRecord: (recordID: RecordID) => void;
}

const displaysByViewType: {
  [viewType in ViewType]: (props: ViewDisplayProps) => JSX.Element;
} = {
  list: (props: ViewDisplayProps) => {
    const { view, onOpenRecord } = props;

    assertListView(view);

    return <ListViewDisplay view={view} onOpenRecord={onOpenRecord} />;
  },
  board: () => <></>,
};
