import React, { useCallback, createContext, useContext } from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  Screen,
  Container,
  Text,
  Row,
  Column,
  BackButton,
  Button,
  IconName,
  Spacer,
  Icon,
} from '../components';
import {
  useRoute,
  RouteProp,
  NavigationHelpers,
} from '@react-navigation/native';
import { RootStackParamsMap } from '../linking';
import { View, ListView } from '../data/views';
import { DocumentFieldValue } from '../data/documents';
import { Collection } from '../data/collections';
import {
  useGetSpace,
  useGetView,
  useGetSpaceCollectionList,
  useGetCollection,
  useGetCollectionFields,
  useGetCollectionDocumentList,
} from '../data/store';
import { Space } from '../data/spaces';

type SpaceScreenParams = RouteProp<RootStackParamsMap, 'Space'>;

const SpaceScreenContext = createContext({
  spaceID: '1',
  viewID: '1',
});

export function SpaceScreen() {
  const route = useRoute<SpaceScreenParams>();

  return (
    <SpaceScreenContext.Provider
      value={{ spaceID: route.params.spaceID, viewID: route.params.viewID }}
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
    <Row alignItems="center" justifyContent="center">
      <Button>
        <Container center height={48} paddingHorizontal={16}>
          <Text>{space.name}</Text>
        </Container>
      </Button>
    </Row>
  );
}

function TopMenu() {
  return (
    <Row alignItems="center" justifyContent="flex-end">
      <TopMenuItem onPress={() => {}} text="Collaborator" iconName="user" />
      <TopMenuItem onPress={() => {}} text="Automation" iconName="settings" />
      <TopMenuItem onPress={() => {}} text="More" iconName="more-horizontal" />
    </Row>
  );
}

interface TopMenuItemProps {
  onPress: () => void;
  text: string;
  iconName: IconName;
}

function TopMenuItem(props: TopMenuItemProps) {
  const { onPress, text, iconName } = props;

  return (
    <Button onPress={onPress}>
      <Container height={48} paddingHorizontal={16}>
        <Row expanded alignItems="center">
          <Icon name={iconName} size="lg" />
          <Spacer size={8} />
          <Text>{text}</Text>
        </Row>
      </Container>
    </Button>
  );
}

function CollectionsMenu() {
  const context = useContext(SpaceScreenContext);
  const space = useGetSpace(context.spaceID);
  const view = useGetView(context.viewID);
  const collections = useGetSpaceCollectionList(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error('Invalid collection');
  }

  return (
    <Container color="content" borderBottomWidth={1}>
      <Row>
        {collections.map((collection) => (
          <CollectionMenuItem
            active={activeCollection.id === collection.id}
            key={collection.id}
            collection={collection}
          />
        ))}
      </Row>
    </Container>
  );
}

interface CollectionMenuItemProps {
  collection: Collection;
  active: boolean;
}

function CollectionMenuItem(props: CollectionMenuItemProps) {
  const { collection, active } = props;

  return (
    <Button
      state={active ? 'active' : 'default'}
      style={{ borderRadius: 'none' }}
    >
      <Container center height={40} paddingHorizontal={16}>
        <Text>{collection.name}</Text>
      </Container>
    </Button>
  );
}

function MainContent() {
  const context = useContext(SpaceScreenContext);
  const space = useGetSpace(context.spaceID);
  const view = useGetView(context.viewID);
  const collections = useGetSpaceCollectionList(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error('Invalid collection');
  }

  return (
    <Container>
      <ViewBar />
      <ViewDisplay view={view} />
    </Container>
  );
}

function ViewBar() {
  const context = useContext(SpaceScreenContext);
  const view = useGetView(context.viewID);

  return (
    <Container borderBottomWidth={1} color="content" padding={4}>
      <Row alignItems="center" justifyContent="space-between">
        <Button>
          <Container center height={40} paddingHorizontal={16}>
            <Row alignItems="center">
              <Icon name="layout" />
              <Spacer size={8} />
              <Text>{view.name}</Text>
            </Row>
          </Container>
        </Button>
        <Button>
          <Container center height={40} paddingHorizontal={16}>
            <Text>Organize</Text>
          </Container>
        </Button>
      </Row>
    </Container>
  );
}

interface ViewDisplayProps {
  view: View;
}

