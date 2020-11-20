import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { View, Pressable, Platform, TextInput } from 'react-native';
import {
  Button,
  Container,
  Icon,
  Row,
  Spacer,
  Text,
  tokens,
} from '../components';
import {
  useGetViewRecords,
  useGetSortedFieldsWithListViewConfig,
  useGetCollaboratorsByID,
  useGetCollectionRecordsByID,
  useGetCollection,
  useUpdateRecordField,
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
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
} from './grid';
import { Record, RecordID } from '../data/records';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import {
  NavigationKey,
  KeyBinding,
  useKeyboard,
  WhiteSpaceKey,
  UIKey,
} from '../lib/keyboard';
import { StatefulLeafRowCell } from './grid.common';
import { DynamicStyleSheet } from '../components/stylesheet';
import { getFieldIcon } from './icon_helpers';
import { formatCurrency } from '../../lib/i18n';
import { isNullish } from '../../lib/js_utils';
import { getSystemLocale } from '../lib/locale';
import { palette } from '../components/palette';
import { formatDate } from '../../lib/datetime/format';
import { OptionBadge } from './option_badge';
import { CollaboratorBadge } from './collaborator_badge';
import { RecordLinkBadge } from './record_link_badge';
import { formatUnit } from '../../lib/i18n/unit';

const cellState = atom<StatefulLeafRowCell | null>({
  key: 'ListViewDisplay_Cell',
  default: null,
});

interface ListViewDisplayProps {
  view: ListView;
  onOpenRecord: (recordID: RecordID) => void;
}

const FIELD_ROW_HEIGHT = 40;
const RECORD_ROW_HEIGHT = 40;
const FOCUS_BORDER_WIDTH = 3;

export function ListViewDisplay(props: ListViewDisplayProps): JSX.Element {
  const { view, onOpenRecord } = props;
  const [cell, setCell] = useRecoilState(cellState);
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);
  const gridRef = useRef<GridRef>(null);

  const columnToFieldCache = useMemo(() => {
    const cache: {
      [column: number]: FieldID;
    } = {};

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      cache[i + 1] = field.id;
    }

    return cache;
  }, [fields]);
  const rowToRecordCache = useMemo(() => {
    const cache: {
      [row: number]: RecordID;
    } = {};

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      cache[i + 1] = record.id;
    }

    return cache;
  }, [records]);

  useCellKeyBindings({
    rowToRecordCache,
    records,
    cell,
    columnToFieldCache,
    setCell,
    onOpenRecord,
    gridRef,
    fields,
  });

  const contentOffset = useMemo(() => {
    return { x: 0, y: 0 };
  }, []);

  const { fixedFieldCount } = view;

  const renderLeafRowCell = useCallback(
    ({ row, column, path, state }: RenderLeafRowCellProps) => {
      const field = fields[column - 1];
      const record = records[row - 1];
      const value = record.fields[field.id];
      const primary = column === 1;
      const width = field.config.width;
      const height = FIELD_ROW_HEIGHT;

      return (
        <LeafRowCell
          state={state}
          path={path}
          record={record}
          field={field}
          value={value}
          primary={primary}
          row={row}
          column={column}
          width={width}
          height={height}
        />
      );
    },
    [fields, records],
  );

  const renderHeaderCell = useCallback(
    ({ column }: RenderHeaderCellProps) => {
      const field = fields[column - 1];
      const primary = column === 1;

      return <HeaderCell field={field} primary={primary} />;
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
            groups={[{ type: 'leaf', rowCount, collapsed: false }]}
            renderLeafRowCell={renderLeafRowCell}
            renderHeaderCell={renderHeaderCell}
            leafRowHeight={RECORD_ROW_HEIGHT}
            headerHeight={FIELD_ROW_HEIGHT}
            columns={columns}
            fixedColumnCount={fixedFieldCount}
            cell={cell}
          />
        )}
      </AutoSizer>
    </Container>
  );
}

interface LeafRowCellProps extends RenderLeafRowCellProps {
  field: Field;
  value: FieldValue;
  record: Record;
  primary: boolean;
  width: number;
  height: number;
}

