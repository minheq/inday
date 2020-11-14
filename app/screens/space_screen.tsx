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
  Button,
  DynamicStyleSheet,
  tokens,
  Icon,
  Column,
} from '../components';
import {
  useRoute,
  RouteProp,
  NavigationHelpers,
} from '@react-navigation/native';
import { RootStackParamsMap } from '../linking';
import { useGetSpace, useGetView, useGetSpaceCollections } from '../data/store';
import { Slide } from '../components/slide';

import { OrganizeMenu } from '../core/organize_menu';
import { ViewsMenu } from '../core/views_menu';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { View, ViewType, assertListView, ViewID } from '../data/views';
import { ListViewDisplay } from '../core/list_view_display';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { RecordID } from '../data/records';
import { Collection, CollectionID } from '../data/collections';
import { getViewIcon, getViewIconColor } from '../core/icon_helpers';

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
        <CollectionsList />
        <ViewSettings />
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
    <Container expanded paddingHorizontal={8} paddingVertical={4}>
      <Row justifyContent="space-between">
        <Container>
          <Row alignItems="center">
            <BackButton onPress={handlePressBack} />
            <Spacer size={8} />
            <Text size="lg" weight="bold">
              {space.name}
            </Text>
          </Row>
        </Container>
        <Container>
          <TopMenu />
        </Container>
      </Row>
    </Container>
  );
}

function TopMenu() {
  return (
    <Row>
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

function ViewSettings() {
  const context = useContext(SpaceScreenContext);
  const view = useGetView(context.viewID);
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
    <Container color="content" shadow zIndex={1}>
      <Spacer size={4} />
      <Row justifyContent="space-between">
        <Row>
          <Spacer size={8} />
          <ViewMenuButton view={view} onPress={handleToggleView} />
        </Row>
        <Row>
          <FlatButton title="Search" />
          <FlatButton onPress={handleToggleOrganize} title="Organize" />
          <FlatButton title="Select" />
          <FlatButton
            weight="bold"
            color="primary"
            icon="Plus"
            title="Add record"
          />
          <Spacer size={8} />
        </Row>
      </Row>
      <Spacer size={4} />
    </Container>
  );
}

interface ViewMenuButtonProps {
  view: View;
  onPress: (viewID: ViewID) => void;
}

function ViewMenuButton(props: ViewMenuButtonProps) {
  const { view, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(view.id);
  }, [onPress, view]);

  return (
    <Button onPress={handlePress} style={styles.viewMenuButton}>
      <Row>
        <Icon
          name={getViewIcon(view.type)}
          customColor={getViewIconColor(view.type)}
        />
        <Spacer size={4} />
        <Text>{view.name}</Text>
      </Row>
    </Button>
  );
}

function CollectionsList() {
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
    <Container color="content" zIndex={2} borderBottomWidth={1}>
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
    </Container>
  );
}

interface CollectionItemProps {
  active: boolean;
  collection: Collection;
  onPress: (collectionID: CollectionID) => void;
}

function CollectionItem(props: CollectionItemProps) {
  const { active, collection, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(collection.id);
  }, [onPress, collection]);

  return (
    <Button
      onPress={handlePress}
      style={[styles.collectionItem, active && styles.activeCollectionItem]}
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
    <Container flex={1} color="content">
      <Row expanded flex={1}>
        <Slide width={240} open={sidePanel === 'views'}>
          <Container width={240} expanded color="content" borderRightWidth={1}>
            {sidePanel === 'views' && (
              <ViewsMenu spaceID={spaceID} viewID={viewID} />
            )}
          </Container>
        </Slide>
        <Container color="content" flex={1}>
          <Spacer size={16} />
          <ViewDisplay onOpenRecord={handleOpenRecord} view={view} />
        </Container>
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

const styles = DynamicStyleSheet.create((theme) => ({
  collectionItem: {
    borderTopLeftRadius: tokens.radius,
    borderTopRightRadius: tokens.radius,
    minWidth: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  addCollectionItem: {
    paddingHorizontal: 8,
  },
  activeCollectionItem: {
    borderBottomWidth: 2,
    borderColor: theme.border.focus,
  },
  viewMenuButton: {
    borderRadius: tokens.radius,
    flexDirection: 'row',
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
}));
