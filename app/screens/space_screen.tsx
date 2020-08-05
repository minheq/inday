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
  IconName,
  Spacer,
  Icon,
  SegmentedControl,
  Picker,
  Option,
  TextInput,
} from '../components';
import {
  useRoute,
  RouteProp,
  NavigationHelpers,
} from '@react-navigation/native';
import { RootStackParamsMap } from '../linking';
import { View, ListView } from '../data/views';
import { Collection } from '../data/collections';
import {
  useGetSpace,
  useGetView,
  useGetSpaceCollections,
  useGetCollection,
  useGetCollectionDocuments,
  useGetCollectionViews,
  useGetCollectionFields,
  useGetCollectionFieldsByID,
  useCreateFilter,
  useGetViewFilters,
  useGetField,
  useUpdateFilterConfig,
  useGetFieldCallback,
  useGetViewDocuments,
} from '../data/store';
import { Space } from '../data/spaces';
import { Slide } from '../components/slide';
import { FieldType } from '../data/constants';
import { first } from '../../lib/data_structures/arrays';
import { FieldID, Field } from '../data/fields';
import {
  DocumentFieldValue,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiSelectFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleSelectFieldValue,
  assertURLFieldValue,
  SingleLineTextFieldValue,
  MultiLineTextFieldValue,
  URLFieldValue,
  PhoneNumberFieldValue,
} from '../data/documents';
import {
  assertCheckboxField,
  assertCurrencyField,
  assertDateField,
  assertEmailField,
  assertMultiCollaboratorField,
  assertMultiDocumentLinkField,
  assertMultiLineTextField,
  assertMultiSelectField,
  assertNumberField,
  assertPhoneNumberField,
  assertSingleCollaboratorField,
  assertSingleDocumentLinkField,
  assertSingleLineTextField,
  assertSingleSelectField,
  assertURLField,
} from '../data/fields';
import { format } from 'date-fns';
import {
  NumberFilterCondition,
  TextFilterCondition,
  getDefaultFilterConfig,
  Filter,
  TextFilterConditionValue,
  FilterCondition,
  FilterConditionValue,
  SingleLineTextFieldFilter,
  TextFilter,
  assertEmailFieldFilter,
  assertMultiLineTextFieldFilter,
  assertPhoneNumberFieldFilter,
  assertSingleLineTextFieldFilter,
  assertURLFieldFilter,
} from '../data/filters';
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
      <Button>
        <Container center height={40} paddingHorizontal={16}>
          <Text>{space.name}</Text>
        </Container>
      </Button>
    </Row>
  );
}

function TopMenu() {
  return (
    <Row expanded alignItems="center" justifyContent="flex-end">
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
      <Container center height={40} paddingHorizontal={16}>
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
  const collections = useGetSpaceCollections(space.id);
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
    <Button state={active ? 'active' : 'default'} radius={0}>
      <Container center height={40} paddingHorizontal={16}>
        <Text>{collection.name}</Text>
      </Container>
    </Button>
  );
}

function MainContent() {
  const [slide, setSlide] = React.useState<'views' | 'organize' | null>(
    'organize',
  );
  const context = useContext(SpaceScreenContext);
  const space = useGetSpace(context.spaceID);
  const view = useGetView(context.viewID);
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

  return (
    <Container flex={1}>
      <ViewBar
        onToggleView={handleToggleView}
        onToggleOrganize={handleToggleOrganize}
      />
      <Row flex={1}>
        <Slide width={240} open={slide === 'views'}>
          <Container width={240} expanded color="content" borderRightWidth={1}>
            <ViewsMenu />
          </Container>
        </Slide>
        <ViewDisplay view={view} />
        <Slide width={360} open={slide === 'organize'}>
          <Container width={360} expanded color="content" borderLeftWidth={1}>
            <OrganizeMenu />
          </Container>
        </Slide>
      </Row>
    </Container>
  );
}

