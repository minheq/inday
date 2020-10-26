import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Container, Pressable, Text, useTheme } from '../components';
import {
  useGetViewRecords,
  useGetSortedFieldsWithListViewConfig,
} from '../data/store';
import {
  FieldType,
  CheckboxField,
  CurrencyField,
  DateField,
  EmailField,
  MultiCollaboratorField,
  MultiRecordLinkField,
  MultiLineTextField,
  MultiOptionField,
  NumberField,
  PhoneNumberField,
  SingleCollaboratorField,
  SingleRecordLinkField,
  SingleLineTextField,
  SingleOptionField,
  URLField,
  Field,
  assertCheckboxField,
  assertCurrencyField,
  assertDateField,
  assertEmailField,
  assertMultiCollaboratorField,
  assertMultiRecordLinkField,
  assertMultiLineTextField,
  assertMultiOptionField,
  assertNumberField,
  assertPhoneNumberField,
  assertSingleCollaboratorField,
  assertSingleRecordLinkField,
  assertSingleLineTextField,
  assertSingleOptionField,
  assertURLField,
  CheckboxFieldValue,
  CurrencyFieldValue,
  DateFieldValue,
  EmailFieldValue,
  MultiCollaboratorFieldValue,
  MultiRecordLinkFieldValue,
  MultiLineTextFieldValue,
  MultiOptionFieldValue,
  NumberFieldValue,
  PhoneNumberFieldValue,
  SingleCollaboratorFieldValue,
  SingleRecordLinkFieldValue,
  SingleLineTextFieldValue,
  SingleOptionFieldValue,
  URLFieldValue,
  FieldValue,
  assertDateFieldValue,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiRecordLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleRecordLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
  FieldID,
} from '../data/fields';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { ListView } from '../data/views';
import {
  Grid,
  RenderCellProps,
  RenderHeaderCellProps,
  RenderRowProps,
} from './grid';
import { format } from 'date-fns';
import { Record, RecordID } from '../data/records';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

interface ListViewDisplayState {
  focusedCell: {
    recordID: RecordID;
    fieldID: FieldID;
    editing: boolean;
  } | null;
  selectedRecordIDs: RecordID[];
}

const listViewDisplayState = atom<ListViewDisplayState>({
  key: 'ListViewDisplay',
  default: {
    focusedCell: null,
    selectedRecordIDs: [],
  },
});

interface ListViewDisplayProps {
  view: ListView;
}

const FIELD_ROW_HEIGHT = 40;
const RECORD_ROW_HEIGHT = 40;

