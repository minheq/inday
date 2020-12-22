import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  View,
  Pressable,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Icon } from '../components/icon';
import { Text } from '../components/text';
import { tokens } from '../components/tokens';
import {
  useUpdateRecordFieldValue,
  useGetField,
  useGetRecordFieldValue,
  useGetListViewFieldConfig,
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
  NumberFieldKindValue,
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
  BooleanFieldKindValue,
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
import { isNumberString, toNumber } from '../../lib/number_utils';
import { useThemeStyles } from '../components/theme';
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
import { FieldDateValueEdit } from './field_date_value_edit';
import { FieldMultiCollaboratorValueEdit } from './field_multi_collaborator_value_edit';
import { FieldSingleCollaboratorValueEdit } from './field_single_collaborator_value_edit';
import { FieldSingleOptionValueEdit } from './field_single_option_value_edit';
import { FieldMultiOptionValueEdit } from './field_multi_option_value_edit';
import { FieldMultiRecordLinkValueEdit } from './field_multi_record_link_value_edit';
import { FieldSingleRecordLinkValueEdit } from './field_single_record_link_value_edit';
import { FieldTextKindValueEdit } from './field_text_kind_value_edit';
import { FieldNumberKindValueEdit } from './field_number_kind_value_edit';
import { FieldMultiLineTextValueEdit } from './field_multi_line_text_value_edit';
import { FieldNumberValueView } from './field_number_value_view';
import { FieldCheckboxValueEdit } from './field_checkbox_value_edit';
import { FieldSingleOptionValueView } from './field_single_option_value_view';
import { FieldMultiOptionValueView } from './field_multi_option_value_view';
import { FieldMultiCollaboratorValueView } from './field_multi_collaborator_value_view';
import { FieldSingleCollaboratorValueView } from './field_single_collaborator_value_view';
import { FieldSingleRecordLinkValueView } from './field_single_record_link_value_view';
import { FieldMultiRecordLinkValueView } from './field_multi_record_link_value_view';
import { FieldCurrencyValueView } from './field_currency_value_view';
import { FieldDateValueView } from './field_date_value_view';
import { FieldEmailValueView } from './field_email_value_view';
import { FieldEmailValueActions } from './field_email_value_actions';
import { FieldURLValueActions } from './field_url_value_actions';
import { FieldPhoneNumberValueActions } from './field_phone_number_value_actions';
import { FieldSingleLineTextValueView } from './field_single_line_text_value_view';
import { FieldURLValueView } from './field_url_value_view';
import { FieldPhoneNumberValueView } from './field_phone_number_value_view';
import { assertUnreached } from '../../lib/lang_utils';

export const LEAF_ROW_HEIGHT = 40;

interface LeafRowCellProps {
  cell: StatefulLeafRowCell;
  primary: boolean;
  viewID: ViewID;
  fieldID: FieldID;
  recordID: RecordID;
}

export const LeafRowCell = memo(function LeafRowCell(props: LeafRowCellProps) {
  const { cell, primary, viewID, fieldID, recordID } = props;
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
          height={LEAF_ROW_HEIGHT}
          value={value}
          primary={primary}
          onPress={handlePress}
          mode={mode}
        />
      </LeafRowCellContext.Provider>
    );
  }, [context, cell, field, width, value, primary, mode, handlePress]);
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
  const themeStyles = useThemeStyles();
  const { selected } = useLeafRowContext();
  const options = useLeafRowContextMenuOptions();

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
      default:
        assertUnreached(field);
    }
  }, [field, value]);

  const pressableStyle = useMemo(
    (): StyleProp<ViewStyle> => [
      styles.leafRowCell,
      themeStyles.border.default,
      mode === 'edit' && themeStyles.background.content,
      primary && styles.primaryCell,
      primary && cell.state !== 'default' && styles.focusedPrimaryLeafRowCell,
      cell.state !== 'default' && styles.focusedLeafRowCell,
      cell.state !== 'default' && themeStyles.border.focused,
      cell.state !== 'default' && {
        minHeight: height + FOCUS_BORDER_WIDTH * 2,
        width: width + FOCUS_BORDER_WIDTH * 2,
        top: -FOCUS_BORDER_WIDTH,
        left: -FOCUS_BORDER_WIDTH,
      },
    ],
    [cell, height, mode, primary, themeStyles, width],
  );

  return (
    <Pressable
      accessible={false}
      pointerEvents={cell.state === 'default' ? 'auto' : 'box-none'}
      style={pressableStyle}
      onPress={onPress}
    >
      {primary === true && (
        <View style={mode === 'select' && styles.selectCheckboxWrapper}>
          <SelectCheckbox open={mode === 'select'} selected={selected} />
        </View>
      )}
      {renderCell()}
      {primary === true && mode === 'edit' && cell.state !== 'editing' && (
        <View style={styles.rowMoreButtonWrapper}>
          <ContextMenuButton options={options} style={styles.rowMoreButton}>
            <Icon name="Dots" />
          </ContextMenuButton>
        </View>
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
  const themeStyles = useThemeStyles();

  return (
    <Slide open={open} width={32}>
      <View
        style={[
          styles.selectCheckbox,
          themeStyles.border.default,
          selected && themeStyles.background.primary,
          selected && themeStyles.border.primary,
        ]}
      >
        {selected && <Icon name="Check" color="contrast" />}
      </View>
    </Slide>
  );
});

interface CheckboxCellProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
}

