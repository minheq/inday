import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { Text } from '../../components/text';
import { tokens } from '../../components/tokens';
import { useFieldQuery, useDocumentFieldValueQuery } from '../../store/queries';
import {
  FieldType,
  CheckboxField,
  CurrencyField,
  DateField,
  EmailField,
  MultiCollaboratorField,
  MultiDocumentLinkField,
  MultiLineTextField,
  MultiOptionField,
  NumberField,
  PhoneNumberField,
  SingleCollaboratorField,
  SingleDocumentLinkField,
  SingleLineTextField,
  SingleOptionField,
  URLField,
  Field,
  CheckboxFieldValue,
  CurrencyFieldValue,
  DateFieldValue,
  EmailFieldValue,
  MultiCollaboratorFieldValue,
  MultiDocumentLinkFieldValue,
  MultiLineTextFieldValue,
  MultiOptionFieldValue,
  NumberFieldValue,
  PhoneNumberFieldValue,
  SingleCollaboratorFieldValue,
  SingleDocumentLinkFieldValue,
  SingleLineTextFieldValue,
  SingleOptionFieldValue,
  URLFieldValue,
  FieldValue,
  FieldID,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
  assertPhoneNumberFieldValue,
  BooleanFieldKindValue,
  generateFieldID,
  formatNumberFieldValue,
} from '../../../models/fields';
import { DocumentID, generateDocumentID } from '../../../models/documents';
import { useSetRecoilState } from 'recoil';
import {
  NavigationKey,
  KeyBinding,
  WhiteSpaceKey,
  EditingKey,
  UIKey,
  useKeyboard,
} from '../../lib/keyboard';
import { LeafRowCellState } from '../../components/grid_renderer.common';
import { isNumberString, toNumber } from '../../../lib/number_utils';
import { useThemeStyles } from '../../components/theme';
import { activeCellState, useListViewViewContext } from './list_view_view';
import { useLeafRowContext, useLeafRowContextMenuItems } from './leaf_row';
import { SingleOptionPicker } from '../select_options/option_picker';
import { MultiOptionPicker } from '../select_options/option_multi_picker';
import { assertUnreached } from '../../../lib/lang_utils';
import { Slide } from '../../components/slide';
import { Icon } from '../../components/icon';
import { CheckboxView } from '../../components/checkbox';
import { Spacer } from '../../components/spacer';
import { LEAF_ROW_HEIGHT } from './list_view_constants';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';
import { FlatButton } from '../../components/flat_button';
import { Popover } from '../../components/popover';
import {
  PressableHighlight,
  PressableStateCallback,
} from '../../components/pressable_highlight';
import { ContextMenu } from '../../components/context_menu';
import { CollaboratorBadgeList } from '../collaborators/collaborator_badge_list';
import { CollaboratorMultiPicker } from '../collaborators/collaborator_multi_picker';
import { CollaboratorPicker } from '../collaborators/collaborator_picker';
import { DocumentLinkBadgeList } from '../document_link/document_link_badge_list';
import { OptionBadgeList } from '../select_options/option_badge_list';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { DocumentLinkBadge } from '../document_link/document_link_badge';
import { OptionBadge } from '../select_options/option_badge';
import { formatCurrency } from '../../../lib/currency';
import { getSystemLocale } from '../../lib/locale';
import {
  formatDate,
  formatISODate,
  parseISODate,
} from '../../../lib/date_utils';
import { DatePicker } from '../../components/date_picker';
import { NumberInput } from '../../components/number_input';
import { TextInput } from '../../components/text_input';
import { CheckboxAlt } from '../../components/checkbox_alt';
import { EmailLink } from '../../components/email_link';
import { PhoneNumberLink } from '../../components/phone_number_link';
import { URLLink } from '../../components/url_link';

interface LeafRowCellProps {
  primary: boolean;
  path: number[];
  row: number;
  column: number;
  last: boolean;
  state: LeafRowCellState;
  level: number;
  fieldID: FieldID;
  documentID: DocumentID;
}