function LeafRowCell(props: LeafRowCellProps) {
  const {
    field,
    value,
    path,
    state,
    row,
    column,
    primary,
    width,
    height,
    record,
  } = props;
  const setCell = useSetRecoilState(cellState);

  const handlePress = useCallback(() => {
    if (state === 'default') {
      setCell({ type: 'leaf', row, path, column, state: 'focused' });
    }
  }, [setCell, state, row, column, path]);

  const renderCell = useCallback(() => {
    const focused = state === 'focused';

    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return (
          <CheckboxCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return (
          <CurrencyCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.Date:
        assertDateFieldValue(value);
        return (
          <DateCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.Email:
        assertEmailFieldValue(value);
        return (
          <EmailCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return (
          <MultiCollaboratorCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiRecordLink:
        assertMultiRecordLinkFieldValue(value);
        return (
          <MultiRecordLinkCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return (
          <MultiLineTextCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return (
          <MultiOptionCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.Number:
        assertNumberFieldValue(value);
        return (
          <NumberCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return (
          <PhoneNumberCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return (
          <SingleCollaboratorCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleRecordLink:
        assertSingleRecordLinkFieldValue(value);
        return (
          <SingleRecordLinkCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return (
          <SingleLineTextCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return (
          <SingleOptionCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );
      case FieldType.URL:
        assertURLFieldValue(value);
        return (
          <URLCell
            focused={focused}
            record={record}
            field={field}
            value={value}
          />
        );

      default:
        throw new Error('Unhandled FieldType cell rendering');
    }
  }, [field, value, state, record]);

  return (
    <Pressable
      style={[
        styles.leafRowCell,
        primary && styles.primaryCell,
        state === 'focused' && styles.focusedLeafRowCell,
        state === 'focused' && {
          minHeight: height + FOCUS_BORDER_WIDTH * 2,
          width: width + FOCUS_BORDER_WIDTH * 2,
          top: -FOCUS_BORDER_WIDTH,
          left: -FOCUS_BORDER_WIDTH,
        },
      ]}
      onPress={handlePress}
    >
      {renderCell()}
    </Pressable>
  );
}

interface HeaderCellProps {
  field: Field;
  primary: boolean;
}

function HeaderCell(props: HeaderCellProps) {
  const { field, primary } = props;

  return (
    <View style={[styles.headerCell, primary && styles.primaryCell]}>
      <Row>
        <Icon name={getFieldIcon(field.type)} />
        <Spacer size={4} />
        <Text weight="bold">{field.name}</Text>
      </Row>
    </View>
  );
}

interface UseCellKeyBindingsProps {
  cell: StatefulLeafRowCell | null;
  setCell: (cell: StatefulLeafRowCell | null) => void;
  rowToRecordCache: {
    [row: number]: RecordID;
  };
  columnToFieldCache: {
    [column: number]: FieldID;
  };
  records: Record[];
  fields: Field[];
  onOpenRecord: (recordID: RecordID) => void;
  gridRef: React.RefObject<GridRef>;
}

function useCellKeyBindings(props: UseCellKeyBindingsProps) {
  const {
    cell,
    setCell,
    rowToRecordCache,
    columnToFieldCache,
    records,
    fields,
    onOpenRecord,
    gridRef,
  } = props;

  const onArrowDown = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { row, column, path } = cell;

      const nextRow = row + 1;
      if (rowToRecordCache[nextRow] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row: nextRow,
        column,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ row: nextRow, path });
    }
  }, [cell, gridRef, setCell, rowToRecordCache]);

  const onArrowUp = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { row, column, path } = cell;

      const prevRow = row - 1;
      if (rowToRecordCache[prevRow] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row: prevRow,
        column,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ row: prevRow, path });
    }
  }, [cell, gridRef, setCell, rowToRecordCache]);

  const onArrowLeft = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { row, column, path } = cell;
      const prevColumn = column - 1;
      if (columnToFieldCache[prevColumn] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row,
        column: prevColumn,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ column: prevColumn });
    }
  }, [cell, gridRef, setCell, columnToFieldCache]);

  const onArrowRight = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { row, column, path } = cell;

      const nextColumn = column + 1;
      if (columnToFieldCache[nextColumn] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row,
        column: nextColumn,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ column: nextColumn });
    }
  }, [cell, gridRef, setCell, columnToFieldCache]);

  const onMetaArrowDown = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { column, path } = cell;

      const nextRow = records.length;

      setCell({
        type: 'leaf',
        row: nextRow,
        column,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ row: nextRow, path });
    }
  }, [cell, gridRef, setCell, records]);

  const onMetaArrowUp = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { column, path } = cell;

      const prevRow = 1;

      setCell({
        type: 'leaf',
        row: prevRow,
        column,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ row: prevRow, path });
    }
  }, [cell, gridRef, setCell]);

  const onMetaArrowLeft = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { row, path } = cell;

      const prevColumn = 1;

      setCell({
        type: 'leaf',
        row,
        column: prevColumn,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ column: prevColumn });
    }
  }, [cell, gridRef, setCell]);

  const onMetaArrowRight = useCallback(() => {
    if (cell !== null && gridRef.current !== null) {
      const { row, path } = cell;

      const nextColumn = fields.length;

      setCell({
        type: 'leaf',
        row,
        column: nextColumn,
        path,
        state: 'focused',
      });

      gridRef.current.scrollToCell({ column: nextColumn });
    }
  }, [cell, gridRef, setCell, fields]);

  const onEscape = useCallback(() => {
    if (cell !== null) {
      setCell(null);
    }
  }, [cell, setCell]);

  const onEnter = useCallback(() => {
    if (cell !== null) {
      const { row, column, path } = cell;

      setCell({
        type: 'leaf',
        row,
        column,
        path,
        state: 'editing',
      });
    }
  }, [cell, setCell]);

  const onSpace = useCallback(() => {
    if (cell !== null) {
      onOpenRecord(rowToRecordCache[cell.row]);
    }
  }, [cell, onOpenRecord, rowToRecordCache]);

  const focusedCellKeyBindings = useMemo((): KeyBinding[] => {
    if (cell === null || cell.state === 'editing') {
      return [];
    }

    return [
      {
        key: NavigationKey.ArrowDown,
        handler: onArrowDown,
      },
      {
        key: NavigationKey.ArrowUp,
        handler: onArrowUp,
      },
      {
        key: NavigationKey.ArrowLeft,
        handler: onArrowLeft,
      },
      {
        key: NavigationKey.ArrowRight,
        handler: onArrowRight,
      },
      {
        key: NavigationKey.ArrowDown,
        meta: true,
        handler: onMetaArrowDown,
      },
      {
        key: NavigationKey.ArrowUp,
        meta: true,
        handler: onMetaArrowUp,
      },
      {
        key: NavigationKey.ArrowLeft,
        meta: true,
        handler: onMetaArrowLeft,
      },
      {
        key: NavigationKey.ArrowRight,
        meta: true,
        handler: onMetaArrowRight,
      },
      {
        key: UIKey.Escape,
        handler: onEscape,
      },
      {
        key: WhiteSpaceKey.Enter,
        handler: onEnter,
      },
      {
        key: WhiteSpaceKey.Space,
        handler: onSpace,
      },
    ];
  }, [
    cell,
    onArrowDown,
    onArrowUp,
    onArrowLeft,
    onArrowRight,
    onMetaArrowDown,
    onMetaArrowUp,
    onMetaArrowLeft,
    onMetaArrowRight,
    onEscape,
    onEnter,
    onSpace,
  ]);

  useKeyboard(focusedCellKeyBindings);
}

