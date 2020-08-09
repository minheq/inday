import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  Fragment,
  useEffect,
} from 'react';

import {
  NumberFilterRule,
  TextFilterRule,
  getDefaultFilterConfig,
  Filter,
  FilterID,
  FilterConfig,
  assertNumberFilterConfig,
  assertTextFilterConfig,
} from '../data/filters';
import {
  Container,
  SegmentedControl,
  Spacer,
  Button,
  TextInput,
  Picker,
  Option,
  Text,
  Row,
  Pressable,
} from '../components';
import {
  useCreateFilter,
  useGetCollectionFields,
  useGetViewFilters,
  useDeleteFilter,
  useUpdateFilterConfig,
  useGetField,
  useGetFieldCallback,
} from '../data/store';
import { first } from '../../lib/data_structures/arrays';
import { FieldType } from '../data/constants';
import { FieldID } from '../data/fields';
import { SpaceID } from '../data/spaces';
import { ViewID } from '../data/views';
import { CollectionID } from '../data/collections';
import { atom, useRecoilState } from 'recoil';
import { tokens } from '../components/theme';

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

export function OrganizeMenu(props: OrganizeMenuProps) {
  const { spaceID, viewID, collectionID } = props;

  const [tab, setTab] = useState(2);

  return (
    <OrganizeMenuContext.Provider value={{ spaceID, viewID, collectionID }}>
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
    </OrganizeMenuContext.Provider>
  );
}

const filterEditIDState = atom<FilterID>({
  key: 'FilterMenuFilterEditID',
  default: '',
});

function FilterMenu() {
  const context = useContext(OrganizeMenuContext);
  const filters = useGetViewFilters(context.viewID);

  return (
    <Container>
      {filters.map((filter) => (
        <Fragment key={filter.id}>
          <FilterListItem filter={filter} />
          <Spacer size={24} />
        </Fragment>
      ))}
      <FilterNew />
    </Container>
  );
}

interface FilterListItemProps {
  filter: Filter;
}

function FilterListItem(props: FilterListItemProps) {
  const { filter } = props;
  const [filterEditID, setFilterEditID] = useRecoilState(filterEditIDState);
  const field = useGetField(filter.fieldID);
  const deleteFilter = useDeleteFilter();
  const updateFilterConfig = useUpdateFilterConfig();
  const [filterConfig, setFilterConfig] = useState<FilterConfig>(filter);
  const edit = filterEditID === filter.id;

  const handleChangeFilterConfig = useCallback((config: FilterConfig) => {
    setFilterConfig(config);
  }, []);

  const handlePressEdit = useCallback(() => {
    setFilterEditID(filter.id);
  }, [setFilterEditID, filter]);

  const handlePressCancel = useCallback(() => {
    setFilterEditID('');
  }, [setFilterEditID]);

  const handleRemove = useCallback(() => {
    deleteFilter(filter);
    setFilterEditID('');
  }, [deleteFilter, setFilterEditID, filter]);

  const handlePressDone = useCallback(() => {
    updateFilterConfig(filter.id, filterConfig);
    setFilterEditID('');
  }, [updateFilterConfig, setFilterEditID, filter, filterConfig]);

  useEffect(() => {
    setFilterConfig(filter);
  }, [filterEditID, filter]);

  if (edit === false) {
    return (
      <Container padding={16} borderRadius={tokens.radius} shadow>
        <Row justifyContent="flex-end">
          <Pressable onPress={handlePressEdit}>
            <Text color="primary">Edit</Text>
          </Pressable>
        </Row>
        <Text>{field.name}</Text>
        <Text>{filter.rule}</Text>
        <Text>{filter.value}</Text>
      </Container>
    );
  }

  return (
    <Container padding={16} borderRadius={tokens.radius} shadow>
      <FilterEdit filterConfig={filter} onChange={handleChangeFilterConfig} />
      <Spacer size={16} />
      <Row justifyContent="space-between">
        <Pressable onPress={handleRemove}>
          <Text color="error">Remove</Text>
        </Pressable>
        <Row>
          <Pressable onPress={handlePressCancel}>
            <Text>Cancel</Text>
          </Pressable>
          <Spacer size={16} />
          <Pressable onPress={handlePressDone}>
            <Text color="primary">Done</Text>
          </Pressable>
        </Row>
      </Row>
    </Container>
  );
}