export const LeafRowCell = memo(function LeafRowCell(props: LeafRowCellProps) {
  const {
    primary,
    path,
    row,
    column,
    last,
    state,
    level,
    fieldID,
    documentID,
  } = props;
  const cell = useMemo(
    (): LeafRowCell => ({
      primary,
      path,
      row,
      column,
      last,
      state,
    }),
    [primary, path, row, column, last, state],
  );
  const field = useFieldQuery(fieldID);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  const {
    mode,
    onSelectDocument,
    rowToDocumentIDCache,
  } = useListViewViewContext();
  const setActiveCell = useSetRecoilState(activeCellState);
  const { selected } = useLeafRowContext();

  const handleFocus = useCallback(() => {
    if (cell.state === 'default') {
      setActiveCell({ ...cell, type: 'leaf', state: 'focused' });
    }
  }, [setActiveCell, cell]);

  const handleStartEditing = useCallback(() => {
    if (cell.state === 'focused') {
      setActiveCell({ ...cell, type: 'leaf', state: 'editing' });
    }
  }, [setActiveCell, cell]);

  const handleStopEditing = useCallback(() => {
    if (cell.state === 'editing') {
      setActiveCell({ ...cell, type: 'leaf', state: 'focused' });
    }
  }, [setActiveCell, cell]);

  const handleFocusNextDocument = useCallback(() => {
    const nextRow = cell.row + 1;
    if (rowToDocumentIDCache.get([...cell.path, nextRow]) === undefined) {
      return;
    }

    setActiveCell({ ...cell, type: 'leaf', row: nextRow, state: 'focused' });
  }, [setActiveCell, cell, rowToDocumentIDCache]);

  const handlePress = useCallback(() => {
    if (mode === 'edit') {
      handleFocus();
    } else {
      onSelectDocument(documentID, !selected);
    }
  }, [mode, handleFocus, onSelectDocument, documentID, selected]);

  const context: LeafRowCellContext = useMemo(() => {
    return {
      cell,
      documentID,
      fieldID,
      onPress: handlePress,
      onFocus: handleFocus,
      onStartEditing: handleStartEditing,
      onStopEditing: handleStopEditing,
      onFocusNextDocument: handleFocusNextDocument,
    };
  }, [
    cell,
    documentID,
    fieldID,
    handlePress,
    handleFocus,
    handleStartEditing,
    handleStopEditing,
    handleFocusNextDocument,
  ]);

  return (
    <LeafRowCellContext.Provider value={context}>
      <LeafRowCellView level={level} field={field} value={value} />
    </LeafRowCellContext.Provider>
  );
});

interface LeafRowCell {
  primary: boolean;
  path: number[];
  row: number;
  column: number;
  last: boolean;
  state: LeafRowCellState;
}

interface LeafRowCellContext {
  cell: LeafRowCell;
  documentID: DocumentID;
  fieldID: FieldID;
  onPress: () => void;
  onFocus: () => void;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onFocusNextDocument: () => void;
}

const LeafRowCellContext = createContext<LeafRowCellContext>({
  cell: {
    primary: false,
    path: [],
    row: 0,
    column: 0,
    state: 'default',
    last: false,
  },
  documentID: generateDocumentID(),
  fieldID: generateFieldID(),
  onPress: () => {
    return;
  },
  onFocus: () => {
    return;
  },
  onStartEditing: () => {
    return;
  },
  onStopEditing: () => {
    return;
  },
  onFocusNextDocument: () => {
    return;
  },
});

function useLeafRowCellContext(): LeafRowCellContext {
  return useContext(LeafRowCellContext);
}

// This component primarily serves as a optimization
interface LeafRowCellViewProps {
  field: Field;
  value: FieldValue;
  level: number;
}

