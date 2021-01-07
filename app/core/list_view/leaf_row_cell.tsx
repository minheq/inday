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
  StyleSheet,
  StyleProp,
  ViewStyle,
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
import { useLeafRowContext, useLeafRowContextMenuOptions } from './leaf_row';
import { DateValueEdit } from '../fields/date_value_edit';
import { MultiCollaboratorValueEdit } from '../fields/multi_collaborator_value_edit';
import { SingleCollaboratorValueEdit } from '../fields/single_collaborator_value_edit';
import { SingleOptionValueEdit } from '../fields/single_option_value_edit';
import { MultiOptionValueEdit } from '../fields/multi_option_value_edit';
import { MultiDocumentLinkValueEdit } from '../fields/multi_document_link_value_edit';
import { SingleDocumentLinkValueEdit } from '../fields/single_document_link_value_edit';
import { TextKindValueEdit } from '../fields/text_kind_value_edit';
import { NumberKindValueEdit } from '../fields/number_kind_value_edit';
import { MultiLineTextValueEdit } from '../fields/multi_line_text_value_edit';
import { NumberValueView } from '../fields/number_value_view';
import { CheckboxValueEdit } from '../fields/checkbox_value_edit';
import { SingleOptionValueView } from '../fields/single_option_value_view';
import { MultiOptionValueView } from '../fields/multi_option_value_view';
import { MultiCollaboratorValueView } from '../fields/multi_collaborator_value_view';
import { SingleCollaboratorValueView } from '../fields/single_collaborator_value_view';
import { SingleDocumentLinkValueView } from '../fields/single_document_link_value_view';
import { MultiDocumentLinkValueView } from '../fields/multi_document_link_value_view';
import { CurrencyValueView } from '../fields/currency_value_view';
import { DateValueView } from '../fields/date_value_view';
import { EmailValueView } from '../fields/email_value_view';
import { EmailValueActions } from '../fields/email_value_actions';
import { URLValueActions } from '../fields/url_value_actions';
import { PhoneNumberValueActions } from '../fields/phone_number_value_actions';
import { SingleLineTextValueView } from '../fields/single_line_text_value_view';
import { URLValueView } from '../fields/url_value_view';
import { PhoneNumberValueView } from '../fields/phone_number_value_view';
import { assertUnreached } from '../../../lib/lang_utils';
import { Slide } from '../../components/slide';
import { PressableHighlightContextMenu } from '../../components/pressable_highlight_context_menu';
import { Icon } from '../../components/icon';
import { CheckboxStatic } from '../../components/checkbox_static';
import { Spacer } from '../../components/spacer';
import { LEAF_ROW_HEIGHT } from './list_view_constants';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';

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
    (): StyleProp<ViewStyle> => [
      styles.leafRowCell,
      themeStyles.border.default,
      mode === 'edit' && themeStyles.background.content,
      cell.primary && styles.primaryCell,
      cell.state !== 'default' && styles.focusedLeafRowCell,
    ],
    [cell, mode, themeStyles],
  );

  return (
    <Pressable
      accessible={false}
      pointerEvents={cell.state === 'default' ? 'auto' : 'box-none'}
      style={pressableStyle}
      onPress={onPress}
    >
      {cell.primary === true && (
        <SelectCheckbox visible={mode === 'select'} selected={selected} />
      )}
      <Spacer direction="row" size={level * 32} />
      {renderCell()}
      {cell.primary === true && mode === 'edit' && cell.state !== 'editing' && (
        <DotsMenu />
      )}
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
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
        <CheckboxStatic value={selected} />
      </Slide>
    </View>
  );
});

