import React, {
  createContext,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Pressable,
  Platform,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Container, Icon, Row, Spacer, Text, tokens } from '../components';
import {
  useGetViewRecords,
  useGetSortedFieldsWithListViewConfig,
  useGetCollaboratorsByID,
  useGetCollectionRecordsByID,
  useGetCollection,
  useUpdateRecordField,
  useGetField,
  useGetRecordFieldValue,
  useGetListViewFieldConfig,
  useGetViewFilters,
  useGetViewSorts,
  useGetViewGroups,
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
import { ListView, ViewID } from '../data/views';
import {
  Grid,
  GridRef,
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
} from './grid';
import { Record, RecordID } from '../data/records';
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  NavigationKey,
  KeyBinding,
  useKeyboard,
  WhiteSpaceKey,
  UIKey,
} from '../lib/keyboard';
import { StatefulLeafRowCell, LeafRowCellState } from './grid.common';
import { DynamicStyleSheet } from '../components/stylesheet';
import { getFieldIcon } from './icon_helpers';
import { formatCurrency } from '../../lib/i18n';
import { isNullish, isNumeric } from '../../lib/js_utils';
import { getSystemLocale } from '../lib/locale';
import { palette } from '../components/palette';
import { formatDate } from '../../lib/datetime/format';
import { OptionBadge } from './option_badge';
import { CollaboratorBadge } from './collaborator_badge';
import { RecordLinkBadge } from './record_link_badge';
import { formatUnit } from '../../lib/i18n/unit';
import { usePrevious } from '../hooks/use_previous';

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

type ColumnToFieldIDCache = {
  [column: number]: FieldID;
};

type RowToRecordIDCache = {
  [row: number]: RecordID;
};

function getColumnToFieldIDCache(fields: Field[]) {
  const cache: ColumnToFieldIDCache = {};

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    cache[i + 1] = field.id;
  }

  return cache;
}

// TODO: Include path
function getRowToRecordIDCache(records: Record[]) {
  const cache: RowToRecordIDCache = {};

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    cache[i + 1] = record.id;
  }

  return cache;
}

interface ListViewDisplayContext {
  rowToRecordIDCache: RowToRecordIDCache;
  columnToFieldIDCache: ColumnToFieldIDCache;
}

const ListViewDisplayContext = createContext<ListViewDisplayContext>({
  rowToRecordIDCache: {},
  columnToFieldIDCache: {},
});

export function ListViewDisplay(props: ListViewDisplayProps): JSX.Element {
  const { view, onOpenRecord } = props;
  const cell = useRecoilValue(cellState);
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);
  const gridRef = useRef<GridRef>(null);
  const filters = useGetViewFilters(view.id);
  const sorts = useGetViewSorts(view.id);
  const groups = useGetViewGroups(view.id);
  const [columnToFieldIDCache, setColumnToFieldIDCache] = useState(
    getColumnToFieldIDCache(fields),
  );
  const [rowToRecordIDCache, setRowToRecordIDCache] = useState(
    getRowToRecordIDCache(records),
  );
  const prevRecords = usePrevious(records);
  const prevFields = usePrevious(fields);
  const prevFilters = usePrevious(filters);
  const prevSorts = usePrevious(sorts);
  const prevGroups = usePrevious(groups);
  const prevCell = usePrevious(cell);
  const fixedFieldCount = view.fixedFieldCount;

  if (cell !== prevCell && gridRef.current !== null && cell !== null) {
    gridRef.current.scrollToCell(cell);
  }

  const recordsOrderChanged: boolean = useMemo(() => {
    return (
      records.length !== prevRecords.length ||
      filters !== prevFilters ||
      sorts !== prevSorts ||
      groups !== prevGroups
    );
  }, [
    records,
    prevRecords,
    filters,
    prevFilters,
    sorts,
    prevSorts,
    groups,
    prevGroups,
  ]);
  const fieldsOrderChanged: boolean = useMemo(() => {
    return fields.length !== prevFields.length;
  }, [fields, prevFields]);

  useEffect(() => {
    if (recordsOrderChanged === true) {
      setRowToRecordIDCache(getRowToRecordIDCache(records));
    }
  }, [records, recordsOrderChanged]);

  useEffect(() => {
    if (fieldsOrderChanged === true) {
      setColumnToFieldIDCache(getColumnToFieldIDCache(fields));
    }
  }, [fields, fieldsOrderChanged]);

  useCellKeyBindings({
    columnToFieldIDCache,
    rowToRecordIDCache,
    records,
    fields,
    onOpenRecord,
  });

  const contentOffset = useMemo(() => {
    return { x: 0, y: 0 };
  }, []);
  const context = useMemo((): ListViewDisplayContext => {
    return { rowToRecordIDCache, columnToFieldIDCache };
  }, [rowToRecordIDCache, columnToFieldIDCache]);

  const renderLeafRowCell = useCallback(
    ({ row, column, path, state }: RenderLeafRowCellProps) => {
      const fieldID = columnToFieldIDCache[column];
      const recordID = rowToRecordIDCache[row];
      const primary = column === 1;
      const height = FIELD_ROW_HEIGHT;

      return (
        <LeafRowCell
          state={state}
          path={path}
          recordID={recordID}
          viewID={view.id}
          fieldID={fieldID}
          primary={primary}
          row={row}
          column={column}
          height={height}
        />
      );
    },
    [columnToFieldIDCache, rowToRecordIDCache, view.id],
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
    <ListViewDisplayContext.Provider value={context}>
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
    </ListViewDisplayContext.Provider>
  );
}

