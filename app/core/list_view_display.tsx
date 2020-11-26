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
  FlatButton,
  Container,
  Icon,
  ListPickerOption,
  Row,
  Spacer,
  Text,
  tokens,
  ListPicker,
} from '../components';
import {
  useGetViewRecords,
  useGetSortedFieldsWithListViewConfig,
  useUpdateRecordFieldValue,
  useGetField,
  useGetRecordFieldValue,
  useGetListViewFieldConfig,
  useGetViewFilters,
  useGetViewSorts,
  useGetViewGroups,
  useGetCollaborators,
  useGetCollectionRecords,
  useGetRecordCallback,
  useGetCollectionCallback,
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
  TextFieldKindValue,
  NumberFieldKindValue,
  MultiSelectFieldKindValue,
  SingleSelectFieldKindValue,
  SelectOption,
} from '../data/fields';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { ListView, ViewID } from '../data/views';
import {
  Grid,
  GridRef,
  RenderLeafRowCellProps,
  RenderHeaderCellProps,
} from '../components/grid';
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
import {
  StatefulLeafRowCell,
  LeafRowCellState,
} from '../components/grid.common';
import { DynamicStyleSheet } from '../components/stylesheet';
import { getFieldIcon } from './icon_helpers';
import { formatCurrency } from '../../lib/i18n';
import {
  InferArrayItemType,
  isEmpty,
  isNullish,
  isNumeric,
} from '../../lib/js_utils';
import { getSystemLocale } from '../lib/locale';
import { palette } from '../components/palette';
import { formatDate } from '../../lib/datetime/format';
import { OptionBadge } from './option_badge';
import { CollaboratorBadge } from './collaborator_badge';
import { RecordLinkBadge } from './record_link_badge';
import { formatUnit } from '../../lib/i18n/unit';
import { usePrevious } from '../hooks/use_previous';
import { MultiListPicker } from '../components/multi_list_picker';
import { Collaborator, CollaboratorID } from '../data/collaborators';

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

// TODO:
// - Make it obvious when changing state from editing -> focus (e.g. after pressing ESC)
// - Display more information when focusing/editing cell
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

interface LeafRowCellContext {
  state: LeafRowCellState;
  recordID: RecordID;
  fieldID: FieldID;
  onFocus: () => void;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onFocusNextRecord: () => void;
}

const LeafRowCellContext = createContext<LeafRowCellContext>({
  state: 'default',
  recordID: '',
  fieldID: '',
  onFocus: () => {
    return;
  },
  onStartEditing: () => {
    return;
  },
  onStopEditing: () => {
    return;
  },
  onFocusNextRecord: () => {
    return;
  },
});

function useLeafRowCellContext(): LeafRowCellContext {
  return useContext(LeafRowCellContext);
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

  const context: LeafRowCellContext = useMemo(() => {
    return {
      state,
      recordID,
      fieldID,
      onFocus: handleFocus,
      onStartEditing: handleStartEditing,
      onStopEditing: handleStopEditing,
      onFocusNextRecord: handleNextRecord,
    };
  }, [
    state,
    recordID,
    fieldID,
    handleFocus,
    handleStartEditing,
    handleStopEditing,
    handleNextRecord,
  ]);

  return useMemo(() => {
    return (
      <LeafRowCellContext.Provider value={context}>
        <LeafRowCellRenderer
          field={field}
          width={width}
          height={height}
          value={value}
          primary={primary}
        />
      </LeafRowCellContext.Provider>
    );
  }, [context, field, width, height, value, primary]);
}

// This component primarily serves as a optimization
interface LeafRowCellRendererProps {
  field: Field;
  width: number;
  height: number;
  value: FieldValue;
  primary: boolean;
}