function FilterNew() {
  const [open, setOpen] = useState(false);
  const context = useContext(OrganizeMenuContext);
  const fields = useGetCollectionFields(context.collectionID);
  const createFilter = useCreateFilter();
  const firstField = first(fields);
  const defaultFilterConfig = getDefaultFilterConfig(firstField);
  const [filterConfig, setFilterConfig] = useState(defaultFilterConfig);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFilterConfig(defaultFilterConfig);
  }, [defaultFilterConfig]);

  const handlePressAddFilter = useCallback(() => {
    setOpen(true);
  }, []);

  const handlePressSave = useCallback(() => {
    handleClose();

    createFilter(context.viewID, filterConfig);
  }, [handleClose, createFilter, context, filterConfig]);

  if (open) {
    return (
      <Container padding={16} borderRadius={tokens.radius} shadow>
        <FilterEdit filterConfig={filterConfig} onChange={setFilterConfig} />
        <Spacer size={16} />
        <Row justifyContent="flex-end">
          <Pressable onPress={handleClose}>
            <Text>Cancel</Text>
          </Pressable>
          <Spacer size={16} />
          <Pressable onPress={handlePressSave}>
            <Text color="primary">Save</Text>
          </Pressable>
        </Row>
      </Container>
    );
  }

  return (
    <Button
      alignTitle="left"
      onPress={handlePressAddFilter}
      title="+ Add filter"
    />
  );
}

interface FilterEditProps {
  filterConfig: FilterConfig;
  onChange: (filterConfig: FilterConfig) => void;
}

function FilterEdit(props: FilterEditProps) {
  const { filterConfig, onChange } = props;
  const context = useContext(OrganizeMenuContext);
  const field = useGetField(filterConfig.fieldID);
  const fields = useGetCollectionFields(context.collectionID);
  const getField = useGetFieldCallback();

  const handleChangeField = useCallback(
    (fieldID: FieldID) => {
      const newField = getField(fieldID);
      const defaultFilterConfig = getDefaultFilterConfig(newField);

      onChange({
        ...defaultFilterConfig,
        fieldID,
      });
    },
    [getField, onChange],
  );

  const FilterConfigEdit = filterConfigEditComponentByFieldType[field.type];

  return (
    <Container padding={16} borderRadius={tokens.radius} shadow>
      <Picker
        value={field.id}
        onChange={handleChangeField}
        options={fields.map((f) => ({
          label: f.name,
          value: f.id,
        }))}
      />
      <Spacer size={4} />
      <FilterConfigEdit onChange={onChange} filterConfig={filterConfig} />
    </Container>
  );
}

interface FilterRuleInputProps {
  filterConfig: FilterConfig;
  onChange: (filterConfig: FilterConfig) => void;
}

const filterConfigEditComponentByFieldType: {
  [fieldType in FieldType]: React.ComponentType<FilterRuleInputProps>;
} = {
  [FieldType.Checkbox]: TextFilterRuleInput,
  [FieldType.Currency]: NumberFilterRuleInput,
  [FieldType.Date]: TextFilterRuleInput,
  [FieldType.Email]: TextFilterRuleInput,
  [FieldType.MultiCollaborator]: TextFilterRuleInput,
  [FieldType.MultiDocumentLink]: TextFilterRuleInput,
  [FieldType.MultiLineText]: TextFilterRuleInput,
  [FieldType.MultiSelect]: TextFilterRuleInput,
  [FieldType.Number]: NumberFilterRuleInput,
  [FieldType.PhoneNumber]: TextFilterRuleInput,
  [FieldType.SingleCollaborator]: TextFilterRuleInput,
  [FieldType.SingleDocumentLink]: TextFilterRuleInput,
  [FieldType.SingleLineText]: TextFilterRuleInput,
  [FieldType.SingleSelect]: TextFilterRuleInput,
  [FieldType.URL]: TextFilterRuleInput,
};

function TextFilterRuleInput(props: FilterRuleInputProps) {
  const { filterConfig, onChange } = props;

  assertTextFilterConfig(filterConfig);

  const { rule, value, fieldID } = filterConfig;

  const handleChangeRule = useCallback(
    (newRule: TextFilterRule) => {
      onChange({
        rule: newRule,
        value: '',
        fieldID,
      });
    },
    [onChange, fieldID],
  );

  const handleChangeValue = useCallback(
    (newValue: string) => {
      onChange({
        rule,
        value: newValue,
        fieldID,
      });
    },
    [onChange, rule, fieldID],
  );

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
      <Picker value={rule} onChange={handleChangeRule} options={options} />
      <Spacer size={4} />
      <TextInput value={value} onChange={handleChangeValue} />
    </Container>
  );
}

function NumberFilterRuleInput(props: FilterRuleInputProps) {
  const { filterConfig, onChange } = props;
  assertNumberFilterConfig(filterConfig);

  const { rule, value, fieldID } = filterConfig;

  const handleChangeRule = useCallback(
    (newRule: NumberFilterRule) => {
      onChange({
        rule: newRule,
        value: null,
        fieldID,
      });
    },
    [onChange, fieldID],
  );

  const handleChangeValue = useCallback(
    (newValue: string) => {
      onChange({
        rule,
        value: Number(newValue),
        fieldID,
      });
    },
    [onChange, rule, fieldID],
  );

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
      <Picker value={rule} onChange={handleChangeRule} options={options} />
      <Spacer size={4} />
      <TextInput value={value ? `${value}` : ''} onChange={handleChangeValue} />
    </Container>
  );
}
