import React, {
  createContext,
  Fragment,
  memo,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  View,
  Pressable,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleSheet,
} from 'react-native';
import { FlatButton } from '../components/flat_button';
import { Icon } from '../components/icon';
import { Row } from '../components/row';
import { Spacer } from '../components/spacer';
import { Text } from '../components/text';
import { tokens } from '../components/tokens';
import { ListPicker, ListPickerOption } from '../components/list_picker';
import {
  useUpdateRecordFieldValue,
  useGetField,
  useGetRecordFieldValue,
  useGetListViewFieldConfig,
  useGetCollaborators,
  useGetCollectionRecords,
  useGetRecordPrimaryFieldValueCallback,
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
  FieldID,
  TextFieldKindValue,
  NumberFieldKindValue,
  MultiSelectFieldKindValue,
  SingleSelectFieldKindValue,
  SelectOption,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiRecordLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleRecordLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
  assertPhoneNumberFieldValue,
  SelectOptionID,
  BooleanFieldKindValue,
  stringifyFieldValue,
} from '../data/fields';
import { ViewID } from '../data/views';
import { Record, RecordID } from '../data/records';
import { useSetRecoilState } from 'recoil';
import {
  NavigationKey,
  KeyBinding,
  WhiteSpaceKey,
  EditingKey,
  UIKey,
  useKeyboard,
} from '../lib/keyboard';
import { StatefulLeafRowCell } from '../components/grid_renderer.common';
import { formatCurrency } from '../../lib/currency';
import { getSystemLocale } from '../lib/locale';
import { OptionBadge } from './option_badge';
import { CollaboratorBadge } from './collaborator_badge';
import { RecordLinkBadge } from './record_link_badge';
import { formatUnit } from '../../lib/unit';
import { MultiListPicker } from '../components/multi_list_picker';
import { Collaborator, CollaboratorID } from '../data/collaborators';
import { formatDate, formatISODate, parseISODate } from '../../lib/date_utils';
import { isEmpty } from '../../lib/lang_utils';
import { isNumberString, toNumber } from '../../lib/number_utils';
import { DatePicker } from '../components/date_picker';
import { useTheme } from '../components/theme';
import { Slide } from '../components/slide';
import { ContextMenuButton } from '../components/context_menu_button';
import {
  activeCellState,
  useListViewViewContext,
  ViewMode,
} from './list_view_view';
import {
  useLeafRowContext,
  useLeafRowContextMenuOptions,
} from './list_view_leaf_row';

interface LeafRowCellProps {
  cell: StatefulLeafRowCell;
  primary: boolean;
  height: number;
  viewID: ViewID;
  fieldID: FieldID;
  recordID: RecordID;
}

export const LeafRowCell = memo(function LeafRowCell(props: LeafRowCellProps) {
  const { cell, primary, height, viewID, fieldID, recordID } = props;
  const field = useGetField(fieldID);
  const fieldConfig = useGetListViewFieldConfig(viewID, fieldID);
  const value = useGetRecordFieldValue(recordID, fieldID);
  const { mode, onSelectRecord, rowToRecordIDCache } = useListViewViewContext();
  const setActiveCell = useSetRecoilState(activeCellState);
  const { selected } = useLeafRowContext();
  const width = fieldConfig.width;

  const handleFocus = useCallback(() => {
    if (cell.state === 'default') {
      setActiveCell({ ...cell, state: 'focused' });
    }
  }, [setActiveCell, cell]);

  const handleStartEditing = useCallback(() => {
    if (cell.state === 'focused') {
      setActiveCell({ ...cell, state: 'editing' });
    }
  }, [setActiveCell, cell]);

  const handleStopEditing = useCallback(() => {
    if (cell.state === 'editing') {
      setActiveCell({ ...cell, state: 'focused' });
    }
  }, [setActiveCell, cell]);

  const handleFocusNextRecord = useCallback(() => {
    const nextRow = cell.row + 1;
    if (rowToRecordIDCache.get([...cell.path, nextRow]) === undefined) {
      return;
    }

    setActiveCell({
      ...cell,
      row: nextRow,
      state: 'focused',
    });
  }, [setActiveCell, cell, rowToRecordIDCache]);

  const handlePress = useCallback(() => {
    if (mode === 'edit') {
      handleFocus();
    } else {
      onSelectRecord(recordID, !selected);
    }
  }, [mode, handleFocus, onSelectRecord, recordID, selected]);

  const context: LeafRowCellContext = useMemo(() => {
    return {
      cell,
      recordID,
      fieldID,
      onFocus: handleFocus,
      onStartEditing: handleStartEditing,
      onStopEditing: handleStopEditing,
      onFocusNextRecord: handleFocusNextRecord,
    };
  }, [
    cell,
    recordID,
    fieldID,
    handleFocus,
    handleStartEditing,
    handleStopEditing,
    handleFocusNextRecord,
  ]);

  return useMemo(() => {
    return (
      <LeafRowCellContext.Provider value={context}>
        <LeafRowCellRenderer
          cell={cell}
          field={field}
          width={width}
          height={height}
          value={value}
          primary={primary}
          onPress={handlePress}
          mode={mode}
        />
      </LeafRowCellContext.Provider>
    );
  }, [context, cell, field, width, height, value, primary, mode, handlePress]);
});