function ViewsMenu() {
  const context = useContext(SpaceScreenContext);
  const activeView = useGetView(context.viewID);
  const views = useGetCollectionViews(activeView.collectionID);

  return (
    <Container padding={8} color="content" borderRightWidth={1}>
      <Text color="muted" size="sm" bold>
        TEAM VIEWS
      </Text>
      <Spacer size={16} />
      {views.map((v) => (
        <>
          <Button state={activeView.id === v.id ? 'active' : 'default'}>
            <Container height={40} paddingHorizontal={16}>
              <Row expanded alignItems="center">
                <Icon name="layout" />
                <Spacer size={8} />
                <Text>{v.name}</Text>
              </Row>
            </Container>
          </Button>
          <Spacer size={4} />
        </>
      ))}
      <Spacer size={32} />
      <Text color="muted" size="sm" bold>
        PERSONAL VIEWS
      </Text>
    </Container>
  );
}

function OrganizeMenu() {
  const [tab, setTab] = React.useState(2);

  return (
    <Container padding={8}>
      <SegmentedControl
        onChange={setTab}
        value={tab}
        options={[
          { label: 'Fields', value: 1 },
          { label: 'Filter', value: 2 },
          { label: 'Sort', value: 3 },
          { label: 'Group', value: 4 },
        ]}
      />
      <Spacer size={16} />
      {tab === 2 && <FilterMenu />}
    </Container>
  );
}

function FilterMenu() {
  const context = useContext(SpaceScreenContext);
  const createFilter = useCreateFilter();
  const fields = useGetCollectionFields(context.collectionID);
  const filters = useGetViewFilters(context.viewID);
  const firstField = first(fields);

  const handlePressAddFilter = useCallback(() => {
    const filterConfig = getDefaultFilterConfig(firstField.type);

    createFilter(context.viewID, firstField.id, filterConfig);
  }, [createFilter, context, firstField]);

  return (
    <Container>
      {filters.map((filter) => (
        <FilterEdit filter={filter} />
      ))}
      <Button onPress={handlePressAddFilter}>
        <Text>+ Add filter</Text>
      </Button>
    </Container>
  );
}

interface FilterEditProps {
  filter: Filter;
}

function FilterEdit(props: FilterEditProps) {
  const { filter } = props;
  const context = useContext(SpaceScreenContext);
  const field = useGetField(filter.fieldID);
  const fields = useGetCollectionFields(context.collectionID);
  const getField = useGetFieldCallback();
  const updateFilterConfig = useUpdateFilterConfig();

  const handleChangeField = useCallback(
    (fieldID: FieldID) => {
      const newField = getField(fieldID);
      const filterConfig = getDefaultFilterConfig(newField.type);

      updateFilterConfig(filter.id, fieldID, filterConfig);
    },
    [filter, getField, updateFilterConfig],
  );

  const input = filterConditionInputComponentByFieldType[field.type](
    field,
    filter,
  );

  return (
    <Container>
      <Picker
        value={field.id}
        onChange={handleChangeField}
        options={fields.map((f) => ({
          label: f.name,
          value: f.id,
        }))}
      />
      <Spacer size={4} />
      {input}
    </Container>
  );
}

