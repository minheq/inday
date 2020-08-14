import React, { useCallback, createContext, useContext } from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import {
  Screen,
  Container,
  Text,
  Row,
  Column,
  BackButton,
  Button,
  Spacer,
  Icon,
} from '../components';
import {
  useRoute,
  RouteProp,
  NavigationHelpers,
} from '@react-navigation/native';
import { RootStackParamsMap } from '../linking';
import {
  useGetSpace,
  useGetView,
  useGetSpaceCollections,
  useGetCollection,
  useGetCollectionFieldsByID,
  useGetViewDocuments,
} from '../data/store';
import { Space } from '../data/spaces';
import { Slide } from '../components/slide';
import { Field, FieldType } from '../data/fields';
import {
  FieldValue,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
} from '../data/documents';
import {
  assertCheckboxField,
  assertCurrencyField,
  assertDateField,
  assertEmailField,
  assertMultiCollaboratorField,
  assertMultiDocumentLinkField,
  assertMultiLineTextField,
  assertMultiOptionField,
  assertNumberField,
  assertPhoneNumberField,
  assertSingleCollaboratorField,
  assertSingleDocumentLinkField,
  assertSingleLineTextField,
  assertSingleOptionField,
  assertURLField,
} from '../data/fields';
import { format } from 'date-fns';
import { OrganizeMenu } from '../core/organize_menu';
import { ViewsMenu } from '../core/views_menu';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { View, ListView, ViewType, assertListView } from '../data/views';

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
  const [slide, setSlide] = React.useState<'views' | 'organize' | null>(
    'organize',
  );
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

interface ListViewDisplayProps {
  view: ListView;
}

const LEFT_COLUMN_WIDTH = 40;
const DOCUMENT_HEIGHT = 32;
const FIELD_HEIGHT = 40;

function ListViewDisplay(props: ListViewDisplayProps) {
  const { view } = props;
  const collection = useGetCollection(view.collectionID);
  const fieldsByID = useGetCollectionFieldsByID(collection.id);
  const documents = useGetViewDocuments(view.id);

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
    .map((fieldID) => fieldsByID[fieldID]);

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
            scrollEventThrottle={16}
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
                  <Row alignItems="center">
                    <Icon name="menu" />
                    <Spacer size={8} />
                    <Text>{field.name}</Text>
                  </Row>
                </Container>
              );
            })}
          </ScrollView>
        </Row>
      </Container>
      <ScrollView style={styles.stretch} contentContainerStyle={styles.stretch}>
        <Row flex={1}>
          <Container width={LEFT_COLUMN_WIDTH}>
            <Column>
              {documents.map((doc, i) => (
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
            scrollEventThrottle={16}
          >
            <Column>
              {documents.map((doc) => (
                <Container
                  key={doc.id}
                  color="content"
                  borderBottomWidth={1}
                  height={DOCUMENT_HEIGHT}
                >
                  <Row key={doc.id}>
                    {fieldList.map((field) => {
                      const fieldConfig = fieldsConfig[field.id];
                      const cell = documentFieldValueComponentByFieldType[
                        field.type
                      ](doc.fields[field.id], field);

                      return (
                        <Container
                          key={`${field.id}${doc.id}`}
                          width={fieldConfig.width}
                          height="100%"
                          borderRightWidth={1}
                          padding={4}
                          paddingHorizontal={8}
                        >
                          {cell}
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

const documentFieldValueComponentByFieldType: {
  [fieldType in FieldType]: (
    value: FieldValue,
    field: Field,
  ) => React.ReactNode;
} = {
  [FieldType.Checkbox]: (value, field) => {
    assertCheckboxFieldValue(value);
    assertCheckboxField(field);

    return <Text>{value ? 'checked' : 'unchecked'}</Text>;
  },
  [FieldType.Currency]: (value, field) => {
    assertCurrencyFieldValue(value);
    assertCurrencyField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.Date]: (value, field) => {
    assertDateFieldValue(value);
    assertDateField(field);

    if (value === null) {
      return null;
    }

    return <Text>{format(value, field.format)}</Text>;
  },
  [FieldType.Email]: (value, field) => {
    assertEmailFieldValue(value);
    assertEmailField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.MultiCollaborator]: (value, field) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorField(field);

    return <Text>{value[0]}</Text>;
  },

  [FieldType.MultiDocumentLink]: (value, field) => {
    assertMultiDocumentLinkFieldValue(value);
    assertMultiDocumentLinkField(field);

    return <Text>{value[0]}</Text>;
  },
  [FieldType.MultiLineText]: (value, field) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.MultiOption]: (value, field) => {
    assertMultiOptionFieldValue(value);
    assertMultiOptionField(field);

    return <Text>{value[0]}</Text>;
  },

  [FieldType.Number]: (value, field) => {
    assertNumberFieldValue(value);
    assertNumberField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.PhoneNumber]: (value, field) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleCollaborator]: (value, field) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleDocumentLink]: (value, field) => {
    assertSingleDocumentLinkFieldValue(value);
    assertSingleDocumentLinkField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleLineText]: (value, field) => {
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleOption]: (value, field) => {
    assertSingleOptionFieldValue(value);
    assertSingleOptionField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.URL]: (value, field) => {
    assertURLFieldValue(value);
    assertURLField(field);

    return <Text>{value}</Text>;
  },
};

const styles = StyleSheet.create({
  stretch: {
    flex: 1,
  },
});