interface LeafRowCellProps extends RenderLeafRowCellProps {
  primary: boolean;
  height: number;
  viewID: ViewID;
  fieldID: FieldID;
  recordID: RecordID;
}

function LeafRowCell(props: LeafRowCellProps) {
  const {
    path,
    state,
    row,
    column,
    primary,
    height,
    viewID,
    fieldID,
    recordID,
  } = props;

  const field = useGetField(fieldID);
  const fieldConfig = useGetListViewFieldConfig(viewID, fieldID);
  const value = useGetRecordFieldValue(recordID, fieldID);
  const width = fieldConfig.width;

  return (
    <LeafRowCellRenderer
      field={field}
      recordID={recordID}
      state={state}
      width={width}
      height={height}
      value={value}
      primary={primary}
      row={row}
      path={path}
      column={column}
    />
  );
}

// This component primarily serves as a optimization
interface LeafRowCellRendererProps {
  field: Field;
  recordID: RecordID;
  state: LeafRowCellState;
  width: number;
  height: number;
  value: FieldValue;
  primary: boolean;
  row: number;
  path: number[];
  column: number;
}

const LeafRowCellRenderer = memo(function LeafRowCellRenderer(
  props: LeafRowCellRendererProps,
) {
  const {
    primary,
    height,
    field,
    recordID,
    state,
    width,
    value,
    row,
    path,
    column,
  } = props;
  const { rowToRecordIDCache } = useContext(ListViewDisplayContext);
  const setCell = useSetRecoilState(cellState);

  const handleFocus = useCallback(() => {
    if (state === 'default') {
      setCell({ type: 'leaf', row, path, column, state: 'focused' });
    }
  }, [setCell, state, row, column, path]);

  const handleStartEditing = useCallback(() => {
    if (state === 'focused') {
      setCell({ type: 'leaf', row, path, column, state: 'editing' });
    }
  }, [setCell, state, row, column, path]);

  const handleStopEditing = useCallback(() => {
    if (state === 'editing') {
      setCell({ type: 'leaf', row, path, column, state: 'focused' });
    }
  }, [setCell, state, row, column, path]);

  const handleNextRecord = useCallback(() => {
    const nextRow = row + 1;
    if (rowToRecordIDCache[nextRow] === undefined) {
      return;
    }

    setCell({
      type: 'leaf',
      row: nextRow,
      column,
      path,
      state: 'focused',
    });
  }, [setCell, row, column, path, rowToRecordIDCache]);

  const renderCell = useCallback(() => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return (
          <CheckboxCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return (
          <CurrencyCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.Date:
        assertDateFieldValue(value);
        return (
          <DateCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.Email:
        assertEmailFieldValue(value);
        return (
          <EmailCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return (
          <MultiCollaboratorCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.MultiRecordLink:
        assertMultiRecordLinkFieldValue(value);
        return (
          <MultiRecordLinkCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return (
          <MultiLineTextCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return (
          <MultiOptionCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.Number:
        assertNumberFieldValue(value);
        return (
          <NumberCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return (
          <PhoneNumberCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return (
          <SingleCollaboratorCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.SingleRecordLink:
        assertSingleRecordLinkFieldValue(value);
        return (
          <SingleRecordLinkCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return (
          <SingleLineTextCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return (
          <SingleOptionCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );
      case FieldType.URL:
        assertURLFieldValue(value);
        return (
          <URLCell
            state={state}
            recordID={recordID}
            field={field}
            value={value}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
            onNextRecord={handleNextRecord}
          />
        );

      default:
        throw new Error('Unhandled FieldType cell rendering');
    }
  }, [
    field,
    value,
    state,
    recordID,
    handleStartEditing,
    handleStopEditing,
    handleNextRecord,
  ]);

  return (
    <Pressable
      style={[
        styles.leafRowCell,
        primary && styles.primaryCell,
        state !== 'default' && styles.focusedLeafRowCell,
        state !== 'default' && {
          minHeight: height + FOCUS_BORDER_WIDTH * 2,
          width: width + FOCUS_BORDER_WIDTH * 2,
          top: -FOCUS_BORDER_WIDTH,
          left: -FOCUS_BORDER_WIDTH,
        },
      ]}
      onPress={handleFocus}
    >
      {renderCell()}
    </Pressable>
  );
});

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
  records: Record[];
  fields: Field[];
  onOpenRecord: (recordID: RecordID) => void;
  rowToRecordIDCache: RowToRecordIDCache;
  columnToFieldIDCache: ColumnToFieldIDCache;
}

function useCellKeyBindings(props: UseCellKeyBindingsProps) {
  const {
    rowToRecordIDCache,
    columnToFieldIDCache,
    records,
    fields,
    onOpenRecord,
  } = props;
  const [cell, setCell] = useRecoilState(cellState);

  const onArrowDown = useCallback(() => {
    if (cell !== null) {
      const { row, column, path } = cell;

      const nextRow = row + 1;
      if (rowToRecordIDCache[nextRow] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row: nextRow,
        column,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell, rowToRecordIDCache]);

  const onArrowUp = useCallback(() => {
    if (cell !== null) {
      const { row, column, path } = cell;

      const prevRow = row - 1;
      if (rowToRecordIDCache[prevRow] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row: prevRow,
        column,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell, rowToRecordIDCache]);

  const onArrowLeft = useCallback(() => {
    if (cell !== null) {
      const { row, column, path } = cell;
      const prevColumn = column - 1;
      if (columnToFieldIDCache[prevColumn] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row,
        column: prevColumn,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell, columnToFieldIDCache]);

  const onArrowRight = useCallback(() => {
    if (cell !== null) {
      const { row, column, path } = cell;

      const nextColumn = column + 1;
      if (columnToFieldIDCache[nextColumn] === undefined) {
        return;
      }

      setCell({
        type: 'leaf',
        row,
        column: nextColumn,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell, columnToFieldIDCache]);

  const onMetaArrowDown = useCallback(() => {
    if (cell !== null) {
      const { column, path } = cell;

      const nextRow = records.length;

      setCell({
        type: 'leaf',
        row: nextRow,
        column,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell, records]);

  const onMetaArrowUp = useCallback(() => {
    if (cell !== null) {
      const { column, path } = cell;

      const prevRow = 1;

      setCell({
        type: 'leaf',
        row: prevRow,
        column,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell]);

  const onMetaArrowLeft = useCallback(() => {
    if (cell !== null) {
      const { row, path } = cell;

      const prevColumn = 1;

      setCell({
        type: 'leaf',
        row,
        column: prevColumn,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell]);

  const onMetaArrowRight = useCallback(() => {
    if (cell !== null) {
      const { row, path } = cell;

      const nextColumn = fields.length;

      setCell({
        type: 'leaf',
        row,
        column: nextColumn,
        path,
        state: 'focused',
      });
    }
  }, [cell, setCell, fields]);

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
      onOpenRecord(rowToRecordIDCache[cell.row]);
    }
  }, [cell, onOpenRecord, rowToRecordIDCache]);

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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function CurrencyCell(props: CurrencyCellProps) {
  const {
    value,
    field,
    state,
    recordID,
    onStartEditing,
    onStopEditing,
    onNextRecord,
  } = props;
  const updateRecordField = useUpdateRecordField<CurrencyFieldValue>();
  const handleKeyPress = useCellKeyPressHandler({
    onStopEditing,
    onNextRecord,
  });

  const handleChangeText = useCallback(
    (newValue: string) => {
      if (isNumeric(newValue) === false) {
        return;
      }

      updateRecordField(recordID, field.id, Number(newValue));
    },
    [updateRecordField, recordID, field],
  );

  if (isNullish(value)) {
    return null;
  }

  if (state === 'default') {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1} align="right">
          {formatCurrency(value, getSystemLocale(), field.currency)}
        </Text>
      </View>
    );
  }

  if (state === 'focused') {
    return (
      <Pressable onPress={onStartEditing}>
        <View style={styles.textCellContainer}>
          <Text numberOfLines={1} align="right">
            {formatCurrency(value, getSystemLocale(), field.currency)}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <TextInput
      autoFocus
      style={styles.numberCellInput}
      value={String(value)}
      onKeyPress={handleKeyPress}
      onChangeText={handleChangeText}
    />
  );
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function DateCell(props: DateCellProps) {
  const { value, field, state } = props;

  if (isNullish(value)) {
    return null;
  }

  if (state === 'default') {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>
          {formatDate(value, field.format, getSystemLocale())}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.textCellContainer}>
      <Text>{formatDate(value, field.format, getSystemLocale())}</Text>
    </View>
  );
}
interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function EmailCell(props: EmailCellProps) {
  const {
    field,
    value,
    recordID,
    state,
    onStartEditing,
    onStopEditing,
    onNextRecord,
  } = props;

  const handleKeyPress = useCellKeyPressHandler({
    onStopEditing,
    onNextRecord,
  });
  const updateRecordField = useUpdateRecordField();

  const handleChangeText = useCallback(
    (newValue: EmailFieldValue) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (state === 'default') {
    return (
      <View style={styles.textCellContainer}>
        <Text decoration="underline" numberOfLines={1}>
          {value}
        </Text>
      </View>
    );
  }

  if (state === 'focused') {
    return (
      <View>
        <Pressable onPress={onStartEditing}>
          <View style={styles.textCellContainer}>
            <Text decoration="underline" numberOfLines={1}>
              {value}
            </Text>
          </View>
        </Pressable>
        <Spacer size={8} />
        <Row>
          <Pressable>
            <Text decoration="underline" size="sm" color="primary">
              Send email
            </Text>
          </Pressable>
        </Row>
      </View>
    );
  }

  return (
    <TextInput
      autoFocus
      style={styles.textCellInput}
      value={value}
      onKeyPress={handleKeyPress}
      onChangeText={handleChangeText}
    />
  );
}

interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function MultiLineTextCell(props: MultiLineTextCellProps) {
  const { value, state } = props;

  if (state === 'default') {
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function NumberCell(props: NumberCellProps) {
  const { value, field, state, recordID, onStopEditing, onNextRecord } = props;

  const updateRecordField = useUpdateRecordField<CurrencyFieldValue>();
  const handleKeyPress = useCellKeyPressHandler({
    onStopEditing,
    onNextRecord,
  });

  const handleChangeText = useCallback(
    (newValue: string) => {
      if (isNumeric(newValue) === false) {
        return;
      }

      updateRecordField(recordID, field.id, Number(newValue));
    },
    [updateRecordField, recordID, field],
  );

  if (isNullish(value)) {
    return null;
  }

  if (state === 'default') {
    switch (field.style) {
      case 'decimal':
        return (
          <View style={styles.textCellContainer}>
            <Text numberOfLines={1} align="right">
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
          <View style={styles.textCellContainer}>
            <Text numberOfLines={1} align="right">
              {formatUnit(value, getSystemLocale(), field.unit)}
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.textCellContainer}>
            <Text numberOfLines={1} align="right">
              {value}
            </Text>
          </View>
        );
    }
  }

  return (
    <TextInput
      style={styles.numberCellInput}
      value={String(value)}
      onKeyPress={handleKeyPress}
      onChangeText={handleChangeText}
    />
  );
}

interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function PhoneNumberCell(props: PhoneNumberCellProps) {
  const { field, value, state, recordID, onStopEditing, onNextRecord } = props;

  const updateRecordField = useUpdateRecordField<PhoneNumberFieldValue>();
  const handleKeyPress = useCellKeyPressHandler({
    onStopEditing,
    onNextRecord,
  });

  const handleChangeText = useCallback(
    (newValue: PhoneNumberFieldValue) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (state === 'default') {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    );
  }

  return (
    <View>
      <TextInput
        style={styles.textCellInput}
        value={value}
        onKeyPress={handleKeyPress}
        onChangeText={handleChangeText}
      />
      <Spacer size={8} />
      <Text decoration="underline" size="sm" color="primary">
        Call
      </Text>
    </View>
  );
}
interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function SingleLineTextCell(props: SingleLineTextCellProps) {
  const {
    field,
    value,
    state,
    recordID,
    onStartEditing,
    onStopEditing,
    onNextRecord,
  } = props;

  const handleKeyPress = useCellKeyPressHandler({
    onStopEditing,
    onNextRecord,
  });
  const updateRecordField = useUpdateRecordField();

  const handleChangeText = useCallback(
    (newValue: string) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (state === 'default') {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    );
  }

  if (state === 'focused') {
    return (
      <Pressable onPress={onStartEditing}>
        <View style={styles.textCellContainer}>
          <Text numberOfLines={1}>{value}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <TextInput
      autoFocus
      style={styles.textCellInput}
      value={value}
      onKeyPress={handleKeyPress}
      onChangeText={handleChangeText}
    />
  );
}

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
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
  state: LeafRowCellState;
  recordID: RecordID;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function URLCell(props: URLCellProps) {
  const {
    field,
    value,
    recordID,
    state,
    onStartEditing,
    onStopEditing,
    onNextRecord,
  } = props;

  const updateRecordField = useUpdateRecordField<URLFieldValue>();
  const handleKeyPress = useCellKeyPressHandler({
    onStopEditing,
    onNextRecord,
  });

  const handleChangeText = useCallback(
    (newValue: string) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (state === 'default') {
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
      <TextInput
        style={styles.textCellInput}
        value={value}
        onKeyPress={handleKeyPress}
        onChangeText={handleChangeText}
      />
      <Spacer size={8} />
      <Text decoration="underline" size="sm" color="primary">
        Open link
      </Text>
    </View>
  );
}

interface UseCellKeyPressHandlerProps {
  onStopEditing: () => void;
  onNextRecord: () => void;
}

function useCellKeyPressHandler(
  props: UseCellKeyPressHandlerProps,
): (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void {
  const { onStopEditing, onNextRecord } = props;

  return useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (key === UIKey.Escape) {
        onStopEditing();
      }
      if (key === WhiteSpaceKey.Enter) {
        onNextRecord();
      }
    },
    [onStopEditing, onNextRecord],
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
  numberCellInput: {
    height: 32,
    borderRadius: tokens.radius,
    textAlign: 'right',
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
