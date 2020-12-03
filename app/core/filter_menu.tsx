import React, {
  useState,
  useCallback,
  useContext,
  Fragment,
  useEffect,
  createContext,
} from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { Pressable, ScrollView } from 'react-native';

import {
  NumberFieldKindFilterRule,
  TextFieldKindFilterRule,
  getDefaultFilterConfig,
  Filter,
  FilterID,
  FilterConfig,
  assertNumberFilterConfig,
  assertTextFilterConfig,
} from '../data/filters';
import {
  Container,
  Spacer,
  Button,
  TextInput,
  Picker,
  Text,
  Row,
  tokens,
  PickerOption,
} from '../components';
import {
  useCreateFilter,
  useGetCollectionFields,
  useGetViewFilters,
  useDeleteFilter,
  useUpdateFilterConfig,
  useGetField,
  useGetFieldCallback,
  useGetFiltersGroupMax,
  useUpdateFilterGroup,
} from '../data/store';
import { Array } from '../../lib/js_utils';
import { FieldID, FieldType } from '../data/fields';
import { FieldPicker } from './field_picker';

const filterEditIDState = atom<FilterID>({
  key: 'FilterMenuFilterEditID',
  default: '',
});

const FilterMenuContext = createContext({
  viewID: '',
  collectionID: '',
});

interface FilterMenuProps {
  viewID: string;
  collectionID: string;
}

export function FilterMenu(props: FilterMenuProps) {
  const { viewID, collectionID } = props;
  const filters = useGetViewFilters(viewID);

  return (
    <FilterMenuContext.Provider value={{ viewID, collectionID }}>
      <Container flex={1}>
        <ScrollView>
          <Container paddingHorizontal={16}>
            {filters.map((filter, index) => (
              <Fragment key={filter.id}>
                <FilterListItem
                  prevFilter={filters[index - 1] || null}
                  filter={filter}
                />
                <Spacer size={24} />
              </Fragment>
            ))}
            <FilterNew />
          </Container>
        </ScrollView>
      </Container>
    </FilterMenuContext.Provider>
  );
}

interface FilterListItemProps {
  filter: Filter;
  prevFilter: Filter | null;
}

function FilterListItem(props: FilterListItemProps) {
  const { prevFilter, filter } = props;
  const [filterEditID, setFilterEditID] = useRecoilState(filterEditIDState);
  const field = useGetField(filter.fieldID);
  const deleteFilter = useDeleteFilter();
  const updateFilterConfig = useUpdateFilterConfig();
  const updateFilterGroup = useUpdateFilterGroup();
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

  const handlePressRemove = useCallback(() => {
    deleteFilter(filter);
    setFilterEditID('');
  }, [deleteFilter, setFilterEditID, filter]);

  const handleChangeFilterGroup = useCallback(
    (value: 'and' | 'or') => {
      updateFilterGroup(filter.id, value);
    },
    [filter, updateFilterGroup],
  );

  const handleSubmit = useCallback(() => {
    updateFilterConfig(filter.id, filter.group, filterConfig);
    setFilterEditID('');
  }, [updateFilterConfig, setFilterEditID, filter, filterConfig]);

  useEffect(() => {
    setFilterConfig(filter);
  }, [filterEditID, filter]);

  let content: JSX.Element = <Fragment />;

  if (edit === false) {
    content = (
      <Fragment>
        <Row justifyContent="flex-end">
          <Pressable onPress={handlePressEdit}>
            <Text color="primary">Edit</Text>
          </Pressable>
        </Row>
        <Text>{field.name}</Text>
        <Text>{filter.rule}</Text>
        <Text>{filter.value}</Text>
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <FilterEdit
          onSubmit={handleSubmit}
          filterConfig={filterConfig}
          onChange={handleChangeFilterConfig}
        />
        <Spacer size={16} />
        <Row justifyContent="space-between">
          <Pressable onPress={handlePressRemove}>
            <Text color="error">Remove</Text>
          </Pressable>
          <Row>
            <Pressable onPress={handlePressCancel}>
              <Text>Cancel</Text>
            </Pressable>
            <Spacer size={16} />
            <Pressable onPress={handleSubmit}>
              <Text color="primary">Done</Text>
            </Pressable>
          </Row>
        </Row>
      </Fragment>
    );
  }

  return (
    <Container>
      {prevFilter !== null && (
        <Fragment>
          <Spacer size={16} />
          <Picker
            value={prevFilter.group === filter.group ? 'and' : 'or'}
            onChange={handleChangeFilterGroup}
            options={[
              { label: 'And', value: 'and' },
              { label: 'Or', value: 'or' },
            ]}
          />
          <Spacer size={16} />
        </Fragment>
      )}
      <Container padding={16} borderRadius={tokens.radius} shadow>
        {content}
      </Container>
    </Container>
  );
}