interface CheckboxCellProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
  focused: boolean;
  record: Record;
}

function CheckboxCell(props: CheckboxCellProps) {
  const { value } = props;

  return (
    <View style={styles.checkboxCell}>
      {value === true && <Icon name="CheckThick" color="success" />}
    </View>
  );
}

interface CurrencyCellProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
  focused: boolean;
  record: Record;
}

function CurrencyCell(props: CurrencyCellProps) {
  const { value, field } = props;

  if (isNullish(value)) {
    return null;
  }

  return (
    <View style={styles.numberCellContainer}>
      <Text numberOfLines={1}>
        {formatCurrency(value, getSystemLocale(), field.currency)}
      </Text>
    </View>
  );
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
  focused: boolean;
  record: Record;
}

function DateCell(props: DateCellProps) {
  const { value, field, focused } = props;

  if (isNullish(value)) {
    return null;
  }

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>
          {formatDate(value, field.format, getSystemLocale())}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.textCellContainer}>
        <Text>{formatDate(value, field.format, getSystemLocale())}</Text>
      </View>
      <Spacer size={8} />
      <Text decoration="underline">Close</Text>
    </View>
  );
}
interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
  focused: boolean;
  record: Record;
}

function EmailCell(props: EmailCellProps) {
  const { value, focused } = props;

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text decoration="underline" numberOfLines={1}>
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Button style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </Button>
      <Spacer size={8} />
      <Text decoration="underline" size="sm" color="primary">
        Send email
      </Text>
    </View>
  );
}
interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
  focused: boolean;
  record: Record;
}

