import React, {
  useState,
  useCallback,
  useContext,
  Fragment,
  useEffect,
  createContext,
  useMemo,
} from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { ScrollView, Pressable } from 'react-native';

import { Row } from '../components/row';
import { Spacer } from '../components/spacer';
import { Text } from '../components/text';
import { tokens } from '../components/tokens';
import {
  useGetCollectionFields,
  useGetField,
  useGetViewGroups,
  useDeleteGroup,
  useUpdateGroupSortConfig,
  useCreateGroup,
  useGetGroupsSequenceMax,
} from '../data/store';
import { first } from '../../lib/array_utils';
import { isEmpty } from '../../lib/lang_utils';
import { FieldID } from '../data/fields';
import { FieldPicker } from './field_picker';
import { GroupID, Group } from '../data/groups';
import { SegmentedControl } from '../components/segmented_control';
import { ViewID } from '../data/views';
import { SortConfig, SortOrder } from '../data/sorts';

const groupEditIDState = atom<GroupID>({
  key: 'GroupMenuGroupEditID',
  default: '',
});

const GroupMenuContext = createContext({
  viewID: '',
  collectionID: '',
});

interface GroupMenuProps {
  viewID: ViewID;
  collectionID: string;
}

export function GroupMenu(props: GroupMenuProps): JSX.Element {
  const { viewID, collectionID } = props;
  const groups = useGetViewGroups(viewID);

  return (
    <GroupMenuContext.Provider value={{ viewID, collectionID }}>
      <View flex={1}>
        <ScrollView>
          <View paddingHorizontal={16}>
            {groups.map((group) => (
              <Fragment key={group.id}>
                <GroupListItem group={group} />
                <Spacer size={24} />
              </Fragment>
            ))}
            <GroupNew />
          </View>
        </ScrollView>
      </View>
    </GroupMenuContext.Provider>
  );
}

interface GroupListItemProps {
  group: Group;
}

function GroupListItem(props: GroupListItemProps) {
  const { group } = props;
  const [groupEditID, setGroupEditID] = useRecoilState(groupEditIDState);
  const field = useGetField(group.fieldID);
  const deleteGroup = useDeleteGroup();
  const updateSortConfig = useUpdateGroupSortConfig();
  const [groupConfig, setSortConfig] = useState<SortConfig>(group);
  const edit = groupEditID === group.id;

  const handleChangeSortConfig = useCallback((config: SortConfig) => {
    setSortConfig(config);
  }, []);

  const handlePressEdit = useCallback(() => {
    setGroupEditID(group.id);
  }, [setGroupEditID, group]);

  const handlePressCancel = useCallback(() => {
    setGroupEditID('');
  }, [setGroupEditID]);

  const handlePressRemove = useCallback(() => {
    deleteGroup(group)
      .then(() => {
        setGroupEditID('');
      })
      .catch((e) => {});
  }, [deleteGroup, setGroupEditID, group]);

  const handleSubmit = useCallback(() => {
    updateSortConfig(group.id, groupConfig);
    setGroupEditID('');
  }, [updateSortConfig, setGroupEditID, group, groupConfig]);

  useEffect(() => {
    setSortConfig(group);
  }, [groupEditID, group]);

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
        <Text>{group.order}</Text>
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <GroupEdit
          groupConfig={groupConfig}
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
    <View padding={16} borderRadius={tokens.radius} shadow>
      {content}
    </View>
  );
}

function GroupNew() {
  const [open, setOpen] = useState(false);
  const groupEditID = useRecoilValue(groupEditIDState);
  const context = useContext(GroupMenuContext);

  const fields = useGetCollectionFields(context.collectionID);

  const createGroup = useCreateGroup();
  const firstField = first(fields);

  if (isEmpty(fields)) {
    throw new Error(
      'Fields are empty. They may not have been loaded properly.',
    );
  }

  const defaultSortConfig: SortConfig = useMemo(() => {
    return {
      fieldID: firstField.id,
      order: 'ascending',
    };
  }, [firstField]);

  const [groupConfig, setSortConfig] = useState<SortConfig>(defaultSortConfig);
  const sequenceMax = useGetGroupsSequenceMax(context.viewID);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSortConfig(defaultSortConfig);
  }, [defaultSortConfig]);

  const handlePressAddGroup = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    handleClose();

    createGroup(context.viewID, sequenceMax + 1, groupConfig);
  }, [handleClose, createGroup, context, groupConfig, sequenceMax]);

  useEffect(() => {
    if (groupEditID !== '') {
      setOpen(false);
    }
  }, [groupEditID]);

  if (open) {
    return (
      <View padding={16} borderRadius={tokens.border.radius} shadow>
        <Text weight="bold">New group</Text>
        <Spacer size={16} />
        <GroupEdit groupConfig={groupConfig} onChange={setSortConfig} />
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
      </View>
    );
  }

  return (
    <FlatButton icon="Plus" onPress={handlePressAddGroup} title="Add group" />
  );
}

interface GroupEditProps {
  groupConfig: SortConfig;
  onChange: (groupConfig: SortConfig) => void;
}

function GroupEdit(props: GroupEditProps) {
  const { groupConfig, onChange } = props;
  const context = useContext(GroupMenuContext);
  const field = useGetField(groupConfig.fieldID);
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

  const handleChangeOrder = useCallback(
    (order: SortOrder) => {
      onChange({
        order,
        fieldID: field.id,
      });
    },
    [onChange, field],
  );

  return (
    <Fragment>
      <FieldPicker
        value={field.id}
        onChange={handleChangeField}
        fields={fields}
      />
      <Spacer size={4} />
      <SegmentedControl<SortOrder>
        value={groupConfig.order}
        onChange={handleChangeOrder}
        options={[
          { label: 'Ascending', value: 'ascending' },
          { label: 'Descending', value: 'descending' },
        ]}
      />
    </Fragment>
  );
}