export function ListViewDisplay(props: ListViewDisplayProps) {
  const { view } = props;
  const { focusedCell, selectedRecordIDs } = useRecoilValue(
    listViewDisplayState,
  );
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);

  const recordToRowMap = useMemo(() => {
    const map: {
      [recordID: string]: number;
    } = {};

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      map[record.id] = i + 1;
    }

    return map;
  }, [records]);
  const fieldToColumnMap = useMemo(() => {
    const map: {
      [fieldID: string]: number;
    } = {};

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      map[field.id] = i + 1;
    }

    return map;
  }, [fields]);
  const gridFocusedCell = useMemo(() => {
    if (focusedCell === undefined || focusedCell === null) {
      return focusedCell;
    }

    return {
      row: recordToRowMap[focusedCell.recordID],
      column: fieldToColumnMap[focusedCell.fieldID],
      editing: focusedCell.editing,
    };
  }, [focusedCell, recordToRowMap, fieldToColumnMap]);
  const selectedRows = useMemo(() => {
    return selectedRecordIDs.map((recordID) => recordToRowMap[recordID]);
  }, [recordToRowMap, selectedRecordIDs]);

  const contentOffset = useMemo(() => {
    return { x: 0, y: 0 };
  }, []);

  const { fixedFieldCount } = view;

  const renderCell = useCallback(
    ({ row, column, focused, editing }: RenderCellProps) => {
      const field = fields[column - 1];
      const record = records[row - 1];
      const value = record.fields[field.id];

      return (
        <Cell
          focused={focused}
          editing={editing}
          record={record}
          field={field}
          value={value}
        />
      );
    },
    [fields, records],
  );

  const renderRow = useCallback(({ selected, children }: RenderRowProps) => {
    return <Row selected={selected}>{children}</Row>;
  }, []);

  const renderHeaderCell = useCallback(
    ({ column }: RenderHeaderCellProps) => {
      const field = fields[column - 1];

      return <HeaderCell field={field} />;
    },
    [fields],
  );

  const columns = useMemo(() => fields.map((field) => field.config.width), [
    fields,
  ]);
  const rowCount = records.length;

  return (
    <Container flex={1}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            scrollViewWidth={width}
            scrollViewHeight={height}
            contentOffset={contentOffset}
            rowCount={rowCount}
            renderCell={renderCell}
            renderHeaderCell={renderHeaderCell}
            rowHeight={RECORD_ROW_HEIGHT}
            headerHeight={FIELD_ROW_HEIGHT}
            columns={columns}
            fixedColumnCount={fixedFieldCount}
            focusedCell={gridFocusedCell}
            selectedRows={selectedRows}
            renderRow={renderRow}
          />
        )}
      </AutoSizer>
    </Container>
  );
}

interface RowProps {
  selected: boolean;
  children: React.ReactNode;
}

function Row(props: RowProps) {
  const { selected, children } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: selected
            ? theme.container.color.tint
            : theme.container.color.content,
        },
      ]}
    >
      {children}
    </View>
  );
}

interface CellProps {
  field: Field;
  value: FieldValue;
  record: Record;
  focused: boolean;
  editing: boolean;
}

function Cell(props: CellProps) {
  const { record, field, value, focused, editing } = props;
  const theme = useTheme();
  const setState = useSetRecoilState(listViewDisplayState);

  const handlePress = useCallback(() => {
    if (focused) {
      setState({
        focusedCell: { recordID: record.id, fieldID: field.id, editing: false },
        selectedRecordIDs: [record.id],
      });
    } else {
      setState({
        focusedCell: { recordID: record.id, fieldID: field.id, editing: true },
        selectedRecordIDs: [record.id],
      });
    }
  }, [setState, focused, record, field]);

  const renderer = rendererByFieldType[field.type];

  return (
    <Pressable
      style={[
        {
          borderColor: focused
            ? theme.border.color.focus
            : theme.border.color.default,
        },
        styles.cell,
        focused && styles.selected,
      ]}
      onPress={handlePress}
    >
      {renderer({ field, value })}
    </Pressable>
  );
}

interface HeaderCellProps {
  field: Field;
}

function HeaderCell(props: HeaderCellProps) {
  const { field } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.container.color.content,
          borderColor: theme.border.color.default,
        },
        styles.cell,
      ]}
    >
      <Text>{field.name}</Text>
    </View>
  );
}