const CheckboxCell = memo(function CheckboxCell(props: CheckboxCellProps) {
  const { value, field } = props;
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
      <FieldCheckboxValueEdit recordID={recordID} field={field} value={value} />
    </View>
  );
});

interface CurrencyCellProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
}

const CurrencyCell = memo(function CurrencyCell(props: CurrencyCellProps) {
  const { value, field } = props;
  const { cell, recordID } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldNumberKindValueEdit<CurrencyFieldValue>
        autoFocus
        value={value}
        recordID={recordID}
        field={field}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const child = <FieldCurrencyValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return <NumberFieldKindCellFocused>{child}</NumberFieldKindCellFocused>;
  }

  return <View style={styles.cellWrapper}>{child}</View>;
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
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldDateValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = <FieldDateValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

const EmailCell = memo(function EmailCell(props: EmailCellProps) {
  const { value, field } = props;
  const { cell, recordID } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldTextKindValueEdit<EmailFieldValue>
        autoFocus
        field={field}
        recordID={recordID}
        value={value}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const child = <FieldEmailValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <View style={styles.focusWrapper}>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <View style={styles.actionsWrapper}>
          <FieldEmailValueActions value={value} />
        </View>
      </View>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

const MultiCollaboratorCell = memo(function MultiCollaboratorCell(
  props: MultiCollaboratorCellProps,
) {
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldMultiCollaboratorValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = <FieldMultiCollaboratorValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface MultiRecordLinkCellProps {
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
}

const MultiRecordLinkCell = memo(function MultiRecordLinkCell(
  props: MultiRecordLinkCellProps,
) {
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldMultiRecordLinkValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = <FieldMultiRecordLinkValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

const MultiLineTextCell = memo(function MultiLineTextCell(
  props: MultiLineTextCellProps,
) {
  const { value, field } = props;
  const { cell, recordID } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldMultiLineTextValueEdit
        autoFocus
        recordID={recordID}
        field={field}
        value={value}
        onKeyPress={handleKeyPress}
      />
    );
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

interface MultiOptionCellProps {
  value: MultiOptionFieldValue;
  field: MultiOptionField;
}

const MultiOptionCell = memo(function MultiOptionCell(
  props: MultiOptionCellProps,
) {
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldMultiOptionValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = <FieldMultiOptionValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

const NumberCell = memo(function NumberCell(props: NumberCellProps) {
  const { value, field } = props;
  const { recordID, cell } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldNumberKindValueEdit<NumberFieldKindValue>
        autoFocus
        value={value}
        recordID={recordID}
        field={field}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const child = <FieldNumberValueView field={field} value={value} />;

  if (cell.state === 'focused') {
    return <NumberFieldKindCellFocused>{child}</NumberFieldKindCellFocused>;
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

const PhoneNumberCell = memo(function PhoneNumberCell(
  props: PhoneNumberCellProps,
) {
  const { value, field } = props;
  const { recordID, cell } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldTextKindValueEdit<PhoneNumberFieldValue>
        autoFocus
        field={field}
        recordID={recordID}
        value={value}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const child = <FieldPhoneNumberValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <View style={styles.focusWrapper}>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <View style={styles.actionsWrapper}>
          <FieldPhoneNumberValueActions value={value} />
        </View>
      </View>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

const SingleCollaboratorCell = memo(function SingleCollaboratorCell(
  props: SingleCollaboratorCellProps,
) {
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldSingleCollaboratorValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = (
    <FieldSingleCollaboratorValueView value={value} field={field} />
  );

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
}

const SingleRecordLinkCell = memo(function SingleRecordLinkCell(
  props: SingleRecordLinkCellProps,
) {
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldSingleRecordLinkValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = <FieldSingleRecordLinkValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextCell = memo(function SingleLineTextCell(
  props: SingleLineTextCellProps,
) {
  const { value, field } = props;
  const { cell, recordID } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldTextKindValueEdit<SingleLineTextFieldValue>
        autoFocus
        field={field}
        recordID={recordID}
        value={value}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const child = <FieldSingleLineTextValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>;
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

const SingleOptionCell = memo(function SingleOptionCell(
  props: SingleOptionCellProps,
) {
  const { value, field } = props;
  const {
    recordID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <FieldSingleOptionValueEdit
        recordID={recordID}
        field={field}
        value={value}
        onDone={onStopEditing}
      />
    );
  }

  const child = <FieldSingleOptionValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellWrapper} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

const URLCell = memo(function URLCell(props: URLCellProps) {
  const { value, field } = props;
  const { cell, recordID } = useLeafRowCellContext();
  const handleKeyPress = useCellKeyPressHandler();

  if (cell.state === 'editing') {
    return (
      <FieldTextKindValueEdit<URLFieldValue>
        autoFocus
        field={field}
        recordID={recordID}
        value={value}
        onKeyPress={handleKeyPress}
      />
    );
  }

  const child = <FieldURLValueView value={value} field={field} />;

  if (cell.state === 'focused') {
    return (
      <View style={styles.focusWrapper}>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <View style={styles.actionsWrapper}>
          <FieldURLValueActions value={value} />
        </View>
      </View>
    );
  }

  return <View style={styles.cellWrapper}>{child}</View>;
});

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

    if (lastRow !== undefined) {
      setActiveCell({
        type: 'leaf',
        row: lastRow.row,
        column,
        path: lastRow.path,
        state: 'focused',
      });
    }
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
    flexDirection: 'row',
    alignItems: 'center',
    overflowY: 'hidden',
    overflowX: 'hidden',
  },
  focusedMultiLineTextCellContainer: {},
  focusedLeafRowCell: {
    height: 'auto',
    borderRadius: tokens.border.radius,
    overflowY: 'visible',
    overflowX: 'hidden',
    borderBottomWidth: FOCUS_BORDER_WIDTH,
    borderTopWidth: FOCUS_BORDER_WIDTH,
    borderLeftWidth: FOCUS_BORDER_WIDTH,
    borderRightWidth: FOCUS_BORDER_WIDTH,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowMoreButton: {
    borderRadius: 999,
  },
  selectCheckboxWrapper: {
    paddingLeft: 8,
  },
  rowMoreButtonWrapper: {
    paddingRight: 8,
  },
  cellWrapper: {
    width: '100%',
    height: LEAF_ROW_HEIGHT,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  focusWrapper: {
    flex: 1,
  },
  actionsWrapper: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  primaryCell: {
    borderRightWidth: 2,
  },
  focusedPrimaryLeafRowCell: {
    paddingRight: 2,
  },
});