interface LeafRowCellContext {
  cell: StatefulLeafRowCell;
  recordID: RecordID;
  fieldID: FieldID;
  onFocus: () => void;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onFocusNextRecord: () => void;
}

const LeafRowCellContext = createContext<LeafRowCellContext>({
  cell: {
    type: 'leaf',
    path: [],
    row: 0,
    column: 0,
    state: 'default',
  },
  recordID: Record.generateID(),
  fieldID: Field.generateID(),
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

const FOCUS_BORDER_WIDTH = 3;

// This component primarily serves as a optimization
interface LeafRowCellRendererProps {
  cell: StatefulLeafRowCell;
  field: Field;
  width: number;
  height: number;
  value: FieldValue;
  primary: boolean;
  mode: ViewMode;
  onPress: () => void;
}

const LeafRowCellRenderer = memo(function LeafRowCellRenderer(
  props: LeafRowCellRendererProps,
) {
  const { cell, primary, height, field, width, value, mode, onPress } = props;
  const theme = useTheme();
  const { selected } = useLeafRowContext();
  const options = useLeafRowContextMenuOptions();

  // Helps a bit more with squeezed content
  let extraWidth = 0;

  if (cell.state === 'editing') {
    switch (field.type) {
      case FieldType.MultiCollaborator:
      case FieldType.SingleCollaborator:
      case FieldType.MultiRecordLink:
      case FieldType.SingleRecordLink:
      case FieldType.MultiOption:
      case FieldType.SingleOption:
        extraWidth = 100;
        break;
      case FieldType.Date:
        extraWidth = 200;
        break;
      default:
        break;
    }
  }

  return (
    <Pressable
      accessible={false}
      pointerEvents={cell.state === 'default' ? 'auto' : 'box-none'}
      style={[
        styles.leafRowCell,
        mode === 'edit' &&
          (theme === 'dark'
            ? styles.cellBackgroundDark
            : styles.cellBackgroundLight),
        primary && styles.primaryCell,
        cell.state !== 'default' && styles.focusedLeafRowCell,
        cell.state !== 'default' && {
          minHeight: height + FOCUS_BORDER_WIDTH * 2,
          width: width + extraWidth + FOCUS_BORDER_WIDTH * 2,
          top: -FOCUS_BORDER_WIDTH,
          left: -FOCUS_BORDER_WIDTH,
        },
      ]}
      onPress={onPress}
    >
      <SelectCheckbox
        open={mode === 'select' && primary === true}
        selected={selected}
      />
      <ListViewCell field={field} value={value} />
      {mode === 'edit' && primary === true && cell.state !== 'editing' && (
        <ContextMenuButton options={options} style={styles.rowMoreButton}>
          <Icon name="Dots" />
        </ContextMenuButton>
      )}
    </Pressable>
  );
});

interface SelectCheckboxProps {
  open: boolean;
  selected: boolean;
}

const SelectCheckbox = memo(function SelectCheckbox(
  props: SelectCheckboxProps,
) {
  const { open, selected } = props;

  return (
    <Slide open={open} width={32}>
      <View
        style={[styles.selectCheckbox, selected && styles.selectedCheckbox]}
      >
        {selected && <Icon name="Check" color="contrast" />}
      </View>
    </Slide>
  );
});

interface ListViewCellProps {
  field: Field;
  value: FieldValue;
}

function ListViewCell(props: ListViewCellProps): JSX.Element {
  const { field, value } = props;
  const renderCell = useCallback((): JSX.Element => {
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
    }
  }, [field, value]);

  return <Fragment>{renderCell()}</Fragment>;
}

interface CheckboxCellProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
}

