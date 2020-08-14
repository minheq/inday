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
  Text,
  Row,
  Pressable,
  tokens,
  SegmentedControl,
} from '../components';
import {
  useGetCollectionFields,
  useGetField,
  useGetViewSorts,
  useDeleteSort,
  useUpdateSortConfig,
  useCreateSort,
  useGetSortsSequenceMax,
} from '../data/store';
import { first, isEmpty } from '../../lib/data_structures/arrays';
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
  const [sortConfig, setSortConfig] = useState<SortConfig>(sort);
  const edit = sortEditID === sort.id;

  const handleChangeSortConfig = useCallback((config: SortConfig) => {
    setSortConfig(config);
  }, []);

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
        <Text>{sort.order}</Text>
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <SortEdit sortConfig={sortConfig} onChange={handleChangeSortConfig} />
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

  const defaultSortConfig: SortConfig = {
    fieldID: firstField.id,
    order: 'ascending',
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSortConfig);
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
        <SortEdit sortConfig={sortConfig} onChange={setSortConfig} />
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
}

function SortEdit(props: SortEditProps) {
  const { sortConfig, onChange } = props;
  const context = useContext(SortMenuContext);
  const field = useGetField(sortConfig.fieldID);
  const fields = useGetCollectionFields(context.collectionID);

  const handleChangeField = useCallback(
    (fieldID: FieldID) => {
      onChange({
        order: 'ascending',
        fieldID,
      });
    },
    [onChange],
  );

  return (
    <Fragment>
      <FieldPicker
        value={field.id}
        onChange={handleChangeField}
        fields={fields}
      />
      <Spacer size={4} />
      <SegmentedControl
        options={[
          { label: 'Ascending', value: 'ascending' },
          { label: 'Descending', value: 'descending' },
        ]}
      />
    </Fragment>
  );
}