const LeafRowCellRenderer = memo(function LeafRowCellRenderer(
  props: LeafRowCellRendererProps,
) {
  const { primary, height, field, width, value } = props;
  const { state, onFocus } = useLeafRowCellContext();

  const renderCell = useCallback(() => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return <CheckboxCell field={field} value={value} />;
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return <CurrencyCell field={field} value={value} />;
      case FieldType.Date:
        assertDateFieldValue(value);
        return <DateCell field={field} value={value} />;
      case FieldType.Email:
        assertEmailFieldValue(value);
        return <EmailCell field={field} value={value} />;
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return <MultiCollaboratorCell field={field} value={value} />;
      case FieldType.MultiRecordLink:
        assertMultiRecordLinkFieldValue(value);
        return <MultiRecordLinkCell field={field} value={value} />;
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return <MultiLineTextCell field={field} value={value} />;
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return <MultiOptionCell field={field} value={value} />;
      case FieldType.Number:
        assertNumberFieldValue(value);
        return <NumberCell field={field} value={value} />;
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return <PhoneNumberCell field={field} value={value} />;
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return <SingleCollaboratorCell field={field} value={value} />;
      case FieldType.SingleRecordLink:
        assertSingleRecordLinkFieldValue(value);
        return <SingleRecordLinkCell field={field} value={value} />;
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return <SingleLineTextCell field={field} value={value} />;
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return <SingleOptionCell field={field} value={value} />;
      case FieldType.URL:
        assertURLFieldValue(value);
        return <URLCell field={field} value={value} />;

      default:
        throw new Error('Unhandled FieldType cell rendering');
    }
  }, [field, value]);

  // Helps a bit more with squeezed content
  let extraWidth = 0;

  if (state === 'editing') {
    switch (field.type) {
      case FieldType.MultiCollaborator:
      case FieldType.SingleCollaborator:
      case FieldType.MultiRecordLink:
      case FieldType.SingleRecordLink:
      case FieldType.MultiOption:
      case FieldType.SingleOption:
        extraWidth = 100;
        break;
      default:
        break;
    }
  }

  return (
    <Pressable
      accessible={false}
      pointerEvents={state === 'default' ? 'box-only' : 'box-none'}
      style={[
        styles.leafRowCell,
        primary && styles.primaryCell,
        state !== 'default' && styles.focusedLeafRowCell,
        state !== 'default' && {
          minHeight: height + FOCUS_BORDER_WIDTH * 2,
          width: width + extraWidth + FOCUS_BORDER_WIDTH * 2,
          top: -FOCUS_BORDER_WIDTH,
          left: -FOCUS_BORDER_WIDTH,
        },
      ]}
      onPress={onFocus}
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
}

function CurrencyCell(props: CurrencyCellProps) {
  const { value, field } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (isNullish(value)) {
    return null;
  }

  if (state === 'editing') {
    return <NumberFieldKindCellEditing<CurrencyFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1} align="right">
        {formatCurrency(value, getSystemLocale(), field.currency)}
      </Text>
    </View>
  );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
}

function DateCell(props: DateCellProps) {
  const { value, field } = props;
  const { state } = useLeafRowCellContext();

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
}