const CheckboxCell = memo(function CheckboxCell(props: CheckboxCellProps) {
  const { value } = props;
  const { recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue<BooleanFieldKindValue>();

  const handleToggle = useCallback(() => {
    const checked = !value;
    updateRecordFieldValue(recordID, fieldID, checked);
  }, [updateRecordFieldValue, recordID, fieldID, value]);

  useCellKeyBindings({
    onEnter: handleToggle,
  });

  return (
    <View style={styles.checkboxCell}>
      <Pressable style={styles.checkbox} onPress={handleToggle}>
        {value === true && <Icon name="CheckThick" color="success" />}
      </Pressable>
    </View>
  );
});

interface CurrencyCellProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
}

const CurrencyCell = memo(function CurrencyCell(props: CurrencyCellProps) {
  const { value, field } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <NumberFieldKindCellEditing<CurrencyFieldValue> value={value} />;
  }

  const child =
    value === null ? (
      <View style={styles.cellWrapper} />
    ) : (
      <View style={styles.textCellContainer}>
        <Text numberOfLines={1} align="right">
          {formatCurrency(value, getSystemLocale(), field.currency)}
        </Text>
      </View>
    );

  if (cell.state === 'focused') {
    return <NumberFieldKindCellFocused>{child}</NumberFieldKindCellFocused>;
  }

  return <Fragment>{child}</Fragment>;
});

interface NumberFieldKindCellFocusedProps {
  children: React.ReactNode;
}

