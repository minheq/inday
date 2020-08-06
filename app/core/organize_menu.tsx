import React, { useState, useCallback, createContext, useContext } from 'react';
import { ScrollView } from 'react-native';

import {
  NumberFilterRule,
  TextFilterRule,
  Filter,
  FilterID,
  FilterRule,
  FilterRuleValue,
  TextFilterRuleValue,
  NumberFilterRuleValue,
} from '../data/filters';
import {
  Container,
  SegmentedControl,
  Spacer,
  Button,
  Text,
  Option,
  ListItem,
  BackButton,
  Row,
  TextInput,
} from '../components';
import {
  useGetCollectionFields,
  useGetViewFilters,
  useGetField,
} from '../data/store';
import { FieldType } from '../data/constants';
import { Field, FieldID } from '../data/fields';
import { SpaceID } from '../data/spaces';
import { ViewID } from '../data/views';
import { CollectionID } from '../data/collections';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const OrganizeMenuContext = createContext({
  spaceID: '1',
  viewID: '1',
  collectionID: '1',
});

interface OrganizeMenuProps {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

const OrganizeMenuStack = createStackNavigator();

interface FilterEdit {
  id: FilterID;
  fieldID: FieldID;
  rule: FilterRule | null;
  value: FilterRuleValue | null;
}

interface FilterMenuContext {
  filter: FilterEdit;
  setFilter: (filter: FilterEdit) => void;
}

const FilterMenuContext = createContext<FilterMenuContext>({
  filter: {
    id: '',
    fieldID: '',
    rule: null,
    value: null,
  },
  setFilter: () => {},
});

export function OrganizeMenu(props: OrganizeMenuProps) {
  const { spaceID, viewID, collectionID } = props;
  const [filter, setFilter] = useState<FilterEdit>({
    id: '',
    fieldID: '',
    rule: null,
    value: null,
  });

  return (
    <OrganizeMenuContext.Provider value={{ spaceID, viewID, collectionID }}>
      <FilterMenuContext.Provider value={{ filter, setFilter }}>
        <OrganizeMenuStack.Navigator>
          <OrganizeMenuStack.Screen name="Organize" component={Organize} />
          <OrganizeMenuStack.Screen
            name="FilterFieldSelect"
            component={FilterFieldSelect}
          />
          <OrganizeMenuStack.Screen
            name="FilterRuleSelect"
            component={FilterRuleSelect}
          />
          <OrganizeMenuStack.Screen
            name="FilterRuleValueEdit"
            component={FilterRuleValueEdit}
          />
        </OrganizeMenuStack.Navigator>
      </FilterMenuContext.Provider>
    </OrganizeMenuContext.Provider>
  );
}

function Organize() {
  const [tab, setTab] = useState(2);

  return (
    <Container flex={1} color="content" padding={8}>
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
  const navigation = useNavigation();
  const organizeMenuContext = useContext(OrganizeMenuContext);
  const filterMenuContext = useContext(FilterMenuContext);
  const filters = useGetViewFilters(organizeMenuContext.viewID);

  const handlePressAddFilter = useCallback(() => {
    filterMenuContext.setFilter({
      id: 'new',
      fieldID: '',
      rule: null,
      value: null,
    });

    navigation.navigate('FilterFieldSelect');
  }, [navigation, filterMenuContext]);

  return (
    <Container color="content" flex={1}>
      <ScrollView>
        {filters.map((filter) => (
          <FilterListItem filter={filter} />
        ))}
        <Button
          alignTitle="left"
          onPress={handlePressAddFilter}
          title="+ Add filter"
        />
      </ScrollView>
    </Container>
  );
}

interface FilterListItemProps {
  filter: Filter;
}

function FilterListItem(props: FilterListItemProps) {
  const { filter } = props;
  const field = useGetField(filter.fieldID);

  return (
    <Container>
      <Text>{field.name}</Text>
      <Button title={`${filter.rule} ${filter.value}`} />
    </Container>
  );
}

function FilterFieldSelect() {
  const navigation = useNavigation();
  const organizeMenuContext = useContext(OrganizeMenuContext);
  const filterMenuContext = useContext(FilterMenuContext);
  const fields = useGetCollectionFields(organizeMenuContext.collectionID);

  const handlePressField = useCallback(
    (field: Field) => {
      const prevFilter = filterMenuContext.filter;

      filterMenuContext.setFilter({
        id: prevFilter.id,
        fieldID: field.id,
        rule: null,
        value: null,
      });

      navigation.navigate('FilterRuleSelect');
    },
    [navigation, filterMenuContext],
  );

  return (
    <Container color="content" flex={1}>
      <Container padding={16}>
        <Row>
          <BackButton onPress={() => navigation.goBack()} />
        </Row>
      </Container>
      <Spacer size={16} />
      <ScrollView>
        <Container paddingHorizontal={16}>
          {fields.map((field) => (
            <>
              <ListItem
                key={field.id}
                onPress={() => handlePressField(field)}
                description={field.name}
              />
              <Spacer size={4} />
            </>
          ))}
        </Container>
      </ScrollView>
    </Container>
  );
}

function FilterRuleSelect() {
  const navigation = useNavigation();
  const filterMenuContext = useContext(FilterMenuContext);
  const field = useGetField(filterMenuContext.filter.fieldID);

  const handleSelectFilterRule = useCallback(
    (rule: FilterRule) => {
      filterMenuContext.setFilter({
        id: filterMenuContext.filter.fieldID,
        fieldID: field.id,
        rule,
        value: filterMenuContext.filter.value,
      });

      console.log('navigate!');

      navigation.navigate('FilterRuleValueEdit');
    },
    [navigation, field, filterMenuContext],
  );

  const Select = filterRuleSelectComponentByFieldType[field.type];

  return (
    <Container color="content" flex={1}>
      <Container padding={16}>
        <Row>
          <BackButton onPress={() => navigation.goBack()} />
        </Row>
      </Container>
      <Container padding={8}>
        <Text bold>{field.name}</Text>
      </Container>
      <Spacer size={16} />
      <ScrollView>
        <Container paddingHorizontal={16}>
          <Select onSelect={handleSelectFilterRule} />
        </Container>
      </ScrollView>
    </Container>
  );
}

function FilterRuleValueEdit() {
  const navigation = useNavigation();
  const filterMenuContext = useContext(FilterMenuContext);
  const field = useGetField(filterMenuContext.filter.fieldID);

  const handleSelectFilterRuleValueChange = useCallback(
    (value: FilterRuleValue) => {
      filterMenuContext.setFilter({
        id: filterMenuContext.filter.fieldID,
        fieldID: field.id,
        rule: filterMenuContext.filter.rule,
        value,
      });
    },
    [field, filterMenuContext],
  );

  const ValueEdit = filterRuleValueEditComponentByFieldType[field.type];

  return (
    <Container color="content" flex={1}>
      <Container padding={16}>
        <Row>
          <BackButton onPress={() => navigation.goBack()} />
        </Row>
      </Container>
      <Container padding={8}>
        <Text bold>{field.name}</Text>
      </Container>
      <Spacer size={16} />
      <ScrollView>
        <Container paddingHorizontal={16}>
          <ValueEdit
            value={filterMenuContext.filter.value}
            onChange={handleSelectFilterRuleValueChange}
          />
        </Container>
      </ScrollView>
    </Container>
  );
}

interface FilterRuleSelectProps {
  onSelect: (rule: FilterRule) => void;
}

const filterRuleSelectComponentByFieldType: {
  [fieldType in FieldType]: (props: FilterRuleSelectProps) => JSX.Element;
} = {
  [FieldType.Checkbox]: TextFilterRuleSelect,
  [FieldType.Currency]: NumberFilterRuleSelect,
  [FieldType.Date]: TextFilterRuleSelect,
  [FieldType.Email]: TextFilterRuleSelect,
  [FieldType.MultiCollaborator]: TextFilterRuleSelect,
  [FieldType.MultiDocumentLink]: TextFilterRuleSelect,
  [FieldType.MultiLineText]: TextFilterRuleSelect,
  [FieldType.MultiSelect]: TextFilterRuleSelect,
  [FieldType.Number]: NumberFilterRuleSelect,
  [FieldType.PhoneNumber]: TextFilterRuleSelect,
  [FieldType.SingleCollaborator]: TextFilterRuleSelect,
  [FieldType.SingleDocumentLink]: TextFilterRuleSelect,
  [FieldType.SingleLineText]: TextFilterRuleSelect,
  [FieldType.SingleSelect]: TextFilterRuleSelect,
  [FieldType.URL]: TextFilterRuleSelect,
};

interface TextFilterRuleSelectProps {
  onSelect: (rule: TextFilterRule) => void;
}

function TextFilterRuleSelect(props: TextFilterRuleSelectProps) {
  const { onSelect } = props;

  const options: Option<TextFilterRule>[] = [
    { value: 'contains', label: 'contains' },
    { value: 'doesNotContain', label: 'does not contain' },
    { value: 'is', label: 'is' },
    { value: 'isNot', label: 'is not' },
    { value: 'isEmpty', label: 'is empty' },
    { value: 'isNotEmpty', label: 'is not empty' },
  ];

  return (
    <Container>
      {options.map((o) => (
        <>
          <ListItem onPress={() => onSelect(o.value)} description={o.label} />
          <Spacer size={4} />
        </>
      ))}
    </Container>
  );
}

function NumberFilterRuleSelect(props: FilterRuleSelectProps) {
  const { onSelect } = props;

  const options: Option<NumberFilterRule>[] = [
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
      {options.map((o) => (
        <>
          <ListItem onPress={() => onSelect(o.value)} description={o.label} />
          <Spacer size={4} />
        </>
      ))}
    </Container>
  );
}

interface FilterRuleValueEditProps {
  value: FilterRuleValue;
  onChange: (value: FilterRuleValue) => void;
}

const filterRuleValueEditComponentByFieldType: {
  [fieldType in FieldType]: (props: FilterRuleValueEditProps) => JSX.Element;
} = {
  [FieldType.Checkbox]: TextFilterRuleValueEdit,
  [FieldType.Currency]: NumberFilterRuleValueEdit,
  [FieldType.Date]: TextFilterRuleValueEdit,
  [FieldType.Email]: TextFilterRuleValueEdit,
  [FieldType.MultiCollaborator]: TextFilterRuleValueEdit,
  [FieldType.MultiDocumentLink]: TextFilterRuleValueEdit,
  [FieldType.MultiLineText]: TextFilterRuleValueEdit,
  [FieldType.MultiSelect]: TextFilterRuleValueEdit,
  [FieldType.Number]: NumberFilterRuleValueEdit,
  [FieldType.PhoneNumber]: TextFilterRuleValueEdit,
  [FieldType.SingleCollaborator]: TextFilterRuleValueEdit,
  [FieldType.SingleDocumentLink]: TextFilterRuleValueEdit,
  [FieldType.SingleLineText]: TextFilterRuleValueEdit,
  [FieldType.SingleSelect]: TextFilterRuleValueEdit,
  [FieldType.URL]: TextFilterRuleValueEdit,
};

interface TextFilterRuleValueEditProps {
  value: TextFilterRuleValue;
  onChange: (value: TextFilterRuleValue) => void;
}

function TextFilterRuleValueEdit(props: TextFilterRuleValueEditProps) {
  const { onChange, value } = props;

  return (
    <Container>
      <TextInput value={value} onChange={onChange} />
    </Container>
  );
}

interface NumberFilterRuleValueEditProps {
  value: NumberFilterRuleValue;
  onChange: (value: NumberFilterRuleValue) => void;
}

function NumberFilterRuleValueEdit(props: NumberFilterRuleValueEditProps) {
  const { onChange, value } = props;

  return (
    <Container>
      <TextInput
        value={value ? `${value}` : ''}
        onChange={(v) => onChange(Number(v))}
      />
    </Container>
  );
}