const rendererByFieldType: {
  [fieldType in FieldType]: (props: {
    field: Field;
    value: FieldValue;
  }) => React.ReactNode;
} = {
  [FieldType.Checkbox]: ({ field, value }) => {
    assertCheckboxFieldValue(value);
    assertCheckboxField(field);

    return <CheckboxCell field={field} value={value} />;
  },
  [FieldType.Currency]: ({ field, value }) => {
    assertCurrencyFieldValue(value);
    assertCurrencyField(field);

    return <CurrencyCell field={field} value={value} />;
  },
  [FieldType.Date]: ({ field, value }) => {
    assertDateFieldValue(value);
    assertDateField(field);

    return <DateCell field={field} value={value} />;
  },
  [FieldType.Email]: ({ field, value }) => {
    assertEmailFieldValue(value);
    assertEmailField(field);

    return <EmailCell field={field} value={value} />;
  },
  [FieldType.MultiCollaborator]: ({ field, value }) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorField(field);

    return <MultiCollaboratorCell field={field} value={value} />;
  },
  [FieldType.MultiRecordLink]: ({ field, value }) => {
    assertMultiRecordLinkFieldValue(value);
    assertMultiRecordLinkField(field);

    return <MultiRecordLinkCell field={field} value={value} />;
  },
  [FieldType.MultiLineText]: ({ field, value }) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextField(field);

    return <MultiLineTextCell field={field} value={value} />;
  },
  [FieldType.MultiOption]: ({ field, value }) => {
    assertMultiOptionFieldValue(value);
    assertMultiOptionField(field);

    return <MultiOptionCell field={field} value={value} />;
  },
  [FieldType.Number]: ({ field, value }) => {
    assertNumberFieldValue(value);
    assertNumberField(field);

    return <NumberCell field={field} value={value} />;
  },
  [FieldType.PhoneNumber]: ({ field, value }) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberField(field);

    return <PhoneNumberCell field={field} value={value} />;
  },
  [FieldType.SingleCollaborator]: ({ field, value }) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorField(field);

    return <SingleCollaboratorCell field={field} value={value} />;
  },
  [FieldType.SingleRecordLink]: ({ field, value }) => {
    assertSingleRecordLinkFieldValue(value);
    assertSingleRecordLinkField(field);

    return <SingleRecordLinkCell field={field} value={value} />;
  },
  [FieldType.SingleLineText]: ({ field, value }) => {
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextField(field);

    return <SingleLineTextCell field={field} value={value} />;
  },
  [FieldType.SingleOption]: ({ field, value }) => {
    assertSingleOptionFieldValue(value);
    assertSingleOptionField(field);

    return <SingleOptionCell field={field} value={value} />;
  },
  [FieldType.URL]: ({ field, value }) => {
    assertURLFieldValue(value);
    assertURLField(field);

    return <URLCell field={field} value={value} />;
  },
};

interface CheckboxCellProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
}

function CheckboxCell(props: CheckboxCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value ? 'checked' : 'unchecked'}</Text>;
}

interface CurrencyCellProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
}

function CurrencyCell(props: CurrencyCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
}

function DateCell(props: DateCellProps) {
  const { value } = props;

  if (value === null) {
    return <Text numberOfLines={1}>No date</Text>;
  }

  return <Text numberOfLines={1}>{format(value, 'dd-MM-yyyy')}</Text>;
}
interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

function EmailCell(props: EmailCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

function MultiCollaboratorCell(props: MultiCollaboratorCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value[0]}</Text>;
}
interface MultiRecordLinkCellProps {
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
}

function MultiRecordLinkCell(props: MultiRecordLinkCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value[0]}</Text>;
}
interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

function MultiLineTextCell(props: MultiLineTextCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
interface MultiOptionCellProps {
  value: MultiOptionFieldValue;
  field: MultiOptionField;
}

function MultiOptionCell(props: MultiOptionCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value[0]}</Text>;
}
interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

function NumberCell(props: NumberCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

function PhoneNumberCell(props: PhoneNumberCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

function SingleCollaboratorCell(props: SingleCollaboratorCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
}

function SingleRecordLinkCell(props: SingleRecordLinkCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}
interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

function SingleLineTextCell(props: SingleLineTextCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

function SingleOptionCell(props: SingleOptionCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

function URLCell(props: URLCellProps) {
  const { value } = props;

  return <Text numberOfLines={1}>{value}</Text>;
}

const styles = StyleSheet.create({
  cell: {
    paddingHorizontal: 8,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  firstColumnCell: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    height: '100%',
  },
  selectCheckbox: {
    width: 40,
    height: RECORD_ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    // borderRightWidth: 2,
    // borderBottomWidth: 2,
    // borderTopWidth: 2,
    // borderLeftWidth: 2,
  },
});
