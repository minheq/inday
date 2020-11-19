import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Container, Icon, Row, Spacer, Text } from '../components';
import {
  useGetViewRecords,
  useGetSortedFieldsWithListViewConfig,
  useGetCollaboratorsByID,
  useGetCollectionRecordsByID,
  useGetCollection,
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
  RenderHeaderProps,
  RenderLeafRowProps,
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
import { BadgeOption } from './badge_option';
import { BadgeCollaborator } from './badge_collaborator';
import { BadgeRecordLink } from './badge_record_link';
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
        />
      );
    },
    [fields, records],
  );

  const renderLeafRow = useCallback(
    ({ path, row, state, children }: RenderLeafRowProps) => {
      return (
        <LeafRow row={row} state={state} path={path}>
          {children}
        </LeafRow>
      );
    },
    [],
  );

  const renderHeader = useCallback(({ children }: RenderHeaderProps) => {
    return <Header>{children}</Header>;
  }, []);

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
            renderHeader={renderHeader}
            renderHeaderCell={renderHeaderCell}
            leafRowHeight={RECORD_ROW_HEIGHT}
            headerHeight={FIELD_ROW_HEIGHT}
            columns={columns}
            fixedColumnCount={fixedFieldCount}
            cell={cell}
            renderLeafRow={renderLeafRow}
          />
        )}
      </AutoSizer>
    </Container>
  );
}

interface LeafRowProps extends RenderLeafRowProps {
  children: React.ReactNode;
}

function LeafRow(props: LeafRowProps) {
  const { children } = props;

  return <View style={styles.leafRow}>{children}</View>;
}

interface HeaderProps {
  children: React.ReactNode;
}

function Header(props: HeaderProps) {
  const { children } = props;

  return <View style={styles.headerRow}>{children}</View>;
}

interface LeafRowCellProps extends RenderLeafRowCellProps {
  field: Field;
  value: FieldValue;
  record: Record;
  primary: boolean;
}

function LeafRowCell(props: LeafRowCellProps) {
  const { field, value, path, state, row, column, primary } = props;
  const setCell = useSetRecoilState(cellState);

  const handlePress = useCallback(() => {
    if (state === 'default') {
      setCell({ type: 'leaf', row, path, column, state: 'focused' });
    } else if (state === 'focused') {
      setCell({ type: 'leaf', row, path, column, state: 'editing' });
    }
  }, [setCell, state, row, column, path]);

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

  return (
    <Pressable
      style={[styles.leafRowCell, primary && styles.primaryCell]}
      onPress={handlePress}
    >
      <View
        style={[
          styles.cellWrapper,
          state === 'hovered' && styles.hoveredCell,
          state === 'focused' && styles.focusedCell,
        ]}
      >
        {renderCell()}
      </View>
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

  if (isNullish(value)) {
    return null;
  }

  return (
    <View style={styles.numberCell}>
      <Text numberOfLines={1}>
        {formatCurrency(value, getSystemLocale(), field.currency)}
      </Text>
    </View>
  );
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
}

function DateCell(props: DateCellProps) {
  const { value, field } = props;

  if (isNullish(value)) {
    return null;
  }

  return (
    <Text numberOfLines={1}>
      {formatDate(value, field.format, getSystemLocale())}
    </Text>
  );
}
interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

function EmailCell(props: EmailCellProps) {
  const { value } = props;

  return (
    <Text decoration="underline" numberOfLines={1}>
      {value}
    </Text>
  );
}
interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
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
          <BadgeCollaborator
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

        return <BadgeRecordLink key={recordID} title={primaryFieldText} />;
      })}
    </Fragment>
  );
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
        return <BadgeOption key={selected.id} option={selected} />;
      })}
    </Fragment>
  );
}
interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

function NumberCell(props: NumberCellProps) {
  const { value, field } = props;

  if (isNullish(value)) {
    return null;
  }

  switch (field.style) {
    case 'decimal':
      return (
        <View style={styles.numberCell}>
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
        <View style={styles.numberCell}>
          <Text numberOfLines={1}>
            {formatUnit(value, getSystemLocale(), field.unit)}
          </Text>
        </View>
      );
    default:
      return (
        <View style={styles.numberCell}>
          <Text numberOfLines={1}>{value}</Text>
        </View>
      );
  }
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
  const collaboratorsByID = useGetCollaboratorsByID();

  if (isNullish(value)) {
    return null;
  }

  const collaborator = collaboratorsByID[value];

  if (isNullish(collaborator)) {
    return null;
  }

  return (
    <BadgeCollaborator collaborator={collaborator} key={collaborator.name} />
  );
}
interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
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

  return <BadgeRecordLink title={primaryFieldText} />;
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
  const { value, field } = props;

  if (isNullish(value)) {
    return null;
  }

  const selected = field.options.find((o) => o.id === value);

  if (isNullish(selected)) {
    return null;
  }

  return <BadgeOption option={selected} />;
}

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

function URLCell(props: URLCellProps) {
  const { value } = props;

  return (
    <Text decoration="underline" numberOfLines={1}>
      {value}
    </Text>
  );
}

const styles = DynamicStyleSheet.create((theme) => ({
  leafRowCell: {
    width: '100%',
    height: '100%',
    borderBottomWidth: 1,
    backgroundColor: theme.background.content,
    borderColor: theme.border.default,
    ...Platform.select({
      web: {
        cursor: 'auto',
      },
    }),
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
  numberCell: {
    width: '100%',
    height: '100%',
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
  headerRow: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.background.content,
  },
  leafRow: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.background.content,
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
}));
