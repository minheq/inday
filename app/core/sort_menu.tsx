import React, {
  useState,
  useCallback,
  useContext,
  Fragment,
  useEffect,
  createContext,
} from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { ScrollView } from 'react-native';

import {
  Container,
  Spacer,
  Button,
  TextInput,
  Picker,
  Option,
  Text,
  Row,
  Pressable,
  tokens,
} from '../components';
import {
  useGetCollectionFields,
  useGetField,
  useGetFieldCallback,
  useGetViewSorts,
  useDeleteSort,
  useUpdateSortConfig,
  useCreateSort,
  useGetSortsSequenceMax,
} from '../data/store';
import { first, isEmpty } from '../../lib/data_structures/arrays';
import { FieldType } from '../data/constants';
import { FieldID } from '../data/fields';
import { FieldPicker } from './field_picker';
import { SortID, Sort, SortConfig } from '../data/sort';

const sortEditIDState = atom<SortID>({
  key: 'SortMenuSortEditID',
  default: '',
});

const SortMenuContext = createContext({
  viewID: '',
  collectionID: '',
});

interface SortMenuProps {
  viewID: string;
  collectionID: string;
}

export function SortMenu(props: SortMenuProps) {
  const { viewID, collectionID } = props;
  const sorts = useGetViewSorts(viewID);

  return (
    <SortMenuContext.Provider value={{ viewID, collectionID }}>
      <Container flex={1}>
        <ScrollView>
          <Container paddingHorizontal={16}>
            {sorts.map((sort) => (
              <Fragment key={sort.id}>
                <SortListItem sort={sort} />
                <Spacer size={24} />
              </Fragment>
            ))}
            <SortNew />
          </Container>
        </ScrollView>
      </Container>
    </SortMenuContext.Provider>
  );
}

interface SortListItemProps {
  sort: Sort;
}

function SortListItem(props: SortListItemProps) {
  const { sort } = props;
  const [sortEditID, setSortEditID] = useRecoilState(sortEditIDState);
  const field = useGetField(sort.fieldID);
  const deleteSort = useDeleteSort();
  const updateSortConfig = useUpdateSortConfig();
  const [sortConfig, setSortConfig] = useState(sort);
  const edit = sortEditID === sort.id;

  const handlePressEdit = useCallback(() => {
    setSortEditID(sort.id);
  }, [setSortEditID, sort]);

  const handlePressCancel = useCallback(() => {
    setSortEditID('');
  }, [setSortEditID]);

  const handlePressRemove = useCallback(() => {
    deleteSort(sort);
    setSortEditID('');
  }, [deleteSort, setSortEditID, sort]);

  const handleSubmit = useCallback(() => {
    updateSortConfig(sort.id, sortConfig);
    setSortEditID('');
  }, [updateSortConfig, setSortEditID, sort, sortConfig]);

  useEffect(() => {
    setSortConfig(sort);
  }, [sortEditID, sort]);

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
        <Text>{sort.rule}</Text>
        <Text>{sort.value}</Text>
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <SortEdit
          onSubmit={handleSubmit}
          sortConfig={sortConfig}
          onChange={handleChangeSortConfig}
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
    <Container padding={16} borderRadius={tokens.radius} shadow>
      {content}
    </Container>
  );
}