function MultiCollaboratorCell(props: MultiCollaboratorCellProps) {
  const { value } = props;
  const collaboratorsByID = useGetCollaboratorsByID();

  return (
    <Fragment>
      {value.map((collaboratorID) => {
        const collaborator = collaboratorsByID[collaboratorID];

        if (isNullish(collaborator)) {
          return null;
        }

        return (
          <CollaboratorBadge
            collaborator={collaborator}
            key={collaborator.name}
          />
        );
      })}
    </Fragment>
  );
}
interface MultiRecordLinkCellProps {
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
  focused: boolean;
  record: Record;
}

function MultiRecordLinkCell(props: MultiRecordLinkCellProps) {
  const { value, field } = props;
  const recordsByID = useGetCollectionRecordsByID(
    field.recordsFromCollectionID,
  );
  const collection = useGetCollection(field.recordsFromCollectionID);

  return (
    <Fragment>
      {value.map((recordID) => {
        if (isNullish(value)) {
          return null;
        }
        const record = recordsByID[recordID];

        if (isNullish(record)) {
          return null;
        }
        const primaryFieldText = record.fields[collection.primaryFieldID];

        if (typeof primaryFieldText !== 'string') {
          throw new Error('Main field expected to be string');
        }

        return <RecordLinkBadge key={recordID} title={primaryFieldText} />;
      })}
    </Fragment>
  );
}
interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
  focused: boolean;
  record: Record;
}

function MultiLineTextCell(props: MultiLineTextCellProps) {
  const { value, focused } = props;

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    );
  }

  return (
    <View style={styles.focusedMultiLineTextCellContainer}>
      <Text>{value}</Text>
    </View>
  );
}

interface MultiOptionCellProps {
  value: MultiOptionFieldValue;
  field: MultiOptionField;
  focused: boolean;
  record: Record;
}

function MultiOptionCell(props: MultiOptionCellProps) {
  const { value, field } = props;

  return (
    <Fragment>
      {value.map((_value) => {
        const selected = field.options.find((o) => o.id === _value);
        if (isNullish(selected)) {
          throw new Error(
            `Expected ${_value} to be within field options ${JSON.stringify(
              field,
            )}`,
          );
        }
        return <OptionBadge key={selected.id} option={selected} />;
      })}
    </Fragment>
  );
}
interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
  focused: boolean;
  record: Record;
}

function NumberCell(props: NumberCellProps) {
  const { value, field } = props;

  if (isNullish(value)) {
    return null;
  }

  switch (field.style) {
    case 'decimal':
      return (
        <View style={styles.numberCellContainer}>
          <Text numberOfLines={1}>
            {Intl.NumberFormat(getSystemLocale(), {
              style: 'decimal',
              minimumFractionDigits: field.minimumFractionDigits,
              maximumFractionDigits: field.maximumFractionDigits,
            }).format(value)}
          </Text>
        </View>
      );
    case 'unit':
      return (
        <View style={styles.numberCellContainer}>
          <Text numberOfLines={1}>
            {formatUnit(value, getSystemLocale(), field.unit)}
          </Text>
        </View>
      );
    default:
      return (
        <View style={styles.numberCellContainer}>
          <Text numberOfLines={1}>{value}</Text>
        </View>
      );
  }
}
interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
  focused: boolean;
  record: Record;
}