function NumberFieldKindCellFocused(props: NumberFieldKindCellFocusedProps) {
  const { children } = props;
  const { onStartEditing, recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue();

  const handlePrintableKey = useCallback(
    (key: string) => {
      if (isNumberString(key) === false) {
        return;
      }

      updateRecordFieldValue(recordID, fieldID, toNumber(key));
      onStartEditing();
    },
    [onStartEditing, updateRecordFieldValue, recordID, fieldID],
  );

  useCellKeyBindings({
    onPrintableKey: handlePrintableKey,
  });

  return (
    <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
      {children}
    </Pressable>
  );
}

interface TextFieldKindCellFocusedProps {
  children: React.ReactNode;
}

function TextFieldKindCellFocused(props: TextFieldKindCellFocusedProps) {
  const { children } = props;
  const { onStartEditing, recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue();

  const handlePrintableKey = useCallback(
    (key: string) => {
      updateRecordFieldValue(recordID, fieldID, key);
      onStartEditing();
    },
    [onStartEditing, updateRecordFieldValue, recordID, fieldID],
  );

  useCellKeyBindings({
    onPrintableKey: handlePrintableKey,
  });

  return (
    <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
      {children}
    </Pressable>
  );
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
}

const DateCell = memo(function DateCell(props: DateCellProps) {
  const { value } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return <DateFieldCellEditing value={value} />;
  }

  const child =
    value === null ? (
      <View style={styles.cellWrapper} />
    ) : (
      <View style={styles.textCellContainer}>
        <Text>{formatDate(parseISODate(value), getSystemLocale())}</Text>
      </View>
    );

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

interface DateFieldCellEditingProps {
  value: DateFieldValue;
}

function DateFieldCellEditing(props: DateFieldCellEditingProps) {
  const { value } = props;
  const { recordID, fieldID, onStopEditing } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue<DateFieldValue>();

  const handleChangeDate = useCallback(
    (date: Date) => {
      updateRecordFieldValue(recordID, fieldID, formatISODate(date));
      onStopEditing();
    },
    [updateRecordFieldValue, onStopEditing, recordID, fieldID],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, null);
  }, [updateRecordFieldValue, recordID, fieldID]);

  return (
    <View style={styles.selectKindEditingContainer}>
      <DatePicker
        value={value ? parseISODate(value) : null}
        onChange={handleChangeDate}
      />
      <View style={styles.actionRow}>
        <FlatButton onPress={handleClear} title="Clear" />
        <FlatButton onPress={onStopEditing} color="primary" title="Done" />
      </View>
    </View>
  );
}

interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

const EmailCell = memo(function EmailCell(props: EmailCellProps) {
  const { value } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <TextFieldKindCellEditing<EmailFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
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
});

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

const MultiCollaboratorCell = memo(function MultiCollaboratorCell(
  props: MultiCollaboratorCellProps,
) {
  const { value } = props;
  const collaborators = useGetCollaborators();
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  if (cell.state === 'editing') {
    return (
      <MultiSelectFieldKindCellEditing
        renderLabel={renderCollaborator}
        options={options}
        value={value}
      />
    );
  }

  const child = isEmpty(value) ? (
    <View style={styles.cellWrapper} />
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

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

function useRenderRecordLink() {
  return useCallback((recordID: RecordID) => {
    return <RecordLinkBadge recordID={recordID} key={recordID} />;
  }, []);
}

function useRecordLinkOptions(records: Record[]): ListPickerOption<RecordID>[] {
  const getRecordPrimaryFieldValue = useGetRecordPrimaryFieldValueCallback();

  return records.map((record) => {
    const [field, value] = getRecordPrimaryFieldValue(record.id);

    return {
      value: record.id,
      label: stringifyFieldValue(field, value),
    };
  });
}

interface MultiRecordLinkCellProps {
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
}

const MultiRecordLinkCell = memo(function MultiRecordLinkCell(
  props: MultiRecordLinkCellProps,
) {
  const { value, field } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();
  const renderRecordLink = useRenderRecordLink();

  useCellKeyBindings();

  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  if (cell.state === 'editing') {
    return (
      <MultiSelectFieldKindCellEditing
        renderLabel={renderRecordLink}
        options={options}
        value={value}
      />
    );
  }

  const child = isEmpty(value) ? (
    <View style={styles.cellWrapper} />
  ) : (
    <Row spacing={4}>
      {value.map((recordID) => (
        <RecordLinkBadge key={recordID} recordID={recordID} />
      ))}
    </Row>
  );

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

const MultiLineTextCell = memo(function MultiLineTextCell(
  props: MultiLineTextCellProps,
) {
  const { value } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <MultiLineTextCellEditing value={value} />;
  }

  if (cell.state === 'focused') {
    return (
      <View style={styles.focusedMultiLineTextCellContainer}>
        <TextFieldKindCellFocused>
          <Text>{value}</Text>
        </TextFieldKindCellFocused>
      </View>
    );
  }

  return (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );
});

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
      const option = options.find((_option) => _option.id === id);

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
): ListPickerOption<SelectOptionID>[] {
  return options.map((option) => ({
    value: option.id,
    label: option.label,
  }));
}

const MultiOptionCell = memo(function MultiOptionCell(
  props: MultiOptionCellProps,
) {
  const { value, field } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  if (cell.state === 'editing') {
    return (
      <MultiSelectFieldKindCellEditing
        renderLabel={renderOption}
        options={options}
        value={value}
      />
    );
  }

  const child = isEmpty(value) ? (
    <View style={styles.cellWrapper} />
  ) : (
    <Row spacing={4}>
      {value.map((_value) => {
        const selected = field.options.find((o) => o.id === _value);

        if (selected === undefined) {
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

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

interface MultiSelectFieldKindCellEditingProps<T> {
  value: T[];
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
}

function MultiSelectFieldKindCellEditing<
  T extends CollaboratorID | RecordID | SelectOptionID
>(props: MultiSelectFieldKindCellEditingProps<T>) {
  const { value, options, renderLabel } = props;
  const { recordID, fieldID, onStopEditing } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue<MultiSelectFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: T[]) => {
      updateRecordFieldValue(
        recordID,
        fieldID,
        nextValue as MultiSelectFieldKindValue,
      );
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  const handleClear = useCallback(() => {
    updateRecordFieldValue(recordID, fieldID, []);
    onStopEditing();
  }, [updateRecordFieldValue, recordID, fieldID, onStopEditing]);

  return (
    <View style={styles.selectKindEditingContainer}>
      <MultiListPicker<T>
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
  renderLabel: (value: NonNullable<T>) => JSX.Element;
  options: ListPickerOption<NonNullable<T>>[];
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
      <ListPicker<T>
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

const NumberCell = memo(function NumberCell(props: NumberCellProps) {
  const { value, field } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <NumberFieldKindCellEditing<NumberFieldKindValue> value={value} />;
  }

  let child: React.ReactNode = <View style={styles.cellWrapper} />;

  if (value !== null) {
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
    }
  }

  if (cell.state === 'focused') {
    return <NumberFieldKindCellFocused>{child}</NumberFieldKindCellFocused>;
  }

  return <Fragment>{child}</Fragment>;
});

interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

const PhoneNumberCell = memo(function PhoneNumberCell(
  props: PhoneNumberCellProps,
) {
  const { value } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <TextFieldKindCellEditing<PhoneNumberFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <Spacer size={8} />
        <Text decoration="underline" size="sm" color="primary">
          Call
        </Text>
      </View>
    );
  }

  return <Fragment>{child}</Fragment>;
});

interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

const SingleCollaboratorCell = memo(function SingleCollaboratorCell(
  props: SingleCollaboratorCellProps,
) {
  const { value } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  if (cell.state === 'editing') {
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
      <View style={styles.cellWrapper} />
    ) : (
      <Row>
        <CollaboratorBadge collaboratorID={value} key={value} />
      </Row>
    );

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
}

const SingleRecordLinkCell = memo(function SingleRecordLinkCell(
  props: SingleRecordLinkCellProps,
) {
  const { value, field } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const renderRecordLink = useRenderRecordLink();
  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  if (cell.state === 'editing') {
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
      <View style={styles.cellWrapper} />
    ) : (
      <Row>
        <RecordLinkBadge recordID={value} />
      </Row>
    );

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextCell = memo(function SingleLineTextCell(
  props: SingleLineTextCellProps,
) {
  const { value } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <TextFieldKindCellEditing<SingleLineTextFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  if (cell.state === 'focused') {
    return <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>;
  }

  return <Fragment>{child}</Fragment>;
});

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

const SingleOptionCell = memo(function SingleOptionCell(
  props: SingleOptionCellProps,
) {
  const { value, field } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const renderOption = useRenderOption(field.options);
  const options = useGetOptionOptions(field.options);

  if (cell.state === 'editing') {
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
      <View style={styles.cellWrapper} />
    ) : (
      <Row>
        <OptionBadge option={selected} />
      </Row>
    );

  if (cell.state === 'focused') {
    return <Pressable onPress={onStartEditing}>{child}</Pressable>;
  }

  return <Fragment>{child}</Fragment>;
});

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

const URLCell = memo(function URLCell(props: URLCellProps) {
  const { value } = props;
  const { cell } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return <TextFieldKindCellEditing<URLFieldValue> value={value} />;
  }

  const child = (
    <View style={styles.textCellContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <Spacer size={8} />
        <Text decoration="underline" size="sm" color="primary">
          Open link
        </Text>
      </View>
    );
  }

  return <Fragment>{child}</Fragment>;
});

interface TextFieldKindCellEditingProps<T extends TextFieldKindValue> {
  value: T;
}

function TextFieldKindCellEditing<T extends TextFieldKindValue>(
  props: TextFieldKindCellEditingProps<T>,
) {
  const { value } = props;
  const { recordID, fieldID } = useLeafRowCellContext();
  const updateRecordFieldValue = useUpdateRecordFieldValue<TextFieldKindValue>();
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
      if (newValue !== '' && isNumberString(newValue) === false) {
        return;
      }

      updateRecordFieldValue(recordID, fieldID, toNumber(newValue));
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  return (
    <TextInput
      autoFocus
      style={styles.numberCellInput}
      value={value ? value.toString() : ''}
      onKeyPress={handleKeyPress}
      onChangeText={handleChangeText}
    />
  );
}

interface UseCellKeyBindingsProps {
  onDelete?: () => void;
  onPrintableKey?: (key: string) => void;
  onEnter?: () => void;
}

function useCellKeyBindings(props: UseCellKeyBindingsProps = {}) {
  const {
    onEnter: onEnterOverride,
    onPrintableKey: onPrintableKeyOverride,
  } = props;
  const {
    rowToRecordIDCache,
    columnToFieldIDCache,
    lastRow,
    lastColumn,
    onOpenRecord,
  } = useListViewViewContext();
  const { cell } = useLeafRowCellContext();
  const setActiveCell = useSetRecoilState(activeCellState);

  // Listen for keyboard strokes only when the cell is focused
  const active = cell !== null && cell.state === 'focused';

  const onArrowDown = useCallback(() => {
    const { row, column, path } = cell;
    const nextRow = row + 1;
    const next = rowToRecordIDCache.get([...cell.path, nextRow]);

    if (next === undefined) {
      return;
    }

    setActiveCell({
      type: 'leaf',
      row: nextRow,
      column,
      path,
      state: 'focused',
    });
  }, [cell, setActiveCell, rowToRecordIDCache]);

  const onArrowUp = useCallback(() => {
    const { row, column, path } = cell;
    const prevRow = row - 1;
    const prev = rowToRecordIDCache.get([...cell.path, prevRow]);

    if (prev === undefined) {
      return;
    }

    setActiveCell({
      type: 'leaf',
      row: prevRow,
      column,
      path,
      state: 'focused',
    });
  }, [cell, setActiveCell, rowToRecordIDCache]);

  const onArrowLeft = useCallback(() => {
    const { row, column, path } = cell;
    const prevColumn = column - 1;
    if (columnToFieldIDCache[prevColumn] === undefined) {
      return;
    }

    setActiveCell({
      type: 'leaf',
      row,
      column: prevColumn,
      path,
      state: 'focused',
    });
  }, [cell, setActiveCell, columnToFieldIDCache]);

  const onArrowRight = useCallback(() => {
    const { row, column, path } = cell;
    const nextColumn = column + 1;
    if (columnToFieldIDCache[nextColumn] === undefined) {
      return;
    }

    setActiveCell({
      type: 'leaf',
      row,
      column: nextColumn,
      path,
      state: 'focused',
    });
  }, [cell, setActiveCell, columnToFieldIDCache]);

  const onMetaArrowDown = useCallback(() => {
    const { column } = cell;

    setActiveCell({
      type: 'leaf',
      row: lastRow.row,
      column,
      path: lastRow.path,
      state: 'focused',
    });
  }, [cell, setActiveCell, lastRow]);

  const onMetaArrowUp = useCallback(() => {
    const { column } = cell;

    setActiveCell({
      type: 'leaf',
      row: 1,
      column,
      path: [0],
      state: 'focused',
    });
  }, [cell, setActiveCell]);

  const onMetaArrowLeft = useCallback(() => {
    const { row, path } = cell;
    const prevColumn = 1;

    setActiveCell({
      type: 'leaf',
      row,
      column: prevColumn,
      path,
      state: 'focused',
    });
  }, [cell, setActiveCell]);

  const onMetaArrowRight = useCallback(() => {
    const { row, path } = cell;
    const nextColumn = lastColumn;

    setActiveCell({
      type: 'leaf',
      row,
      column: nextColumn,
      path,
      state: 'focused',
    });
  }, [cell, setActiveCell, lastColumn]);

  const onEscape = useCallback(() => {
    setActiveCell(null);
  }, [setActiveCell]);

  const onDelete = useCallback(() => {
    return;
  }, []);

  const onPrintableKey = useCallback(
    (key: string) => {
      if (onPrintableKeyOverride !== undefined) {
        onPrintableKeyOverride(key);
      }
    },
    [onPrintableKeyOverride],
  );

  const onEnter = useCallback(() => {
    const { row, column, path } = cell;

    if (onEnterOverride !== undefined) {
      onEnterOverride();
      return;
    }

    setActiveCell({
      type: 'leaf',
      row,
      column,
      path,
      state: 'editing',
    });
  }, [cell, setActiveCell, onEnterOverride]);

  const onSpace = useCallback(() => {
    const { row, path } = cell;
    const recordID = rowToRecordIDCache.get([...path, row]);

    if (recordID === undefined) {
      throw new Error('onSpace called on faulty row path');
    }

    onOpenRecord(recordID);
  }, [cell, onOpenRecord, rowToRecordIDCache]);

  const focusedCellKeyBindings = useMemo((): KeyBinding[] => {
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
      {
        key: EditingKey.Backspace,
        handler: onDelete,
      },
      {
        key: EditingKey.Delete,
        handler: onDelete,
      },
      {
        key: 'PrintableKey',
        handler: onPrintableKey,
      },
    ];
  }, [
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
    onDelete,
    onPrintableKey,
  ]);

  useKeyboard(focusedCellKeyBindings, active);
}

interface KeyPressHandlerConfig {
  /** When true, pressing Enter key will shift focus on next record */
  enter?: boolean;
  /** When true, pressing Escape key will stop editing current cell */
  escape?: boolean;
}

function useCellKeyPressHandler(
  config: KeyPressHandlerConfig = {},
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

const styles = StyleSheet.create({
  leafRowCell: {
    height: '100%',
    borderBottomWidth: 1,
    borderColor: tokens.colors.gray[300],
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflowY: 'hidden',
    overflowX: 'hidden',
  },
  focusedMultiLineTextCellContainer: {
    paddingTop: FOCUS_BORDER_WIDTH + 1,
  },
  textCellInput: {
    height: 32,
    borderRadius: tokens.border.radius,
    ...tokens.text.size.md,
  },
  multilineTextCellInput: {
    paddingTop: FOCUS_BORDER_WIDTH + 1,
    minHeight: 128,
    borderRadius: tokens.border.radius,
    ...tokens.text.size.md,
  },
  numberCellInput: {
    height: 32,
    borderRadius: tokens.border.radius,
    textAlign: 'right',
    ...tokens.text.size.md,
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
    borderRadius: tokens.border.radius,
    overflowY: 'visible',
    overflowX: 'hidden',
    borderBottomWidth: FOCUS_BORDER_WIDTH,
    borderTopWidth: FOCUS_BORDER_WIDTH,
    borderLeftWidth: FOCUS_BORDER_WIDTH,
    borderRightWidth: FOCUS_BORDER_WIDTH,
    borderColor: tokens.colors.lightBlue[700],
  },
  textCellContainer: {
    height: 32,
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  checkboxCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCheckbox: {
    borderRadius: 999,
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: tokens.colors.lightBlue[700],
    borderColor: tokens.colors.lightBlue[700],
  },
  rowMoreButton: {
    borderRadius: 999,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: tokens.colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellWrapper: {
    height: 32,
    flex: 1,
  },
  cellBackgroundLight: {
    backgroundColor: tokens.colors.base.white,
  },
  cellBackgroundDark: {
    backgroundColor: tokens.colors.gray[900],
  },
  primaryCell: {
    borderRightWidth: 2,
  },
});
