import React, {
  useState,
  useCallback,
  useContext,
  Fragment,
  useEffect,
  createContext,
  useMemo,
} from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { ScrollView } from "react-native";

import { Button } from "../../components/button";
import { Row } from "../../components/row";
import { Spacer } from "../../components/spacer";
import { Text } from "../../components/text";
import { tokens } from "../../components/tokens";
import {
  useCollectionFieldsQuery,
  useFieldQuery,
  useViewSortsQuery,
  useSortsSequenceMaxQuery,
} from "../../store/queries";
import {
  useUpdateSortConfigMutation,
  useDeleteSortMutation,
  useCreateSortMutation,
} from "../../store/mutations";
import { first } from "../../../lib/array_utils";
import { isEmpty } from "../../../lib/lang_utils";
import { FieldID } from "../../../models/fields";
import { FieldPicker } from "../fields/field_picker";
import { SortID, Sort, SortConfig, SortOrder } from "../../../models/sorts";
import { SegmentedControl } from "../../components/segmented_control";
import { Pressable } from "../../components/pressable";

const sortEditIDState = atom<SortID>({
  key: "SortMenuSortEditID",
  default: "",
});

const SortMenuContext = createContext({
  viewID: "",
  collectionID: "",
});

interface SortMenuProps {
  viewID: string;
  collectionID: string;
}

export function SortMenu(props: SortMenuProps): JSX.Element {
  const { viewID, collectionID } = props;
  const sorts = useViewSortsQuery(viewID);

  return (
    <SortMenuContext.Provider value={{ viewID, collectionID }}>
      <View flex={1}>
        <ScrollView>
          <View paddingHorizontal={16}>
            {sorts.map((sort) => (
              <Fragment key={sort.id}>
                <SortListItem sort={sort} />
                <Spacer size={24} />
              </Fragment>
            ))}
            <SortNew />
          </View>
        </ScrollView>
      </View>
    </SortMenuContext.Provider>
  );
}

interface SortListItemProps {
  sort: Sort;
}

function SortListItem(props: SortListItemProps) {
  const { sort } = props;
  const [sortEditID, setSortEditID] = useRecoilState(sortEditIDState);
  const field = useFieldQuery(sort.fieldID);
  const deleteSort = useDeleteSortMutation();
  const updateSortConfig = useUpdateSortConfigMutation();
  const [sortConfig, setSortConfig] = useState<SortConfig>(sort);
  const edit = sortEditID === sort.id;

  const handleChangeSortConfig = useCallback((config: SortConfig) => {
    setSortConfig(config);
  }, []);

  const handlePressEdit = useCallback(() => {
    setSortEditID(sort.id);
  }, [setSortEditID, sort]);

  const handlePressCancel = useCallback(() => {
    setSortEditID("");
  }, [setSortEditID]);

  const handlePressRemove = useCallback(() => {
    deleteSort(sort);
    setSortEditID("");
  }, [deleteSort, setSortEditID, sort]);

  const handleSubmit = useCallback(() => {
    updateSortConfig(sort.id, sortConfig);
    setSortEditID("");
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
    <View padding={16} borderRadius={tokens.radius} shadow>
      {content}
    </View>
  );
}

function SortNew() {
  const [open, setOpen] = useState(false);
  const sortEditID = useRecoilValue(sortEditIDState);
  const context = useContext(SortMenuContext);

  const fields = useCollectionFieldsQuery(context.collectionID);

  const createSort = useCreateSortMutation();
  const firstField = first(fields);

  if (isEmpty(fields)) {
    throw new Error(
      "Fields are empty. They may not have been loaded properly."
    );
  }

  const defaultSortConfig = useMemo(
    (): SortConfig => ({
      fieldID: firstField.id,
      order: "ascending",
    }),
    [firstField]
  );

  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSortConfig);
  const sequenceMax = useSortsSequenceMaxQuery(context.viewID);

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
    if (sortEditID !== "") {
      setOpen(false);
    }
  }, [sortEditID]);

  if (open) {
    return (
      <View padding={16} borderRadius={tokens.radius} shadow>
        <Text weight="bold">New sort</Text>
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
      </View>
    );
  }

  return <Button onPress={handlePressAddSort} title="+ Add sort" />;
}

interface SortEditProps {
  sortConfig: SortConfig;
  onChange: (sortConfig: SortConfig) => void;
}

function SortEdit(props: SortEditProps) {
  const { sortConfig, onChange } = props;
  const context = useContext(SortMenuContext);
  const field = useFieldQuery(sortConfig.fieldID);
  const fields = useCollectionFieldsQuery(context.collectionID);

  const handleChangeField = useCallback(
    (fieldID: FieldID) => {
      onChange({
        order: "ascending",
        fieldID,
      });
    },
    [onChange]
  );

  const handleChangeOrder = useCallback(
    (order: SortOrder) => {
      onChange({
        order,
        fieldID: field.id,
      });
    },
    [onChange, field]
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
        value={sortConfig.order}
        onChange={handleChangeOrder}
        options={[
          { label: "Ascending", value: "ascending" },
          { label: "Descending", value: "descending" },
        ]}
      />
    </Fragment>
  );
}