function PhoneNumberCell(props: PhoneNumberCellProps) {
  const { value, focused } = props;

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.textCellContainer}>
        <Text>{value}</Text>
      </View>
      <Spacer size={8} />
      <Text size="sm" color="primary">
        Call
      </Text>
    </View>
  );
}
interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
  focused: boolean;
  record: Record;
}

function SingleCollaboratorCell(props: SingleCollaboratorCellProps) {
  const { value } = props;
  const collaboratorsByID = useGetCollaboratorsByID();

  if (isNullish(value)) {
    return null;
  }

  const collaborator = collaboratorsByID[value];

  if (isNullish(collaborator)) {
    return null;
  }

  return (
    <CollaboratorBadge collaborator={collaborator} key={collaborator.name} />
  );
}
interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
  focused: boolean;
  record: Record;
}

function SingleRecordLinkCell(props: SingleRecordLinkCellProps) {
  const { value, field } = props;
  const recordsByID = useGetCollectionRecordsByID(
    field.recordsFromCollectionID,
  );
  const collection = useGetCollection(field.recordsFromCollectionID);

  if (isNullish(value)) {
    return null;
  }
  const record = recordsByID[value];

  if (isNullish(record)) {
    return null;
  }
  const primaryFieldText = record.fields[collection.primaryFieldID];

  if (typeof primaryFieldText !== 'string') {
    throw new Error('Main field expected to be string');
  }

  return <RecordLinkBadge title={primaryFieldText} />;
}

interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
  focused: boolean;
  record: Record;
}

function SingleLineTextCell(props: SingleLineTextCellProps) {
  const { field, value, focused, record } = props;

  const updateRecordField = useUpdateRecordField();
  const handleChange = useCallback(
    (newValue: SingleLineTextFieldValue) => {
      updateRecordField(record.id, field.id, newValue);
    },
    [updateRecordField, record, field],
  );

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    );
  }

  return (
    <TextInput
      style={styles.textCellInput}
      value={value}
      onChangeText={handleChange}
    />
  );
}

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
  focused: boolean;
  record: Record;
}

function SingleOptionCell(props: SingleOptionCellProps) {
  const { value, field } = props;

  if (isNullish(value)) {
    return null;
  }

  const selected = field.options.find((o) => o.id === value);

  if (isNullish(selected)) {
    return null;
  }

  return <OptionBadge option={selected} />;
}

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
  focused: boolean;
  record: Record;
}

function URLCell(props: URLCellProps) {
  const { value, focused } = props;

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text decoration="underline" numberOfLines={1}>
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
      <Spacer size={8} />
      <Text decoration="underline" size="sm" color="primary">
        Open link
      </Text>
    </View>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  leafRowCell: {
    height: '100%',
    borderBottomWidth: 1,
    backgroundColor: theme.background.content,
    borderColor: theme.border.default,
    paddingVertical: 4,
    paddingHorizontal: 8,
    overflowY: 'hidden',
    overflowX: 'hidden',
    ...Platform.select({
      web: {
        cursor: 'auto',
        outlineStyle: 'none',
      },
    }),
  },
  focusedMultiLineTextCellContainer: {
    paddingTop: FOCUS_BORDER_WIDTH + 1,
  },
  textCellInput: {
    height: 32,
    borderRadius: tokens.radius,
    ...tokens.text.size.md,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  focusedLeafRowCell: {
    height: 'auto',
    borderRadius: tokens.radius,
    overflowY: 'visible',
    overflowX: 'hidden',
    borderBottomWidth: FOCUS_BORDER_WIDTH,
    borderTopWidth: FOCUS_BORDER_WIDTH,
    borderLeftWidth: FOCUS_BORDER_WIDTH,
    borderRightWidth: FOCUS_BORDER_WIDTH,
    borderColor: theme.border.focus,
  },
  textCellContainer: {
    height: 32,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  checkboxCell: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryCell: {
    borderRightWidth: 1,
    shadowColor: palette.gray[700],
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  numberCellContainer: {
    height: 32,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerCell: {
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: theme.background.content,
    borderColor: theme.border.default,
    borderBottomWidth: 1,
  },
  focusedCell: {
    borderColor: theme.border.focus,
  },
  hoveredCell: {
    borderColor: theme.border.default,
  },
}));