const LeafRowCellView = memo(function LeafRowCellView(
  props: LeafRowCellViewProps,
) {
  const { field, value, level } = props;
  const { mode } = useListViewViewContext();
  const { selected } = useLeafRowContext();
  const { cell, onPress } = useLeafRowCellContext();
  const themeStyles = useThemeStyles();

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
      case FieldType.MultiDocumentLink:
        assertMultiDocumentLinkFieldValue(value);
        return <MultiDocumentLinkCell field={field} value={value} />;
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
      case FieldType.SingleDocumentLink:
        assertSingleDocumentLinkFieldValue(value);
        return <SingleDocumentLinkCell field={field} value={value} />;
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
    (): (({ hovered }: PressableStateCallback) => StyleProp<ViewStyle>) => ({
      hovered,
    }) => [
      styles.leafRowCell,
      themeStyles.border.default,
      mode === 'edit' && hovered && themeStyles.button.flatHovered,
      cell.state !== 'default' && themeStyles.background.content,
      cell.primary && styles.primaryCell,
    ],
    [cell, mode, themeStyles],
  );

  return (
    <Pressable
      accessible={false}
      pointerEvents={cell.state === 'default' ? 'auto' : 'box-none'}
      // @ts-ignore: Web supports
      style={pressableStyle}
      onPress={onPress}
    >
      {cell.primary === true && (
        <SelectCheckbox visible={mode === 'select'} selected={selected} />
      )}
      {cell.primary && <Spacer direction="row" size={level * 32} />}
      <View style={styles.cellRoot}>{renderCell()}</View>
      {cell.primary === true && mode === 'edit' && cell.state !== 'editing' && (
        <DotsMenu />
      )}
      {cell.state === 'default' && (
        <View
          pointerEvents="none"
          style={[styles.bottomBorder, themeStyles.border.default]}
        />
      )}
      {cell.state !== 'default' && (
        <View
          pointerEvents="none"
          style={[styles.focused, themeStyles.border.focused]}
        />
      )}
    </Pressable>
  );
});

interface SelectCheckboxProps {
  visible: boolean;
  selected: boolean;
}

const SelectCheckbox = memo(function SelectCheckbox(
  props: SelectCheckboxProps,
): JSX.Element {
  const { visible, selected } = props;

  return (
    <View style={visible && styles.selectCheckboxWrapper}>
      <Slide visible={visible} width={32}>
        <CheckboxView value={selected} />
      </Slide>
    </View>
  );
});

const DotsMenu = memo(function DotsMenu(): JSX.Element {
  const menuItems = useLeafRowContextMenuItems();
  const targetRef = useRef<View>(null);
  const [visible, setVisible] = useState(false);

  const handlePress = useCallback(() => {
    setVisible(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <View style={styles.dotsMenuWrapper}>
      <PressableHighlight
        onPress={handlePress}
        ref={targetRef}
        style={styles.dotsMenuButton}
      >
        <Icon name="Dots" />
      </PressableHighlight>
      <Popover
        visible={visible}
        targetRef={targetRef}
        content={<ContextMenu menuItems={menuItems} />}
        onRequestClose={handleRequestClose}
      />
    </View>
  );
});

interface CheckboxCellProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
}

const CheckboxCell = memo(function CheckboxCell(props: CheckboxCellProps) {
  const { value } = props;
  const { documentID, fieldID } = useLeafRowCellContext();
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation<BooleanFieldKindValue>();

  const handleToggle = useCallback(async () => {
    const checked = !value;
    await updateDocumentFieldValue(documentID, fieldID, checked);
  }, [updateDocumentFieldValue, documentID, fieldID, value]);

  useCellKeyBindings({
    onEnter: handleToggle,
  });

  return (
    <View style={[styles.cellValueContainer, styles.checkboxCellRoot]}>
      <CheckboxAlt value={value} onChange={handleToggle} />
    </View>
  );
});

interface CurrencyCellProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
}