const DotsMenu = memo(function DotsMenu(): JSX.Element {
  const options = useLeafRowContextMenuOptions();

  return (
    <View style={styles.dotsMenuWrapper}>
      <PressableHighlightContextMenu
        options={options}
        style={styles.dotsMenuButton}
      >
        <Icon name="Dots" />
      </PressableHighlightContextMenu>
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
    <View style={[styles.cellRoot, styles.checkboxCellRoot]}>
      <CheckboxValueEdit onChange={handleToggle} value={value} />
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
    fieldID,
    documentID,
    onFocusNextDocument,
    onStopEditing,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <NumberKindValueEdit
        autoFocus
        fieldID={fieldID}
        documentID={documentID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <CurrencyValueView value={value} field={field} />
    </View>
  );

  if (cell.state === 'focused') {
    return <NumberFieldKindCellFocused>{child}</NumberFieldKindCellFocused>;
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface NumberFieldKindCellFocusedProps {
  children: React.ReactNode;
}

function NumberFieldKindCellFocused(props: NumberFieldKindCellFocusedProps) {
  const { children } = props;
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

  return (
    <Pressable style={styles.cellRoot} onPress={onStartEditing}>
      {children}
    </Pressable>
  );
}

interface TextFieldKindCellFocusedProps {
  children: React.ReactNode;
}

function TextFieldKindCellFocused(props: TextFieldKindCellFocusedProps) {
  const { children } = props;
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

  return (
    <Pressable style={styles.cellRoot} onPress={onStartEditing}>
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
  const { documentID, fieldID, cell, onStopEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  const child = (
    <View style={styles.cellValueContainer}>
      <DateValueView value={value} field={field} />
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <DateValueEdit
        documentID={documentID}
        fieldID={fieldID}
        onRequestClose={onStopEditing}
      />
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

const EmailCell = memo(function EmailCell(props: EmailCellProps) {
  const { value, field } = props;
  const {
    cell,
    documentID,
    fieldID,
    onStopEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <TextKindValueEdit
        autoFocus
        fieldID={fieldID}
        documentID={documentID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <EmailValueView value={value} field={field} />
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View style={styles.cellRoot}>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <View style={styles.actionsWrapper}>
          <EmailValueActions value={value} />
        </View>
      </View>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
});

interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

const MultiCollaboratorCell = memo(function MultiCollaboratorCell(
  props: MultiCollaboratorCellProps,
) {
  const { value, field } = props;
  const { documentID, fieldID, cell, onStopEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'focused') {
    return (
      <MultiCollaboratorValueEdit
        documentID={documentID}
        fieldID={fieldID}
        onRequestClose={onStopEditing}
      />
    );
  }

  return (
    <View style={styles.cellRoot}>
      <View style={styles.cellValueContainer}>
        <MultiCollaboratorValueView value={value} field={field} />
      </View>
    </View>
  );
});

interface MultiDocumentLinkCellProps {
  value: MultiDocumentLinkFieldValue;
  field: MultiDocumentLinkField;
}

const MultiDocumentLinkCell = memo(function MultiDocumentLinkCell(
  props: MultiDocumentLinkCellProps,
) {
  const { value, field } = props;
  const {
    documentID,
    fieldID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <MultiDocumentLinkValueEdit
        documentID={documentID}
        fieldID={fieldID}
        collectionID={field.documentsFromCollectionID}
        onRequestClose={onStopEditing}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <MultiDocumentLinkValueView value={value} field={field} />
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
    documentID,
    fieldID,
    onFocusNextDocument,
    onStopEditing,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <MultiLineTextValueEdit
        autoFocus
        documentID={documentID}
        fieldID={fieldID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }

  if (cell.state === 'focused') {
    return (
      <TextFieldKindCellFocused>
        <View style={styles.multiLineTextFocused}>
          <Text>{value}</Text>
        </View>
      </TextFieldKindCellFocused>
    );
  }

  return (
    <View style={styles.cellRoot}>
      <View style={styles.cellValueContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
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
  const { documentID, fieldID, onStopEditing, cell } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'focused') {
    return (
      <MultiOptionValueEdit
        documentID={documentID}
        fieldID={fieldID}
        onRequestClose={onStopEditing}
      />
    );
  }

  return <MultiOptionValueView value={value} field={field} />;
});

interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

const NumberCell = memo(function NumberCell(props: NumberCellProps) {
  const { value, field } = props;
  const {
    cell,
    fieldID,
    documentID,
    onFocusNextDocument,
    onStopEditing,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <NumberKindValueEdit
        autoFocus
        fieldID={fieldID}
        documentID={documentID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <NumberValueView field={field} value={value} />
    </View>
  );

  if (cell.state === 'focused') {
    return <NumberFieldKindCellFocused>{child}</NumberFieldKindCellFocused>;
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
  const { value, field } = props;
  const {
    cell,
    documentID,
    fieldID,
    onStopEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <TextKindValueEdit
        autoFocus
        fieldID={fieldID}
        documentID={documentID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }
  const child = (
    <View style={styles.cellValueContainer}>
      <PhoneNumberValueView value={value} field={field} />
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View style={styles.cellRoot}>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <View style={styles.actionsWrapper}>
          <PhoneNumberValueActions value={value} />
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
  const { value, field } = props;
  const { documentID, fieldID, cell, onStopEditing } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'focused') {
    return (
      <SingleCollaboratorValueEdit
        documentID={documentID}
        fieldID={fieldID}
        onRequestClose={onStopEditing}
      />
    );
  }

  return (
    <View style={styles.cellRoot}>
      <View style={styles.cellValueContainer}>
        <SingleCollaboratorValueView value={value} field={field} />
      </View>
    </View>
  );
});

interface SingleDocumentLinkCellProps {
  value: SingleDocumentLinkFieldValue;
  field: SingleDocumentLinkField;
}

const SingleDocumentLinkCell = memo(function SingleDocumentLinkCell(
  props: SingleDocumentLinkCellProps,
) {
  const { value, field } = props;
  const {
    documentID,
    fieldID,
    cell,
    onStartEditing,
    onStopEditing,
  } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'editing') {
    return (
      <SingleDocumentLinkValueEdit
        documentID={documentID}
        fieldID={fieldID}
        collectionID={field.documentsFromCollectionID}
        onRequestClose={onStopEditing}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <SingleDocumentLinkValueView value={value} field={field} />
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

interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextCell = memo(function SingleLineTextCell(
  props: SingleLineTextCellProps,
) {
  const { value, field } = props;
  const {
    cell,
    documentID,
    fieldID,
    onStopEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <TextKindValueEdit
        autoFocus
        fieldID={fieldID}
        documentID={documentID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <SingleLineTextValueView value={value} field={field} />
    </View>
  );

  if (cell.state === 'focused') {
    return <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>;
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
  const { documentID, fieldID, onStopEditing, cell } = useLeafRowCellContext();

  useCellKeyBindings();

  if (cell.state === 'focused') {
    return (
      <SingleOptionValueEdit
        documentID={documentID}
        fieldID={fieldID}
        onRequestClose={onStopEditing}
      />
    );
  }

  return (
    <View style={styles.cellRoot}>
      <View style={styles.cellValueContainer}>
        <SingleOptionValueView value={value} field={field} />
      </View>
    </View>
  );
});

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

const URLCell = memo(function URLCell(props: URLCellProps) {
  const { value, field } = props;
  const {
    cell,
    documentID,
    fieldID,
    onStopEditing,
    onFocusNextDocument,
  } = useLeafRowCellContext();

  if (cell.state === 'editing') {
    return (
      <TextKindValueEdit
        autoFocus
        fieldID={fieldID}
        documentID={documentID}
        onRequestClose={onStopEditing}
        onSubmitEditing={onFocusNextDocument}
      />
    );
  }

  const child = (
    <View style={styles.cellValueContainer}>
      <URLValueView value={value} field={field} />
    </View>
  );

  if (cell.state === 'focused') {
    return (
      <View style={styles.cellRoot}>
        <TextFieldKindCellFocused>{child}</TextFieldKindCellFocused>
        <View style={styles.actionsWrapper}>
          <URLValueActions value={value} />
        </View>
      </View>
    );
  }

  return <View style={styles.cellRoot}>{child}</View>;
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
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusedLeafRowCell: {
    height: 'auto',
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
  },
  cellRoot: {
    flex: 1,
  },
  cellValueContainer: {
    height: LEAF_ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  actionsWrapper: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
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
