import React from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Screen, Container, Text, Row, Column } from '../components';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamsMap } from '../linking';
import { Field, ListViewFieldConfig } from '../data/fields';
import { View, ListView } from '../data/views';
import { Space } from '../data/spaces';
import { Document, DocumentFieldValue } from '../data/documents';
import { Collection } from '../data/collections';
import {
  useGetSpace,
  useGetView,
  useGetSpaceCollectionList,
  useGetCollection,
  useGetCollectionFields,
  useGetCollectionDocumentList,
} from '../data/store';

type SpaceScreenParams = RouteProp<RootStackParamsMap, 'Space'>;

export function SpaceScreen() {
  const route = useRoute<SpaceScreenParams>();
  const space = useGetSpace(route.params.spaceID);
  const view = useGetView(route.params.viewID);
  const collections = useGetSpaceCollectionList(space.id);

  return (
    <Screen>
      <SpaceHeader space={space} />
      <CollectionsMenu collections={collections} />
      <ViewDisplay view={view} />
    </Screen>
  );
}

interface SpaceHeaderProps {
  space: Space;
}

function SpaceHeader(props: SpaceHeaderProps) {
  const { space } = props;

  return (
    <Container>
      <Text>{space.name}</Text>
    </Container>
  );
}

interface CollectionsMenuProps {
  collections: Collection[];
}

function CollectionsMenu(props: CollectionsMenuProps) {
  const { collections } = props;

  return (
    <Container>
      <Row>
        {collections.map((collection) => (
          <Container key={collection.id}>
            <Text>{collection.name}</Text>
          </Container>
        ))}
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
      <Container height={48}>
        <Row>
          <Container />
          <ScrollView
            horizontal
            ref={headerScrollView}
            onScroll={handleHeaderHorizontalScroll}
            scrollEventThrottle={24}
          >
            {fieldList.map((field) => {
              const fieldConfig = fieldsConfig[field.id];

              return (
                <Container key={field.id} width={fieldConfig.width}>
                  <Text>{field.name}</Text>
                </Container>
              );
            })}
          </ScrollView>
        </Row>
      </Container>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <Row flex={1}>
          {/* <LeftColumn /> */}
          <ScrollView
            horizontal
            ref={gridHorizontalScrollView}
            onScroll={handleGridHorizontalScroll}
            scrollEventThrottle={24}
          >
            <Column>
              {documentList.map((doc) => (
                <Row key={doc.id}>
                  {fieldList.map((field) => {
                    const fieldConfig = fieldsConfig[field.id];

                    return (
                      <Container
                        key={`${field.id}${doc.id}`}
                        width={fieldConfig.width}
                      >
                        <ListViewDocumentFieldValueContainer
                          value={doc.fields[field.id]}
                        />
                      </Container>
                    );
                  })}
                </Row>
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