const CurrencyCell = memo(function CurrencyCell(props: CurrencyCellProps) {
  const { value, field } = props;
  const {
    cell,
    onFocusNextDocument,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();
  useNumberFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <InputWrapper>
        <NumberInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onFocusNextDocument}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      {value ? (
        <Text numberOfLines={1} align="right">
          {formatCurrency(value, getSystemLocale(), field.currency)}
        </Text>
      ) : null}
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellRoot} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
}

const DateCell = memo(function DateCell(props: DateCellProps) {
  const { value } = props;
  const { cell } = useLeafRowCellContext();
  const handleChange = useFieldValueChangeHandler();
  useCellKeyBindings();

  const handleChangeDate = useCallback(
    async (date: Date) => {
      await handleChange(formatISODate(date));
    },
    [handleChange],
  );

  const child = (
    <View style={styles.cellValueContainer}>
      {value ? (
        <Text numberOfLines={1} align="right">
          {formatDate(parseISODate(value), getSystemLocale())}
        </Text>
      ) : null}
    </View>
  );

  if (cell.state === 'default') {
    return child;
  }

  return (
    <PickerTrigger
      content={
        <DatePicker
          value={value ? parseISODate(value) : null}
          onChange={handleChangeDate}
        />
      }
    >
      {child}
    </PickerTrigger>
  );
});

interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

const EmailCell = memo(function EmailCell(props: EmailCellProps) {
  const { value } = props;
  const {
    cell,
    onStartEditing,
    onStopEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();
  useTextFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onFocusNextDocument}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View style={styles.cellRoot}>
        <Pressable style={styles.cellRoot} onPress={onStartEditing}>
          {child}
        </Pressable>
        <View style={styles.actionsWrapper}>
          <EmailLink email={value} text="Send link" />
        </View>
      </View>
    );
  }

  return child;
});

interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

const MultiCollaboratorCell = memo(function MultiCollaboratorCell(
  props: MultiCollaboratorCellProps,
) {
  const { value } = props;
  const { cell, onStopEditing } = useLeafRowCellContext();
  const handleChange = useFieldValueChangeHandler();
  useCellKeyBindings();

  const child = (
    <View style={styles.cellValueContainer}>
      <CollaboratorBadgeList collaboratorIDs={value} />
    </View>
  );

  if (cell.state === 'default') {
    return child;
  }

  return (
    <PickerTrigger
      content={
        <CollaboratorMultiPicker
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
        />
      }
    >
      {child}
    </PickerTrigger>
  );
});

interface MultiDocumentLinkCellProps {
  value: MultiDocumentLinkFieldValue;
  field: MultiDocumentLinkField;
}

const MultiDocumentLinkCell = memo(function MultiDocumentLinkCell(
  props: MultiDocumentLinkCellProps,
) {
  const { value } = props;

  useCellKeyBindings();

  const child = (
    <View style={styles.cellValueContainer}>
      <DocumentLinkBadgeList documentIDs={value} />
    </View>
  );

  return <View style={styles.cellRoot}>{child}</View>;
});

interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

const MultiLineTextCell = memo(function MultiLineTextCell(
  props: MultiLineTextCellProps,
) {
  const { value } = props;
  const {
    cell,
    onFocusNextDocument,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();
  useTextFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <TextInput
        numberOfLines={4}
        autoFocus
        value={value}
        onChange={handleChange}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
        style={styles.input}
      />
    );
  }

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.multiLineTextFocused} onPress={onStartEditing}>
        <Text>{value}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.cellValueContainer}>
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
  const { cell, onStopEditing } = useLeafRowCellContext();
  const handleChange = useFieldValueChangeHandler();
  useCellKeyBindings();

  const child = (
    <View style={styles.cellValueContainer}>
      <OptionBadgeList optionIDs={value} field={field} />
    </View>
  );

  if (cell.state === 'default') {
    return child;
  }

  return (
    <PickerTrigger
      content={
        <MultiOptionPicker
          value={value}
          field={field}
          onChange={handleChange}
          onRequestClose={onStopEditing}
        />
      }
    >
      {child}
    </PickerTrigger>
  );
});

interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

const NumberCell = memo(function NumberCell(props: NumberCellProps) {
  const { value, field } = props;
  const {
    cell,
    onFocusNextDocument,
    onStopEditing,
    onStartEditing,
  } = useLeafRowCellContext();
  useNumberFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <InputWrapper>
        <NumberInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onFocusNextDocument}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <Text align="right" numberOfLines={1}>
        {formatNumberFieldValue(value, field)}
      </Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellRoot} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

const PhoneNumberCell = memo(function PhoneNumberCell(
  props: PhoneNumberCellProps,
) {
  const { value } = props;
  const {
    cell,
    onStopEditing,
    onFocusNextDocument,
    onStartEditing,
  } = useLeafRowCellContext();
  useTextFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onFocusNextDocument}
          style={styles.input}
        />
      </InputWrapper>
    );
  }
  const child = (
    <View style={styles.cellValueContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View style={styles.cellRoot}>
        <Pressable style={styles.cellRoot} onPress={onStartEditing}>
          {child}
        </Pressable>
        <View style={styles.actionsWrapper}>
          <PhoneNumberLink phoneNumber={value} text="Call" />
        </View>
      </View>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

const SingleCollaboratorCell = memo(function SingleCollaboratorCell(
  props: SingleCollaboratorCellProps,
) {
  const { value } = props;
  const { cell, onStopEditing } = useLeafRowCellContext();
  const handleChange = useFieldValueChangeHandler();
  useCellKeyBindings();

  const child = value ? (
    <View style={styles.cellValueContainer}>
      <CollaboratorBadge collaboratorID={value} />
    </View>
  ) : null;

  if (cell.state === 'default') {
    return child;
  }

  return (
    <PickerTrigger
      content={
        <CollaboratorPicker
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
        />
      }
    >
      {child}
    </PickerTrigger>
  );
});

interface SingleDocumentLinkCellProps {
  value: SingleDocumentLinkFieldValue;
  field: SingleDocumentLinkField;
}

const SingleDocumentLinkCell = memo(function SingleDocumentLinkCell(
  props: SingleDocumentLinkCellProps,
) {
  const { value } = props;
  const { cell, onStartEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const child = value ? (
    <View style={styles.cellValueContainer}>
      <DocumentLinkBadge documentID={value} />
    </View>
  ) : null;

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellRoot} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextCell = memo(function SingleLineTextCell(
  props: SingleLineTextCellProps,
) {
  const { value } = props;
  const {
    cell,
    onStopEditing,
    onStartEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();
  useTextFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onFocusNextDocument}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <Text numberOfLines={1}>{value}</Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <Pressable style={styles.cellRoot} onPress={onStartEditing}>
        {child}
      </Pressable>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

const SingleOptionCell = memo(function SingleOptionCell(
  props: SingleOptionCellProps,
) {
  const { value, field } = props;
  const { cell, onStopEditing } = useLeafRowCellContext();
  const handleChange = useFieldValueChangeHandler();
  useCellKeyBindings();

  const selected = field.options.find((o) => o.id === value);

  const child = selected ? (
    <View style={styles.cellValueContainer}>
      <OptionBadge option={selected} />
    </View>
  ) : null;

  if (cell.state === 'default') {
    return child;
  }

  return (
    <PickerTrigger
      content={
        <SingleOptionPicker
          value={value}
          onChange={handleChange}
          field={field}
          onRequestClose={onStopEditing}
        />
      }
    >
      {child}
    </PickerTrigger>
  );
});

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

const URLCell = memo(function URLCell(props: URLCellProps) {
  const { value } = props;
  const {
    cell,
    onStartEditing,
    onStopEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();
  useTextFieldKindCellKeyBindings();
  const handleChange = useFieldValueChangeHandler();

  if (cell.state === 'editing') {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onFocusNextDocument}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <Text decoration="underline" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View style={styles.cellRoot}>
        <Pressable style={styles.cellRoot} onPress={onStartEditing}>
          {child}
        </Pressable>
        <View style={styles.actionsWrapper}>
          <URLLink url={value} text="Open" />
        </View>
      </View>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

function useTextFieldKindCellKeyBindings() {
  const { onStartEditing, documentID, fieldID } = useLeafRowCellContext();
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handlePrintableKey = useCallback(
    async (key: string) => {
      await updateDocumentFieldValue(documentID, fieldID, key);
      onStartEditing();
    },
    [onStartEditing, updateDocumentFieldValue, documentID, fieldID],
  );

  useCellKeyBindings({
    onPrintableKey: handlePrintableKey,
  });
}

function useNumberFieldKindCellKeyBindings() {
  const { onStartEditing, documentID, fieldID } = useLeafRowCellContext();
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handlePrintableKey = useCallback(
    async (key: string) => {
      if (isNumberString(key) === false) {
        return;
      }

      await updateDocumentFieldValue(documentID, fieldID, toNumber(key));
      onStartEditing();
    },
    [onStartEditing, updateDocumentFieldValue, documentID, fieldID],
  );

  useCellKeyBindings({
    onPrintableKey: handlePrintableKey,
  });
}

function useFieldValueChangeHandler() {
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();
  const { documentID, fieldID } = useLeafRowCellContext();

  return useCallback(
    async (nextValue: FieldValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );
}

interface InputWrapperProps {
  children: React.ReactNode;
}

function InputWrapper(props: InputWrapperProps) {
  const { children } = props;
  const { onStopEditing } = useLeafRowCellContext();

  return (
    <View>
      {children}
      <View style={styles.inputWrapper}>
        <FlatButton onPress={onStopEditing} title="Done" color="primary" />
      </View>
    </View>
  );
}

interface PickerWrapperProps {
  multi?: boolean;
  children: React.ReactNode;
}

function PickerWrapper(props: PickerWrapperProps): JSX.Element {
  const { children, multi } = props;
  const { onStopEditing } = useLeafRowCellContext();
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();
  const { documentID, fieldID } = useLeafRowCellContext();

  const handleClear = useCallback(async () => {
    const nextValue: FieldValue = multi ? [] : null;
    await updateDocumentFieldValue(documentID, fieldID, nextValue);
  }, [updateDocumentFieldValue, documentID, fieldID, multi]);

  return (
    <View>
      {children}
      <Spacer size={16} />
      <View style={styles.inputWrapper}>
        <FlatButton onPress={handleClear} title="Clear all" />
        <FlatButton onPress={onStopEditing} title="Done" color="primary" />
      </View>
    </View>
  );
}

interface PickerTriggerProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

function PickerTrigger(props: PickerTriggerProps): JSX.Element {
  const { children, content } = props;
  const { cell, onStartEditing, onStopEditing } = useLeafRowCellContext();
  const targetRef = useRef<View>(null);

  return (
    <View>
      <Pressable ref={targetRef} onPress={onStartEditing}>
        {children}
      </Pressable>
      <Popover
        targetRef={targetRef}
        onRequestClose={onStopEditing}
        visible={cell.state === 'editing'}
        content={<PickerWrapper>{content}</PickerWrapper>}
      />
    </View>
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
    rowToDocumentIDCache,
    columnToFieldIDCache,
    lastFocusableRow,
    lastFocusableColumn,
    onOpenDocument,
  } = useListViewViewContext();
  const { cell } = useLeafRowCellContext();
  const setActiveCell = useSetRecoilState(activeCellState);

  // Listen for keyboard strokes only when the cell is focused
  const active = cell !== null && cell.state === 'focused';

  const onArrowDown = useCallback(() => {
    const { row, column, path, last } = cell;
    const nextRow = row + 1;
    const next = rowToDocumentIDCache.get([...cell.path, nextRow]);

    if (next === undefined) {
      return;
    }

    setActiveCell({
      type: 'leaf',
      row: nextRow,
      column,
      path,
      state: 'focused',
      last,
    });
  }, [cell, setActiveCell, rowToDocumentIDCache]);

  const onArrowUp = useCallback(() => {
    const { row, column, path, last } = cell;
    const prevRow = row - 1;
    const prev = rowToDocumentIDCache.get([...cell.path, prevRow]);

    if (prev === undefined) {
      return;
    }

    setActiveCell({
      type: 'leaf',
      row: prevRow,
      column,
      path,
      state: 'focused',
      last,
    });
  }, [cell, setActiveCell, rowToDocumentIDCache]);

  const onArrowLeft = useCallback(() => {
    const { row, column, path, last } = cell;
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
      last,
    });
  }, [cell, setActiveCell, columnToFieldIDCache]);

  const onArrowRight = useCallback(() => {
    const { row, column, path, last } = cell;
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
      last,
    });
  }, [cell, setActiveCell, columnToFieldIDCache]);

  const onMetaArrowDown = useCallback(() => {
    const { column, last } = cell;

    if (lastFocusableRow !== undefined) {
      setActiveCell({
        type: 'leaf',
        row: lastFocusableRow.row,
        column,
        path: lastFocusableRow.path,
        state: 'focused',
        last,
      });
    }
  }, [cell, setActiveCell, lastFocusableRow]);

  const onMetaArrowUp = useCallback(() => {
    const { column, last } = cell;

    setActiveCell({
      type: 'leaf',
      row: 1,
      column,
      path: [0],
      state: 'focused',
      last,
    });
  }, [cell, setActiveCell]);

  const onMetaArrowLeft = useCallback(() => {
    const { row, path, last } = cell;
    const prevColumn = 1;

    setActiveCell({
      type: 'leaf',
      row,
      column: prevColumn,
      path,
      state: 'focused',
      last,
    });
  }, [cell, setActiveCell]);

  const onMetaArrowRight = useCallback(() => {
    const { row, path, last } = cell;
    const nextColumn = lastFocusableColumn;

    setActiveCell({
      type: 'leaf',
      row,
      column: nextColumn,
      path,
      state: 'focused',
      last,
    });
  }, [cell, setActiveCell, lastFocusableColumn]);

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
    const { row, column, path, last } = cell;

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
      last,
    });
  }, [cell, setActiveCell, onEnterOverride]);

  const onSpace = useCallback(() => {
    const { row, path } = cell;
    const documentID = rowToDocumentIDCache.get([...path, row]);

    if (documentID === undefined) {
      throw new Error('onSpace called on faulty row path');
    }

    onOpenDocument(documentID);
  }, [cell, onOpenDocument, rowToDocumentIDCache]);

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

export function LastLeafRowCell(): JSX.Element {
  const themeStyles = useThemeStyles();

  return <View style={[styles.lastLeafRowCell, themeStyles.border.default]} />;
}

const styles = StyleSheet.create({
  leafRowCell: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  bottomBorder: {
    borderBottomWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  focused: {
    borderRadius: tokens.border.radius,
    position: 'absolute',
    top: -1,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    zIndex: 1,
  },
  lastLeafRowCell: {
    height: LEAF_ROW_HEIGHT,
    borderLeftWidth: 1,
  },
  primaryCell: {
    borderRightWidth: 2,
  },
  checkboxCellRoot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiLineTextFocused: {
    padding: 8,
    maxHeight: 400,
    overflow: 'hidden',
  },
  cellRoot: {
    flex: 1,
    overflowX: 'hidden',
  },
  cellValueContainer: {
    height: LEAF_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  actionsWrapper: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  inputWrapper: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dotsMenuWrapper: {
    paddingRight: 8,
  },
  dotsMenuButton: {
    borderRadius: 999,
  },
  selectCheckboxWrapper: {
    paddingLeft: 8,
  },
});
