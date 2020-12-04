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

import {
  Container,
  Spacer,
  FlatButton,
  Text,
  Row,
  tokens,
  SegmentedControl,
} from '../components';
import {
  useGetCollectionFields,
  useGetField,
  useGetViewGroups,
  useDeleteGroup,
  useUpdateGroupConfig,
  useCreateGroup,
  useGetGroupsSequenceMax,
} from '../data/store';
import { first } from '../../lib/js_utils/array_utils';
import { isEmpty } from '../../lib/js_utils/lang_utils';
import { FieldID } from '../data/fields';
import { FieldPicker } from './field_picker';
import { GroupID, Group, GroupConfig, GroupOrder } from '../data/groups';

const groupEditIDState = atom<GroupID>({
  key: 'GroupMenuGroupEditID',
  default: '',
});

const GroupMenuContext = createContext({
  viewID: '',
  collectionID: '',
});

interface GroupMenuProps {
  viewID: string;
  collectionID: string;
}

export function GroupMenu(props: GroupMenuProps) {
  const { viewID, collectionID } = props;
  const groups = useGetViewGroups(viewID);

  return (
    <GroupMenuContext.Provider value={{ viewID, collectionID }}>
      <Container flex={1}>
        <ScrollView>
          <Container paddingHorizontal={16}>
            {groups.map((group) => (
              <Fragment key={group.id}>
                <GroupListItem group={group} />
                <Spacer size={24} />
              </Fragment>
            ))}
            <GroupNew />
          </Container>
        </ScrollView>
      </Container>
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
  const updateGroupConfig = useUpdateGroupConfig();
  const [groupConfig, setGroupConfig] = useState<GroupConfig>(group);
  const edit = groupEditID === group.id;

  const handleChangeGroupConfig = useCallback((config: GroupConfig) => {
    setGroupConfig(config);
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
    updateGroupConfig(group.id, groupConfig);
    setGroupEditID('');
  }, [updateGroupConfig, setGroupEditID, group, groupConfig]);

  useEffect(() => {
    setGroupConfig(group);
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
          onChange={handleChangeGroupConfig}
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

  const defaultGroupConfig: GroupConfig = useMemo(() => {
    return {
      fieldID: firstField.id,
      order: 'ascending',
    };
  }, [firstField]);

  const [groupConfig, setGroupConfig] = useState<GroupConfig>(
    defaultGroupConfig,
  );
  const sequenceMax = useGetGroupsSequenceMax(context.viewID);

  const handleClose = useCallback(() => {
    setOpen(false);
    setGroupConfig(defaultGroupConfig);
  }, [defaultGroupConfig]);

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
      <Container
        padding={16}
        borderRadius={tokens.border.radius.default}
        shadow
      >
        <Text weight="bold">New group</Text>
        <Spacer size={16} />
        <GroupEdit groupConfig={groupConfig} onChange={setGroupConfig} />
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
    <FlatButton icon="Plus" onPress={handlePressAddGroup} title="Add group" />
  );
}

interface GroupEditProps {
  groupConfig: GroupConfig;
  onChange: (groupConfig: GroupConfig) => void;
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
    (order: GroupOrder) => {
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
      <SegmentedControl<GroupOrder>
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