function EmailCell(props: EmailCellProps) {
  const { value } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (state === 'editing') {
    return <TextFieldKindCellEditing<EmailFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (state === 'focused') {
    return (
      <View>
        <Pressable onPress={onStartEditing}>{child}</Pressable>
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

  return <Fragment>{child}</Fragment>;
}

function useRenderCollaborator() {
  return useCallback((collaboratorID: CollaboratorID) => {
    return (
      <CollaboratorBadge collaboratorID={collaboratorID} key={collaboratorID} />
    );
  }, []);
}

function useGetCollaboratorOptions(
  collaborators: Collaborator[],
): ListPickerOption<CollaboratorID>[] {
  return useMemo(() => {
    return collaborators.map((collaborator) => ({
      value: collaborator.id,
      label: collaborator.name,
    }));
  }, [collaborators]);
}

interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

function MultiCollaboratorCell(props: MultiCollaboratorCellProps) {
  const { value } = props;
  const collaborators = useGetCollaborators();
  const { state, onStartEditing } = useLeafRowCellContext();

  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  if (state === 'editing') {
    return (
      <MultiSelectFieldKindCellEditing
        renderLabel={renderCollaborator}
        options={options}
        value={value}
      />
    );
  }

  const child = isEmpty(value) ? (
    <View style={styles.badgePlaceholder} />
  ) : (
    <Row spacing={4}>
      {value.map((collaboratorID) => (
        <CollaboratorBadge
          collaboratorID={collaboratorID}
          key={collaboratorID}
        />
      ))}
    </Row>
  );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

function useGetRecordPrimaryTextField() {
  const getRecord = useGetRecordCallback();
  const getCollection = useGetCollectionCallback();

  return useCallback(
    (recordID: RecordID) => {
      const record = getRecord(recordID);
      const collection = getCollection(record.collectionID);

      const primaryFieldText = record.fields[collection.primaryFieldID];
      if (typeof primaryFieldText !== 'string') {
        throw new Error('Main field expected to be string');
      }
      return primaryFieldText;
    },
    [getRecord, getCollection],
  );
}

function useRenderRecordLink() {
  return useCallback((recordID: RecordID) => {
    return <RecordLinkBadge recordID={recordID} key={recordID} />;
  }, []);
}

function useRecordLinkOptions(records: Record[]): ListPickerOption<RecordID>[] {
  const getRecordPrimaryFieldText = useGetRecordPrimaryTextField();

  return records.map((record) => ({
    value: record.id,
    label: getRecordPrimaryFieldText(record.id),
  }));
}

interface MultiRecordLinkCellProps {
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
}

function MultiRecordLinkCell(props: MultiRecordLinkCellProps) {
  const { value, field } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const renderRecordLink = useRenderRecordLink();
  const options = useRecordLinkOptions(records);

  if (state === 'editing') {
    return (
      <MultiSelectFieldKindCellEditing
        renderLabel={renderRecordLink}
        options={options}
        value={value}
      />
    );
  }

  const child = isEmpty(value) ? (
    <View style={styles.badgePlaceholder} />
  ) : (
    <Row spacing={4}>
      {value.map((recordID) => (
        <RecordLinkBadge key={recordID} recordID={recordID} />
      ))}
    </Row>
  );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

function MultiLineTextCell(props: MultiLineTextCellProps) {
  const { value } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (state === 'editing') {
    return <MultiLineTextCellEditing value={value} />;
  }

  if (state === 'focused') {
    return (
      <Pressable
        onPress={onStartEditing}
        style={styles.focusedMultiLineTextCellContainer}
      >
        <Text>{value}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );
}

interface MultiLineTextCellEditingProps {
  value: MultiLineTextFieldValue;
}

function MultiLineTextCellEditing(props: MultiLineTextCellEditingProps) {
  const { value } = props;
  const { recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue();
  const handleKeyPress = useCellKeyPressHandler({ enter: false });
  const handleChangeText = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  return (
    <TextInput
      autoFocus
      style={styles.multilineTextCellInput}
      value={value}
      multiline
      onKeyPress={handleKeyPress}
      onChangeText={handleChangeText}
    />
  );
}

interface MultiOptionCellProps {
  value: MultiOptionFieldValue;
  field: MultiOptionField;
}

function useRenderOption(options: SelectOption[]) {
  return useCallback(
    (id: string) => {
      const option = options.find((option) => option.id === id);

      if (option === undefined) {
        return <Fragment />;
      }

      return <OptionBadge option={option} key={option.id} />;
    },
    [options],
  );
}

function useGetOptionOptions(
  options: SelectOption[],
): ListPickerOption<string>[] {
  return options.map((option) => ({
    value: option.id,
    label: option.label,
  }));
}

function MultiOptionCell(props: MultiOptionCellProps) {
  const { value, field } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  if (state === 'editing') {
    return (
      <MultiSelectFieldKindCellEditing
        renderLabel={renderOption}
        options={options}
        value={value}
      />
    );
  }

  const child = isEmpty(value) ? (
    <View style={styles.badgePlaceholder} />
  ) : (
    <Row spacing={4}>
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
    </Row>
  );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface MultiSelectFieldKindCellEditingProps<
  T extends MultiSelectFieldKindValue
> {
  value: T;
  renderLabel: (
    value: InferArrayItemType<MultiSelectFieldKindValue>,
  ) => JSX.Element;
  options: ListPickerOption<InferArrayItemType<MultiSelectFieldKindValue>>[];
}

function MultiSelectFieldKindCellEditing<T extends MultiSelectFieldKindValue>(
  props: MultiSelectFieldKindCellEditingProps<T>,
) {
  const { value, options, renderLabel } = props;
  const { recordID, fieldID, onStopEditing } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue<MultiSelectFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: MultiSelectFieldKindValue) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, []);
    onStopEditing();
  }, [updateRecordFieldValue, recordID, fieldID, onStopEditing]);

  return (
    <View style={styles.selectKindEditingContainer}>
      <MultiListPicker<InferArrayItemType<MultiSelectFieldKindValue>>
        value={value}
        options={options}
        renderLabel={renderLabel}
        onChange={handleChange}
        onRequestClose={onStopEditing}
      />
      <View style={styles.actionRow}>
        <FlatButton onPress={handleClear} title="Clear all" />
        <FlatButton onPress={onStopEditing} color="primary" title="Done" />
      </View>
    </View>
  );
}

interface SingleSelectFieldKindCellEditingProps<
  T extends SingleSelectFieldKindValue
> {
  value: T;
  renderLabel: (value: NonNullable<SingleSelectFieldKindValue>) => JSX.Element;
  options: ListPickerOption<NonNullable<SingleSelectFieldKindValue>>[];
}

function SingleSelectFieldKindCellEditing<T extends SingleSelectFieldKindValue>(
  props: SingleSelectFieldKindCellEditingProps<T>,
) {
  const { value, options, renderLabel } = props;
  const { recordID, fieldID, onStopEditing } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue<SingleSelectFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: SingleSelectFieldKindValue) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
      onStopEditing();
    },
    [updateRecordFieldValue, recordID, fieldID, onStopEditing],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, null);
    onStopEditing();
  }, [updateRecordFieldValue, recordID, fieldID, onStopEditing]);

  return (
    <View style={styles.selectKindEditingContainer}>
      <ListPicker<SingleSelectFieldKindValue>
        value={value}
        options={options}
        renderLabel={renderLabel}
        onChange={handleChange}
        onRequestClose={onStopEditing}
      />
      <View style={styles.actionRow}>
        <FlatButton onPress={handleClear} title="Clear" />
        <FlatButton onPress={onStopEditing} color="primary" title="Done" />
      </View>
    </View>
  );
}

interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

function NumberCell(props: NumberCellProps) {
  const { value, field } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (isNullish(value)) {
    return null;
  }

  if (state === 'editing') {
    return <NumberFieldKindCellEditing<NumberFieldKindValue> value={value} />;
  }

  let child: React.ReactNode = null;

  switch (field.style) {
    case 'decimal':
      child = (
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
      break;
    case 'unit':
      child = (
        <View style={styles.textCellContainer}>
          <Text numberOfLines={1} align="right">
            {formatUnit(value, getSystemLocale(), field.unit)}
          </Text>
        </View>
      );
      break;
    case 'integer':
      child = (
        <View style={styles.textCellContainer}>
          <Text numberOfLines={1} align="right">
            {value}
          </Text>
        </View>
      );
      break;
    default:
      throw new Error('Field style not supported');
  }

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

function PhoneNumberCell(props: PhoneNumberCellProps) {
  const { value } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (state === 'editing') {
    return <TextFieldKindCellEditing<PhoneNumberFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  if (state === 'focused') {
    return (
      <View>
        <Pressable onPress={onStartEditing}>{child}</Pressable>
        <Spacer size={8} />
        <Text decoration="underline" size="sm" color="primary">
          Call
        </Text>
      </View>
    );
  }

  return <Fragment>{child}</Fragment>;
}

interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

function SingleCollaboratorCell(props: SingleCollaboratorCellProps) {
  const { value } = props;

  const { state, onStartEditing } = useLeafRowCellContext();

  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  if (state === 'editing') {
    return (
      <SingleSelectFieldKindCellEditing
        renderLabel={renderCollaborator}
        options={options}
        value={value}
      />
    );
  }

  const child =
    value === null ? (
      <View style={styles.badgePlaceholder} />
    ) : (
      <Row>
        <CollaboratorBadge collaboratorID={value} key={value} />
      </Row>
    );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
}

function SingleRecordLinkCell(props: SingleRecordLinkCellProps) {
  const { value, field } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  const renderRecordLink = useRenderRecordLink();
  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  if (state === 'editing') {
    return (
      <SingleSelectFieldKindCellEditing
        renderLabel={renderRecordLink}
        options={options}
        value={value}
      />
    );
  }

  const child =
    value === null ? (
      <View style={styles.badgePlaceholder} />
    ) : (
      <Row>
        <RecordLinkBadge recordID={value} />
      </Row>
    );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

function SingleLineTextCell(props: SingleLineTextCellProps) {
  const { value } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (state === 'editing') {
    return <TextFieldKindCellEditing<SingleLineTextFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

function SingleOptionCell(props: SingleOptionCellProps) {
  const { value, field } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  if (state === 'editing') {
    return (
      <SingleSelectFieldKindCellEditing
        renderLabel={renderOption}
        options={options}
        value={value}
      />
    );
  }

  const selected = field.options.find((o) => o.id === value);

  const child =
    value === null || selected === undefined ? (
      <View style={styles.badgePlaceholder} />
    ) : (
      <Row>
        <OptionBadge option={selected} />
      </Row>
    );

  if (state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
}

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

function URLCell(props: URLCellProps) {
  const { value } = props;
  const { state, onStartEditing } = useLeafRowCellContext();

  if (state === 'editing') {
    return <TextFieldKindCellEditing<URLFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (state === 'focused') {
    return (
      <View>
        <Pressable onPress={onStartEditing}>{child}</Pressable>
        <Spacer size={8} />
        <Text decoration="underline" size="sm" color="primary">
          Open link
        </Text>
      </View>
    );
  }

  return <Fragment>{child}</Fragment>;
}

interface TextFieldKindCellEditingProps<T extends TextFieldKindValue> {
  value: T;
}

function TextFieldKindCellEditing<T extends TextFieldKindValue>(
  props: TextFieldKindCellEditingProps<T>,
) {
  const { value } = props;
  const { recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue();
  const handleKeyPress = useCellKeyPressHandler();
  const handleChangeText = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

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

interface NumberFieldKindCellEditingProps<T extends NumberFieldKindValue> {
  value: T;
}

function NumberFieldKindCellEditing<T extends NumberFieldKindValue>(
  props: NumberFieldKindCellEditingProps<T>,
) {
  const { value } = props;
  const { recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue();
  const handleKeyPress = useCellKeyPressHandler();
  const handleChangeText = useCallback(
    (newValue: string) => {
      if (isNumeric(newValue) === false) {
        return;
      }

      updateRecordFieldValue(recordID, fieldID, Number(newValue));
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

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

function useCellKeyPressHandler(
  config: { enter?: boolean; escape?: boolean } = {},
): (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void {
  const { enter = true, escape = true } = config;
  const { onStopEditing, onFocusNextRecord } = useLeafRowCellContext();

  return useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (escape === true && key === UIKey.Escape) {
        onStopEditing();
      }
      if (enter === true && key === WhiteSpaceKey.Enter) {
        onFocusNextRecord();
      }
    },
    [onStopEditing, onFocusNextRecord, escape, enter],
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
  multilineTextCellInput: {
    paddingTop: FOCUS_BORDER_WIDTH + 1,
    minHeight: 128,
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
  selectKindEditingContainer: {
    maxHeight: 480,
  },
  actionRow: {
    paddingTop: 24,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  badgePlaceholder: {
    height: 32,
    width: '100%',
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