function ViewDisplay(props: ViewDisplayProps) {
  const { view } = props;

  if (view.type === 'list') {
    return <ListViewDisplay view={view} />;
  }

  return null;
}

interface ListViewDisplayProps {
  view: ListView;
}

const LEFT_COLUMN_WIDTH = 40;
const DOCUMENT_HEIGHT = 32;
const FIELD_HEIGHT = 40;

function ListViewDisplay(props: ListViewDisplayProps) {
  const { view } = props;
  const collection = useGetCollection(view.collectionID);
  const fields = useGetCollectionFields(collection.id);
  const documentList = useGetCollectionDocumentList(collection.id);
  const { fieldsOrder, fieldsConfig } = view;

  const headerScrollView = React.useRef<ScrollView>(null);
  const gridHorizontalScrollView = React.useRef<ScrollView>(null);

  const handleGridHorizontalScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (headerScrollView.current) {
        headerScrollView.current.scrollTo({
          animated: false,
          x: e.nativeEvent.contentOffset.x,
        });
      }
    },
    [headerScrollView],
  );

  const handleHeaderHorizontalScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (gridHorizontalScrollView.current) {
        gridHorizontalScrollView.current.scrollTo({
          animated: false,
          x: e.nativeEvent.contentOffset.x,
        });
      }
    },
    [gridHorizontalScrollView],
  );

  const fieldList = fieldsOrder
    .filter((fieldID) => fieldsConfig[fieldID].visible)
    .map((fieldID) => fields[fieldID]);

  return (
    <Container flex={1}>
      <Container height={FIELD_HEIGHT}>
        <Row>
          <Container
            color="tint"
            width={LEFT_COLUMN_WIDTH}
            height={FIELD_HEIGHT}
            borderBottomWidth={1}
            borderRightWidth={1}
          />
          <ScrollView
            horizontal
            ref={headerScrollView}
            onScroll={handleHeaderHorizontalScroll}
            scrollEventThrottle={24}
          >
            {fieldList.map((field) => {
              const fieldConfig = fieldsConfig[field.id];

              return (
                <Container
                  color="tint"
                  key={field.id}
                  height={FIELD_HEIGHT}
                  width={fieldConfig.width}
                  borderBottomWidth={1}
                  borderRightWidth={1}
                  padding={8}
                >
                  <Text>{field.name}</Text>
                </Container>
              );
            })}
          </ScrollView>
        </Row>
      </Container>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <Row flex={1}>
          <Container color="content" width={LEFT_COLUMN_WIDTH}>
            <Column>
              {documentList.map((doc, i) => (
                <Container
                  key={doc.id}
                  borderBottomWidth={1}
                  borderRightWidth={1}
                  height={DOCUMENT_HEIGHT}
                  center
                >
                  <Text>{i + 1}</Text>
                </Container>
              ))}
            </Column>
          </Container>

          <ScrollView
            horizontal
            ref={gridHorizontalScrollView}
            onScroll={handleGridHorizontalScroll}
            scrollEventThrottle={24}
          >
            <Column>
              {documentList.map((doc) => (
                <Container
                  key={doc.id}
                  color="content"
                  borderBottomWidth={1}
                  height={DOCUMENT_HEIGHT}
                >
                  <Row key={doc.id}>
                    {fieldList.map((field) => {
                      const fieldConfig = fieldsConfig[field.id];

                      return (
                        <Container
                          key={`${field.id}${doc.id}`}
                          width={fieldConfig.width}
                          height="100%"
                          borderRightWidth={1}
                          padding={4}
                          paddingHorizontal={8}
                        >
                          <ListViewDocumentFieldValueContainer
                            value={doc.fields[field.id]}
                          />
                        </Container>
                      );
                    })}
                  </Row>
                </Container>
              ))}
            </Column>
          </ScrollView>
        </Row>
      </ScrollView>
    </Container>
  );
}

interface ListViewDocumentFieldValueContainerProps {
  value: DocumentFieldValue;
}

function ListViewDocumentFieldValueContainer(
  props: ListViewDocumentFieldValueContainerProps,
) {
  const { value } = props;

  switch (value.type) {
    case 'singleLineText':
      return <Text>{value.value}</Text>;
    case 'number':
      return <Text>{value.value}</Text>;

    default:
      return null;
  }
}