const filterConditionInputComponentByFieldType: {
  [fieldType in FieldType]: (field: Field, filter: Filter) => React.ReactNode;
} = {
  [FieldType.Checkbox]: (field, filter) => {
    assertCheckboxField(field);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.Currency]: (field, filter) => {
    assertCurrencyField(field);

    return <NumberFilterConditionInput filter={filter} />;
  },
  [FieldType.Date]: (field, filter) => {
    assertDateField(field);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.Email]: (field, filter) => {
    assertEmailField(field);
    assertEmailFieldFilter(filter);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.MultiCollaborator]: (field, filter) => {
    assertMultiCollaboratorField(field);

    return <TextFilterConditionInput filter={filter} />;
  },

  [FieldType.MultiDocumentLink]: (field, filter) => {
    assertMultiDocumentLinkField(field);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.MultiLineText]: (field, filter) => {
    assertMultiLineTextField(field);
    assertMultiLineTextFieldFilter(filter);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.MultiSelect]: (field, filter) => {
    assertMultiSelectField(field);

    return <TextFilterConditionInput filter={filter} />;
  },

  [FieldType.Number]: (field, filter) => {
    assertNumberField(field);

    return <NumberFilterConditionInput filter={filter} />;
  },
  [FieldType.PhoneNumber]: (field, filter) => {
    assertPhoneNumberField(field);
    assertPhoneNumberFieldFilter(filter);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.SingleCollaborator]: (field, filter) => {
    assertSingleCollaboratorField(field);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.SingleDocumentLink]: (field, filter) => {
    assertSingleDocumentLinkField(field);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.SingleLineText]: (field, filter) => {
    assertSingleLineTextField(field);
    assertSingleLineTextFieldFilter(filter);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.SingleSelect]: (field, filter) => {
    assertSingleSelectField(field);

    return <TextFilterConditionInput filter={filter} />;
  },
  [FieldType.URL]: (field, filter) => {
    assertURLField(field);
    assertURLFieldFilter(filter);

    return <TextFilterConditionInput filter={filter} />;
  },
};

interface TextFilterConditionInputProps {
  filter: TextFilter;
}

function TextFilterConditionInput(props: TextFilterConditionInputProps) {
  const { filter } = props;
  const { condition, value } = filter;
  const updateFilterConfig = useUpdateFilterConfig();

  const handleChangeCondition = useCallback(
    (newCondition: TextFilterCondition) => {
      updateFilterConfig(filter.id, filter.fieldID, {
        condition: newCondition,
        value: '',
      });
    },
    [filter, updateFilterConfig],
  );

  const handleChangeValue = useCallback(
    (newValue: TextFilterConditionValue) => {
      updateFilterConfig(filter.id, filter.fieldID, {
        condition: filter.condition,
        value: newValue,
      });
    },
    [filter, updateFilterConfig],
  );

  const options: Option<TextFilterCondition>[] = [
    { value: 'contains', label: 'contains' },
    { value: 'doesNotContain', label: 'does not contain' },
    { value: 'is', label: 'is' },
    { value: 'isNot', label: 'is not' },
    { value: 'isEmpty', label: 'is empty' },
    { value: 'isNotEmpty', label: 'is not empty' },
  ];

  return (
    <Container>
      <Picker
        value={condition}
        onChange={handleChangeCondition}
        options={options}
      />
      <Spacer size={4} />
      <TextInput value={value} onChange={handleChangeValue} />
    </Container>
  );
}

function NumberFilterConditionInput() {
  const options: Option<NumberFilterCondition>[] = [
    { value: 'equal', label: 'equal' },
    { value: 'notEqual', label: 'not equal' },
    { value: 'lessThan', label: 'less than' },
    { value: 'greaterThan', label: 'greater than' },
    { value: 'lessThanOrEqual', label: 'less than or equal' },
    { value: 'greaterThanOrEqual', label: 'greater than or equal' },
    { value: 'isEmpty', label: 'is empty' },
    { value: 'isNotEmpty', label: 'is not empty' },
  ];

  return (
    <Container>
      <Picker
        // value={selectedFieldID}
        // onChange={handleChangeField}
        options={options}
      />
      <Spacer size={4} />
      <TextInput />
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
        <Button onPress={onToggleView}>
          <Container center height={40} paddingHorizontal={16}>
            <Row alignItems="center">
              <Icon name="layout" />
              <Spacer size={8} />
              <Text>{view.name}</Text>
            </Row>
          </Container>
        </Button>
        <Button onPress={onToggleOrganize}>
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
                  <Text>{field.name}</Text>
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
    value: DocumentFieldValue,
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
  [FieldType.MultiSelect]: (value, field) => {
    assertMultiSelectFieldValue(value);
    assertMultiSelectField(field);

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
  [FieldType.SingleSelect]: (value, field) => {
    assertSingleSelectFieldValue(value);
    assertSingleSelectField(field);

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
