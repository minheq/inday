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
import { StatefulLeafRowCell } from './grid.common';
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

function getColumnToFieldIDCache(fields: Field[]) {
  const cache: {
    [column: number]: FieldID;
  } = {};

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    cache[i + 1] = field.id;
  }

  return cache;
}

// TODO: Include path
function getRowToRecordIDCache(records: Record[]) {
  const cache: {
    [row: number]: RecordID;
  } = {};

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    cache[i + 1] = record.id;
  }

  return cache;
}

interface ListViewDisplayContext {
  rowToRecordIDCache: {
    [row: number]: RecordID;
  };
  columnToFieldIDCache: {
    [column: number]: FieldID;
  };
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
      focused={state === 'focused'}
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
  focused: boolean;
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
    focused,
    width,
    value,
    row,
    path,
    column,
  } = props;
  const setCell = useSetRecoilState(cellState);

  const renderCell = useCallback(() => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return (
          <CheckboxCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return (
          <CurrencyCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.Date:
        assertDateFieldValue(value);
        return (
          <DateCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.Email:
        assertEmailFieldValue(value);
        return (
          <EmailCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return (
          <MultiCollaboratorCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiRecordLink:
        assertMultiRecordLinkFieldValue(value);
        return (
          <MultiRecordLinkCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return (
          <MultiLineTextCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return (
          <MultiOptionCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.Number:
        assertNumberFieldValue(value);
        return (
          <NumberCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return (
          <PhoneNumberCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return (
          <SingleCollaboratorCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleRecordLink:
        assertSingleRecordLinkFieldValue(value);
        return (
          <SingleRecordLinkCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return (
          <SingleLineTextCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return (
          <SingleOptionCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.URL:
        assertURLFieldValue(value);
        return (
          <URLCell
            focused={focused}
            recordID={recordID}
            field={field}
            value={value}
          />
        );

      default:
        throw new Error('Unhandled FieldType cell rendering');
    }
  }, [field, value, focused, recordID]);

  const handlePress = useCallback(() => {
    if (focused === false) {
      setCell({ type: 'leaf', row, path, column, state: 'focused' });
    }
  }, [setCell, focused, row, column, path]);

  return (
    <Pressable
      style={[
        styles.leafRowCell,
        primary && styles.primaryCell,
        focused && styles.focusedLeafRowCell,
        focused && {
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

function useFocusToCellBelow() {
  const [cell, setCell] = useRecoilState(cellState);
  const { rowToRecordIDCache } = useContext(ListViewDisplayContext);

  return useCallback(() => {
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
}

interface UseCellKeyBindingsProps {
  records: Record[];
  fields: Field[];
  onOpenRecord: (recordID: RecordID) => void;
}

function useCellKeyBindings(props: UseCellKeyBindingsProps) {
  const { records, fields, onOpenRecord } = props;
  const { rowToRecordIDCache, columnToFieldIDCache } = useContext(
    ListViewDisplayContext,
  );
  const [cell, setCell] = useRecoilState(cellState);
  const focusToCellBelow = useFocusToCellBelow();

  const onArrowDown = useCallback(() => {
    focusToCellBelow();
  }, [focusToCellBelow]);

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
  focused: boolean;
  recordID: RecordID;
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
  recordID: RecordID;
}

function CurrencyCell(props: CurrencyCellProps) {
  const { value, field, focused, recordID } = props;
  const [editing, startEditing] = useCellEditingState(focused);
  const updateRecordField = useUpdateRecordField<CurrencyFieldValue>();
  const handleKeyPress = useCellKeyPressHandler();

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

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1} align="right">
          {formatCurrency(value, getSystemLocale(), field.currency)}
        </Text>
      </View>
    );
  }

  if (editing === false) {
    return (
      <Pressable onPress={startEditing}>
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
  focused: boolean;
  recordID: RecordID;
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
    <View style={styles.textCellContainer}>
      <Text>{formatDate(value, field.format, getSystemLocale())}</Text>
    </View>
  );
}
interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
  focused: boolean;
  recordID: RecordID;
}

function EmailCell(props: EmailCellProps) {
  const { field, value, recordID, focused } = props;

  const [editing, startEditing] = useCellEditingState(focused);
  const handleKeyPress = useCellKeyPressHandler();
  const updateRecordField = useUpdateRecordField();

  const handleChangeText = useCallback(
    (newValue: EmailFieldValue) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text decoration="underline" numberOfLines={1}>
          {value}
        </Text>
      </View>
    );
  }

  if (editing === false) {
    return (
      <View>
        <Pressable onPress={startEditing}>
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
  focused: boolean;
  recordID: RecordID;
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
  recordID: RecordID;
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
  recordID: RecordID;
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
  recordID: RecordID;
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
  recordID: RecordID;
}

function NumberCell(props: NumberCellProps) {
  const { value, field, focused, recordID } = props;

  const updateRecordField = useUpdateRecordField<CurrencyFieldValue>();
  const handleKeyPress = useCellKeyPressHandler();

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

  if (focused === false) {
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
  focused: boolean;
  recordID: RecordID;
}

function PhoneNumberCell(props: PhoneNumberCellProps) {
  const { field, value, focused, recordID } = props;

  const updateRecordField = useUpdateRecordField<PhoneNumberFieldValue>();
  const handleKeyPress = useCellKeyPressHandler();

  const handleChangeText = useCallback(
    (newValue: PhoneNumberFieldValue) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (focused === false) {
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
  focused: boolean;
  recordID: RecordID;
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
  recordID: RecordID;
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
  recordID: RecordID;
}

function SingleLineTextCell(props: SingleLineTextCellProps) {
  const { field, value, focused, recordID } = props;

  const [editing, startEditing] = useCellEditingState(focused);
  const handleKeyPress = useCellKeyPressHandler();
  const updateRecordField = useUpdateRecordField();

  const handleChangeText = useCallback(
    (newValue: string) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

  if (focused === false) {
    return (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    );
  }

  if (editing === false) {
    return (
      <Pressable onPress={startEditing}>
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
  focused: boolean;
  recordID: RecordID;
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
  recordID: RecordID;
}

function URLCell(props: URLCellProps) {
  const { field, value, recordID, focused } = props;

  const updateRecordField = useUpdateRecordField<URLFieldValue>();
  const handleKeyPress = useCellKeyPressHandler();

  const handleChangeText = useCallback(
    (newValue: string) => {
      updateRecordField(recordID, field.id, newValue);
    },
    [updateRecordField, recordID, field],
  );

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

function useCellKeyPressHandler(): (
  event: NativeSyntheticEvent<TextInputKeyPressEventData>,
) => void {
  const setCell = useSetRecoilState(cellState);
  const focusToCellBelow = useFocusToCellBelow();

  return useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (key === UIKey.Escape) {
        setCell(null);
      }
      if (key === WhiteSpaceKey.Enter) {
        focusToCellBelow();
      }
    },
    [setCell, focusToCellBelow],
  );
}

function useCellEditingState(
  focused: boolean,
): [editing: boolean, startEditing: () => void] {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (focused === false) {
      setEditing(false);
    }
  }, [focused]);

  const startEditing = useCallback(() => {
    setEditing(true);
  }, []);

  return [editing, startEditing];
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
  cellActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