function FilterNew() {
  const [open, setOpen] = useState(false);
  const filterEditID = useRecoilValue(filterEditIDState);
  const context = useContext(FilterMenuContext);

  const fields = useGetCollectionFields(context.collectionID);

  const createFilter = useCreateFilter();
  const firstField = Array.first(fields);

  if (Array.isEmpty(fields)) {
    throw new Error(
      'Fields are empty. They may not have been loaded properly.',
    );
  }

  const defaultFilterConfig = getDefaultFilterConfig(firstField);
  const [filterConfig, setFilterConfig] = useState(defaultFilterConfig);
  const groupMax = useGetFiltersGroupMax(context.viewID);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFilterConfig(defaultFilterConfig);
  }, [defaultFilterConfig]);

  const handlePressAddFilter = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    handleClose();

    createFilter(context.viewID, groupMax + 1, filterConfig);
  }, [handleClose, createFilter, context, filterConfig, groupMax]);

  useEffect(() => {
    if (filterEditID !== '') {
      setOpen(false);
    }
  }, [filterEditID]);

  if (open) {
    return (
      <Container padding={16} borderRadius={tokens.radius} shadow>
        <Text bold>New filter</Text>
        <Spacer size={16} />
        <FilterEdit
          onSubmit={handleSubmit}
          filterConfig={filterConfig}
          onChange={setFilterConfig}
        />
        <Spacer size={16} />
        <Row justifyContent="flex-end">
          <Pressable onPress={handleClose}>
            <Text>Cancel</Text>
          </Pressable>
          <Spacer size={16} />
          <Pressable onPress={handleSubmit}>
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
  onSubmit: () => void;
}

function FilterEdit(props: FilterEditProps) {
  const { filterConfig, onChange, onSubmit } = props;
  const context = useContext(FilterMenuContext);
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
    <Fragment>
      <FieldPicker
        value={field.id}
        onChange={handleChangeField}
        fields={fields}
      />
      <Spacer size={4} />
      <FilterConfigEdit
        onSubmit={onSubmit}
        onChange={onChange}
        filterConfig={filterConfig}
      />
    </Fragment>
  );
}

interface FilterRuleInputProps {
  filterConfig: FilterConfig;
  onChange: (filterConfig: FilterConfig) => void;
  onSubmit: () => void;
}

const filterConfigEditComponentByFieldType: {
  [fieldType in FieldType]: React.ComponentType<FilterRuleInputProps>;
} = {
  [FieldType.Checkbox]: TextFilterRuleInput,
  [FieldType.Currency]: NumberFilterRuleInput,
  [FieldType.Date]: TextFilterRuleInput,
  [FieldType.Email]: TextFilterRuleInput,
  [FieldType.MultiCollaborator]: TextFilterRuleInput,
  [FieldType.MultiRecordLink]: TextFilterRuleInput,
  [FieldType.MultiLineText]: TextFilterRuleInput,
  [FieldType.MultiOption]: TextFilterRuleInput,
  [FieldType.Number]: NumberFilterRuleInput,
  [FieldType.PhoneNumber]: TextFilterRuleInput,
  [FieldType.SingleCollaborator]: TextFilterRuleInput,
  [FieldType.SingleRecordLink]: TextFilterRuleInput,
  [FieldType.SingleLineText]: TextFilterRuleInput,
  [FieldType.SingleOption]: TextFilterRuleInput,
  [FieldType.URL]: TextFilterRuleInput,
};

function TextFilterRuleInput(props: FilterRuleInputProps) {
  const { filterConfig, onChange, onSubmit } = props;

  assertTextFilterConfig(filterConfig);

  const { rule, value, fieldID } = filterConfig;

  const handleChangeRule = useCallback(
    (newRule: TextFieldKindFilterRule) => {
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

  const options: Option<TextFieldKindFilterRule>[] = [
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
      <TextInput
        onSubmitEditing={onSubmit}
        value={value}
        onChange={handleChangeValue}
      />
    </Container>
  );
}

function NumberFilterRuleInput(props: FilterRuleInputProps) {
  const { filterConfig, onChange, onSubmit } = props;
  assertNumberFilterConfig(filterConfig);

  const { rule, value, fieldID } = filterConfig;

  const handleChangeRule = useCallback(
    (newRule: NumberFieldKindFilterRule) => {
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

  const options: PickerOption<NumberFieldKindFilterRule>[] = [
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
      <TextInput
        onSubmitEditing={onSubmit}
        value={value ? `${value}` : ''}
        onChange={handleChangeValue}
      />
    </Container>
  );
}