function SortNew() {
  const [open, setOpen] = useState(false);
  const sortEditID = useRecoilValue(sortEditIDState);
  const context = useContext(SortMenuContext);

  const fields = useGetCollectionFields(context.collectionID);

  const createSort = useCreateSort();
  const firstField = first(fields);

  if (isEmpty(fields)) {
    throw new Error(
      'Fields are empty. They may not have been loaded properly.',
    );
  }

  const defaultSortConfig = getDefaultSortConfig(firstField);
  const [sortConfig, setSortConfig] = useState(defaultSortConfig);
  const sequenceMax = useGetSortsSequenceMax(context.viewID);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSortConfig(defaultSortConfig);
  }, [defaultSortConfig]);

  const handlePressAddSort = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    handleClose();

    createSort(context.viewID, sequenceMax + 1, sortConfig);
  }, [handleClose, createSort, context, sortConfig, sequenceMax]);

  useEffect(() => {
    if (sortEditID !== '') {
      setOpen(false);
    }
  }, [sortEditID]);

  if (open) {
    return (
      <Container padding={16} borderRadius={tokens.radius} shadow>
        <Text bold>New sort</Text>
        <Spacer size={16} />
        <SortEdit
          onSubmit={handleSubmit}
          sortConfig={sortConfig}
          onChange={setSortConfig}
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
    <Button alignTitle="left" onPress={handlePressAddSort} title="+ Add sort" />
  );
}

interface SortEditProps {
  sortConfig: SortConfig;
  onChange: (sortConfig: SortConfig) => void;
  onSubmit: () => void;
}

function SortEdit(props: SortEditProps) {
  const { sortConfig, onChange, onSubmit } = props;
  const context = useContext(SortMenuContext);
  const field = useGetField(sortConfig.fieldID);
  const fields = useGetCollectionFields(context.collectionID);
  const getField = useGetFieldCallback();

  const handleChangeField = useCallback(
    (fieldID: FieldID) => {
      const newField = getField(fieldID);
      const defaultSortConfig = getDefaultSortConfig(newField);

      onChange({
        ...defaultSortConfig,
        fieldID,
      });
    },
    [getField, onChange],
  );

  const SortConfigEdit = sortConfigEditComponentByFieldType[field.type];

  return (
    <Fragment>
      <FieldPicker
        value={field.id}
        onChange={handleChangeField}
        fields={fields}
      />
      <Spacer size={4} />
      <SortConfigEdit
        onSubmit={onSubmit}
        onChange={onChange}
        sortConfig={sortConfig}
      />
    </Fragment>
  );
}

interface SortRuleInputProps {
  sortConfig: SortConfig;
  onChange: (sortConfig: SortConfig) => void;
  onSubmit: () => void;
}

const sortConfigEditComponentByFieldType: {
  [fieldType in FieldType]: React.ComponentType<SortRuleInputProps>;
} = {
  [FieldType.Checkbox]: TextSortRuleInput,
  [FieldType.Currency]: NumberSortRuleInput,
  [FieldType.Date]: TextSortRuleInput,
  [FieldType.Email]: TextSortRuleInput,
  [FieldType.MultiCollaborator]: TextSortRuleInput,
  [FieldType.MultiDocumentLink]: TextSortRuleInput,
  [FieldType.MultiLineText]: TextSortRuleInput,
  [FieldType.MultiOption]: TextSortRuleInput,
  [FieldType.Number]: NumberSortRuleInput,
  [FieldType.PhoneNumber]: TextSortRuleInput,
  [FieldType.SingleCollaborator]: TextSortRuleInput,
  [FieldType.SingleDocumentLink]: TextSortRuleInput,
  [FieldType.SingleLineText]: TextSortRuleInput,
  [FieldType.SingleOption]: TextSortRuleInput,
  [FieldType.URL]: TextSortRuleInput,
};

function TextSortRuleInput(props: SortRuleInputProps) {
  const { sortConfig, onChange, onSubmit } = props;

  assertTextSortConfig(sortConfig);

  const { rule, value, fieldID } = sortConfig;

  const handleChangeRule = useCallback(
    (newRule: TextSortRule) => {
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

  const options: Option<TextSortRule>[] = [
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

function NumberSortRuleInput(props: SortRuleInputProps) {
  const { sortConfig, onChange, onSubmit } = props;
  assertNumberSortConfig(sortConfig);

  const { rule, value, fieldID } = sortConfig;

  const handleChangeRule = useCallback(
    (newRule: NumberSortRule) => {
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

  const options: Option<NumberSortRule>[] = [
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
