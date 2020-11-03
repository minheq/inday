import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Container, Pressable, Text, useTheme } from '../components';
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
  GridRef,
  RenderCellProps,
  RenderHeaderCellProps,
  RenderHeaderProps,
  RenderRowProps,
} from './grid';
import { format } from 'date-fns';
import { Record, RecordID } from '../data/records';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import {
  NavigationKey,
  KeyBinding,
  useKeyboard,
  WhiteSpaceKey,
  UIKey,
} from '../lib/keyboard';

interface FocusedCell {
  row: number;
  column: number;
  editing: boolean;
}

const focusedCellState = atom<FocusedCell | null>({
  key: 'ListViewDisplay_FocusedCell',
  default: null,
});

interface ListViewDisplayProps {
  view: ListView;
  onOpenRecord: (recordID: RecordID) => void;
}

const FIELD_ROW_HEIGHT = 40;
const RECORD_ROW_HEIGHT = 40;

export function ListViewDisplay(props: ListViewDisplayProps) {
  const { view, onOpenRecord } = props;
  const [focusedCell, setFocusedCell] = useRecoilState(focusedCellState);
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);
  const gridRef = useRef<GridRef>(null);

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
  const columnToFieldMap = useMemo(() => {
    const map: {
      [column: number]: FieldID | undefined;
    } = {};

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      map[i + 1] = field.id;
    }

    return map;
  }, [fields]);
  const rowToRecordMap = useMemo(() => {
    const map: {
      [row: number]: RecordID;
    } = {};

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      map[i + 1] = record.id;
    }

    return map;
  }, [records]);
  const selectedRows = useMemo(() => {
    return [].map((recordID) => recordToRowMap[recordID]);
  }, [recordToRowMap]);

  const contentOffset = useMemo(() => {
    return { x: 0, y: 0 };
  }, []);

  const focusedCellKeyBindings = useMemo(() => {
    if (focusedCell === null || focusedCell.editing === true) {
      return [];
    }

    const keyBindings: KeyBinding[] = [
      {
        key: NavigationKey.ArrowDown,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { row, column } = focusedCell;

            const nextRow = row + 1;
            if (rowToRecordMap[nextRow] === undefined) {
              return;
            }

            setFocusedCell({
              row: nextRow,
              column,
              editing: false,
            });

            gridRef.current.scrollToCell({ row: nextRow });
          }
        },
      },
      {
        key: NavigationKey.ArrowUp,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { row, column } = focusedCell;

            const prevRow = row - 1;
            if (rowToRecordMap[prevRow] === undefined) {
              return;
            }

            setFocusedCell({
              row: prevRow,
              column,
              editing: false,
            });

            gridRef.current.scrollToCell({ row: prevRow });
          }
        },
      },
      {
        key: NavigationKey.ArrowLeft,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { row, column } = focusedCell;
            const prevColumn = column - 1;
            if (columnToFieldMap[prevColumn] === undefined) {
              return;
            }

            setFocusedCell({
              row,
              column: prevColumn,
              editing: false,
            });

            gridRef.current.scrollToCell({ column: prevColumn });
          }
        },
      },
      {
        key: NavigationKey.ArrowRight,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { row, column } = focusedCell;

            const nextColumn = column + 1;
            if (columnToFieldMap[nextColumn] === undefined) {
              return;
            }

            setFocusedCell({
              row,
              column: nextColumn,
              editing: false,
            });

            gridRef.current.scrollToCell({ column: nextColumn });
          }
        },
      },
      {
        key: NavigationKey.ArrowDown,
        meta: true,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { column } = focusedCell;

            const nextRow = records.length;

            setFocusedCell({
              row: nextRow,
              column,
              editing: false,
            });

            gridRef.current.scrollToCell({ row: nextRow });
          }
        },
      },
      {
        key: NavigationKey.ArrowUp,
        meta: true,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { column } = focusedCell;

            const prevRow = 1;

            setFocusedCell({
              row: prevRow,
              column,
              editing: false,
            });

            gridRef.current.scrollToCell({ row: prevRow });
          }
        },
      },
      {
        key: NavigationKey.ArrowLeft,
        meta: true,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { row } = focusedCell;

            const prevColumn = 1;

            setFocusedCell({
              row,
              column: prevColumn,
              editing: false,
            });

            gridRef.current.scrollToCell({ column: prevColumn });
          }
        },
      },
      {
        key: NavigationKey.ArrowRight,
        meta: true,
        handler: () => {
          if (focusedCell !== null && gridRef.current !== null) {
            const { row } = focusedCell;

            const nextColumn = fields.length;

            setFocusedCell({
              row,
              column: nextColumn,
              editing: false,
            });

            gridRef.current.scrollToCell({ column: nextColumn });
          }
        },
      },
      {
        key: UIKey.Escape,
        handler: () => {
          if (focusedCell !== null) {
            setFocusedCell(null);
          }
        },
      },
      {
        key: WhiteSpaceKey.Enter,
        handler: () => {
          if (focusedCell !== null) {
            setFocusedCell({
              row: focusedCell.row,
              column: focusedCell.column,
              editing: true,
            });
          }
        },
      },
      {
        key: WhiteSpaceKey.Space,
        handler: () => {
          if (focusedCell !== null) {
            onOpenRecord(rowToRecordMap[focusedCell.row]);
          }
        },
      },
    ];

    return keyBindings;
  }, [
    focusedCell,
    setFocusedCell,
    rowToRecordMap,
    columnToFieldMap,
    records,
    fields,
    onOpenRecord,
  ]);

  useKeyboard(focusedCellKeyBindings);

  const { fixedFieldCount } = view;

  const renderCell = useCallback(
    ({ row, column, focused, editing }: RenderCellProps) => {
      const field = fields[column - 1];
      const record = records[row - 1];
      const value = record.fields[field.id];
      const primary = column === 1;

      return (
        <Cell
          focused={focused}
          editing={editing}
          record={record}
          field={field}
          value={value}
          primary={primary}
          row={row}
          column={column}
        />
      );
    },
    [fields, records],
  );

  const renderRow = useCallback(({ selected, children }: RenderRowProps) => {
    return <Row selected={selected}>{children}</Row>;
  }, []);

  const renderHeader = useCallback(({ children }: RenderHeaderProps) => {
    return <Header>{children}</Header>;
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
            ref={gridRef}
            width={width}
            height={height}
            contentOffset={contentOffset}
            rowCount={rowCount}
            renderCell={renderCell}
            renderHeader={renderHeader}
            renderHeaderCell={renderHeaderCell}
            rowHeight={RECORD_ROW_HEIGHT}
            headerHeight={FIELD_ROW_HEIGHT}
            columns={columns}
            fixedColumnCount={fixedFieldCount}
            focusedCell={focusedCell}
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

interface HeaderProps {
  children: React.ReactNode;
}

function Header(props: HeaderProps) {
  const { children } = props;

  return <View style={[styles.row]}>{children}</View>;
}

interface CellProps {
  field: Field;
  value: FieldValue;
  record: Record;
  focused: boolean;
  editing: boolean;
  primary: boolean;
  row: number;
  column: number;
}

function Cell(props: CellProps) {
  const { field, value, focused, row, column } = props;
  const theme = useTheme();
  const setFocusedCell = useSetRecoilState(focusedCellState);

  const handlePress = useCallback(() => {
    if (focused) {
      setFocusedCell({ row, column, editing: true });
    } else {
      setFocusedCell({ row, column, editing: false });
    }
  }, [setFocusedCell, focused, row, column]);

  const renderer = rendererByFieldType[field.type];

  return (
    <Pressable
      style={[{ borderColor: theme.border.color.default }, styles.cell]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.cellWrapper,
          focused && { borderColor: theme.border.color.focus },
        ]}
      >
        {renderer({ field, value })}
      </View>
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
    width: '100%',
    height: '100%',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'auto',
        outlineStyle: 'none',
      },
    }),
  },
  row: {
    width: '100%',
    height: '100%',
  },
  cellWrapper: {
    paddingHorizontal: 6, // Padding + border should equal to 8
    width: '100%',
    height: '100%',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
