import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Document,
  DocumentID,
  generateDocumentID,
} from "../../../models/documents";
import {
  BooleanFieldKindValue,
  FieldID,
  formatNumberFieldValue,
  generateFieldID,
  stringifyFieldValue,
} from "../../../models/fields";
import { CloseButton } from "../../components/close_button";
import { Column } from "../../components/column";
import { Delay } from "../../components/delay";
import { Fade } from "../../components/fade";
import { Spacer } from "../../components/spacer";
import { Text } from "../../components/text";
import { tokens } from "../../components/tokens";
import {
  useDocumentFieldValuesEntriesQuery,
  useDocumentPrimaryFieldValueQuery,
  useDocumentQuery,
} from "../../store/queries";
import {
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiSelectFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleSelectFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertURLFieldValue,
  CheckboxField,
  CheckboxFieldValue,
  CurrencyField,
  CurrencyFieldValue,
  DateField,
  DateFieldValue,
  EmailField,
  EmailFieldValue,
  Field,
  FieldType,
  FieldValue,
  MultiCollaboratorField,
  MultiCollaboratorFieldValue,
  MultiLineTextField,
  MultiLineTextFieldValue,
  MultiSelectField,
  MultiSelectFieldValue,
  MultiDocumentLinkField,
  MultiDocumentLinkFieldValue,
  NumberField,
  NumberFieldValue,
  PhoneNumberField,
  PhoneNumberFieldValue,
  SingleCollaboratorField,
  SingleCollaboratorFieldValue,
  SingleLineTextField,
  SingleLineTextFieldValue,
  SingleSelectField,
  SingleSelectFieldValue,
  SingleDocumentLinkField,
  SingleDocumentLinkFieldValue,
  URLField,
  URLFieldValue,
} from "../../../models/fields";
import { Row } from "../../components/row";
import { Icon } from "../../components/icon";
import { getFieldIcon } from "../../core/views/icon_helpers";
import { TextInput } from "../../components/text_input";
import { useUpdateDocumentFieldValueMutation } from "../../store/mutations";
import { Button } from "../../components/button";
import { URLLink } from "../../components/url_link";
import { EmailLink } from "../../components/email_link";
import { PhoneNumberLink } from "../../components/phone_number_link";
import { NumberInput } from "../../components/number_input";
import { formatCurrency } from "../../../lib/currency";
import { getSystemLocale } from "../../lib/locale";
import { CollaboratorMultiPicker } from "../../core/collaborators/collaborator_multi_picker";
import { CollaboratorBadgeList } from "../../core/collaborators/collaborator_badge_list";
import { Popover } from "../../components/popover";
import { MultiSelectPicker } from "../../core/select/multi_select_picker";
import { OptionBadgeList } from "../../core/select/option_badge_list";
import { DocumentLinkBadgeList } from "../../core/document_link/document_link_badge_list";
import { CollaboratorPicker } from "../../core/collaborators/collaborator_picker";
import { CollaboratorBadge } from "../../core/collaborators/collaborator_badge";
import { SingleSelectPicker } from "../../core/select/single_select_picker";
import { OptionBadge } from "../../core/select/option_badge";
import { DocumentLinkBadge } from "../../core/document_link/document_link_badge";
import { CheckboxAlt } from "../../components/checkbox_alt";
import { DatePicker } from "../../components/date_picker";
import {
  formatDate,
  formatISODate,
  parseISODate,
} from "../../../lib/date_utils";
import { PressableHighlight } from "../../components/pressable_highlight";
import { theme } from "../../components/theme";

export interface DocumentDetailsViewProps {
  documentID: DocumentID;
  onClose: () => void;
}

export function DocumentDetailsView(
  props: DocumentDetailsViewProps
): JSX.Element {
  const { documentID, onClose } = props;
  const document = useDocumentQuery(documentID);
  const [primaryField, primaryFieldValue] = useDocumentPrimaryFieldValueQuery(
    document.id
  );

  return (
    <View style={styles.documentDetailsWrapper}>
      <View style={styles.documentDetailsHeader}>
        <CloseButton onPress={onClose} />
        <Spacer direction="row" size={16} />
        <Text size="xl">
          {stringifyFieldValue(primaryField, primaryFieldValue)}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.documentDetailsView}>
          <Delay config={tokens.animation.fast}>
            <Fade config={tokens.animation.fast}>
              <DocumentFieldValues document={document} />
            </Fade>
          </Delay>
        </View>
      </ScrollView>
    </View>
  );
}

interface DocumentFieldValuesProps {
  document: Document;
}

function DocumentFieldValues(props: DocumentFieldValuesProps) {
  const { document } = props;
  const documentFieldsEntries = useDocumentFieldValuesEntriesQuery(document.id);

  return (
    <View>
      <Spacer size={24} />
      <Column spacing={16}>
        {documentFieldsEntries.map(([field, value]) => (
          <DocumentField
            key={field.id}
            documentID={document.id}
            field={field}
            value={value}
          />
        ))}
      </Column>
    </View>
  );
}

interface DocumentFieldProps {
  field: Field;
  documentID: DocumentID;
  value: FieldValue;
}

const DocumentField = memo(function DocumentField(
  props: DocumentFieldProps
): JSX.Element {
  const { documentID, field, value } = props;
  const [editing, setEditing] = useState(false);

  const renderField = useCallback((): JSX.Element => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return <CheckboxField field={field} value={value} />;
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return <CurrencyField field={field} value={value} />;
      case FieldType.Date:
        assertDateFieldValue(value);
        return <DateField field={field} value={value} />;
      case FieldType.Email:
        assertEmailFieldValue(value);
        return <EmailField field={field} value={value} />;
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return <MultiCollaboratorField field={field} value={value} />;
      case FieldType.MultiDocumentLink:
        assertMultiDocumentLinkFieldValue(value);
        return <MultiDocumentLinkField field={field} value={value} />;
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return <MultiLineTextField field={field} value={value} />;
      case FieldType.MultiSelect:
        assertMultiSelectFieldValue(value);
        return <MultiSelectField field={field} value={value} />;
      case FieldType.Number:
        assertNumberFieldValue(value);
        return <NumberField field={field} value={value} />;
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return <PhoneNumberField field={field} value={value} />;
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return <SingleCollaboratorField field={field} value={value} />;
      case FieldType.SingleDocumentLink:
        assertSingleDocumentLinkFieldValue(value);
        return <SingleDocumentLinkField field={field} value={value} />;
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return <SingleLineTextField field={field} value={value} />;
      case FieldType.SingleSelect:
        assertSingleSelectFieldValue(value);
        return <SingleSelectField field={field} value={value} />;
      case FieldType.URL:
        assertURLFieldValue(value);
        return <URLField field={field} value={value} />;
    }
  }, [field, value]);

  const context: DocumentFieldContext = useMemo(() => {
    return {
      editing,
      documentID,
      fieldID: field.id,
      onStartEditing: () => setEditing(true),
      onStopEditing: () => setEditing(false),
    };
  }, [documentID, field, editing]);

  return (
    <DocumentFieldContext.Provider value={context}>
      <FieldWrapper field={field}>{renderField()}</FieldWrapper>
    </DocumentFieldContext.Provider>
  );
});

interface DocumentFieldContext {
  documentID: DocumentID;
  fieldID: FieldID;
  editing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
}

const DocumentFieldContext = createContext<DocumentFieldContext>({
  documentID: generateDocumentID(),
  fieldID: generateFieldID(),
  editing: false,
  onStartEditing: () => {
    return;
  },
  onStopEditing: () => {
    return;
  },
});

function useDocumentFieldContext(): DocumentFieldContext {
  return useContext(DocumentFieldContext);
}

interface SingleLineTextFieldProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

function SingleLineTextField(props: SingleLineTextFieldProps) {
  const { value } = props;
  const { onStartEditing, onStopEditing, editing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing) {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onStopEditing}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  return (
    <PressableHighlight style={styles.borderWrapper} onPress={onStartEditing}>
      <View style={styles.cellValueContainer}>
        <Text numberOfLines={1}>{value}</Text>
      </View>
    </PressableHighlight>
  );
}

interface URLFieldProps {
  value: URLFieldValue;
  field: URLField;
}

function URLField(props: URLFieldProps) {
  const { value } = props;
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing) {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onStopEditing}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  return (
    <View>
      <PressableHighlight style={styles.borderWrapper} onPress={onStartEditing}>
        <View style={styles.cellValueContainer}>
          <Text decoration="underline" numberOfLines={1}>
            {value}
          </Text>
        </View>
      </PressableHighlight>
      {value && (
        <View style={styles.actionsWrapper}>
          <URLLink url={value} text="Open" />
        </View>
      )}
    </View>
  );
}

interface EmailFieldProps {
  value: EmailFieldValue;
  field: EmailField;
}

function EmailField(props: EmailFieldProps) {
  const { value } = props;
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing) {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onStopEditing}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  return (
    <View>
      <PressableHighlight style={styles.borderWrapper} onPress={onStartEditing}>
        <View style={styles.cellValueContainer}>
          <Text decoration="underline" numberOfLines={1}>
            {value}
          </Text>
        </View>
      </PressableHighlight>
      {value && (
        <View style={styles.actionsWrapper}>
          <EmailLink email={value} text="Send link" />
        </View>
      )}
    </View>
  );
}

interface MultiLineTextFieldProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

function MultiLineTextField(props: MultiLineTextFieldProps) {
  const { value } = props;
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing) {
    return (
      <InputWrapper>
        <TextInput
          numberOfLines={10}
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          style={styles.multiline}
        />
      </InputWrapper>
    );
  }

  return (
    <PressableHighlight
      style={[styles.multiLineTextFocused, styles.borderWrapper]}
      onPress={onStartEditing}
    >
      <Text>{value}</Text>
    </PressableHighlight>
  );
}

interface PhoneNumberFieldProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

function PhoneNumberField(props: PhoneNumberFieldProps) {
  const { value } = props;
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing === true) {
    return (
      <InputWrapper>
        <TextInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onStopEditing}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  return (
    <View>
      <PressableHighlight style={styles.borderWrapper} onPress={onStartEditing}>
        <View style={styles.cellValueContainer}>
          <Text decoration="underline" numberOfLines={1}>
            {value}
          </Text>
        </View>
      </PressableHighlight>
      {value && (
        <View style={styles.actionsWrapper}>
          <PhoneNumberLink phoneNumber={value} text="Call" />
        </View>
      )}
    </View>
  );
}

interface NumberFieldProps {
  value: NumberFieldValue;
  field: NumberField;
}

function NumberField(props: NumberFieldProps) {
  const { value, field } = props;
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing === true) {
    return (
      <InputWrapper>
        <NumberInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onStopEditing}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  return (
    <PressableHighlight style={styles.borderWrapper} onPress={onStartEditing}>
      <View style={styles.cellValueContainer}>
        <Text numberOfLines={1}>{formatNumberFieldValue(value, field)}</Text>
      </View>
    </PressableHighlight>
  );
}

interface CurrencyFieldProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
}

function CurrencyField(props: CurrencyFieldProps) {
  const { value, field } = props;
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  if (editing === true) {
    return (
      <InputWrapper>
        <NumberInput
          autoFocus
          value={value}
          onChange={handleChange}
          onRequestClose={onStopEditing}
          onSubmitEditing={onStopEditing}
          style={styles.input}
        />
      </InputWrapper>
    );
  }

  return (
    <PressableHighlight style={styles.borderWrapper} onPress={onStartEditing}>
      <View style={styles.cellValueContainer}>
        {value ? (
          <Text numberOfLines={1} align="right">
            {formatCurrency(value, getSystemLocale(), field.currency)}
          </Text>
        ) : null}
      </View>
    </PressableHighlight>
  );
}

interface MultiCollaboratorFieldProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

function MultiCollaboratorField(props: MultiCollaboratorFieldProps) {
  const { value } = props;
  const { onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

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
      <View style={styles.cellValueContainer}>
        <CollaboratorBadgeList collaboratorIDs={value} />
      </View>
    </PickerTrigger>
  );
}

interface MultiSelectFieldProps {
  value: MultiSelectFieldValue;
  field: MultiSelectField;
}

function MultiSelectField(props: MultiSelectFieldProps) {
  const { value, field } = props;
  const { onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  return (
    <PickerTrigger
      content={
        <MultiSelectPicker
          value={value}
          field={field}
          onChange={handleChange}
          onRequestClose={onStopEditing}
        />
      }
    >
      <View style={styles.cellValueContainer}>
        <OptionBadgeList optionIDs={value} field={field} />
      </View>
    </PickerTrigger>
  );
}

interface MultiDocumentLinkFieldProps {
  value: MultiDocumentLinkFieldValue;
  field: MultiDocumentLinkField;
}

function MultiDocumentLinkField(props: MultiDocumentLinkFieldProps) {
  const { value } = props;

  return (
    <View style={styles.borderWrapper}>
      <View style={styles.cellValueContainer}>
        <DocumentLinkBadgeList documentIDs={value} />
      </View>
    </View>
  );
}

interface SingleCollaboratorFieldProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

function SingleCollaboratorField(props: SingleCollaboratorFieldProps) {
  const { value } = props;
  const { onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

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
      <View style={styles.cellValueContainer}>
        {value && <CollaboratorBadge collaboratorID={value} />}
      </View>
    </PickerTrigger>
  );
}

interface SingleSelectFieldProps {
  value: SingleSelectFieldValue;
  field: SingleSelectField;
}

function SingleSelectField(props: SingleSelectFieldProps) {
  const { value, field } = props;
  const { onStopEditing } = useDocumentFieldContext();
  const handleChange = useFieldValueChangeHandler();

  const selected = field.options.find((o) => o.id === value);

  return (
    <PickerTrigger
      content={
        <SingleSelectPicker
          value={value}
          onChange={handleChange}
          field={field}
          onRequestClose={onStopEditing}
        />
      }
    >
      <View style={styles.cellValueContainer}>
        {selected && <OptionBadge option={selected} />}
      </View>
    </PickerTrigger>
  );
}

interface SingleDocumentLinkFieldProps {
  value: SingleDocumentLinkFieldValue;
  field: SingleDocumentLinkField;
}

function SingleDocumentLinkField(props: SingleDocumentLinkFieldProps) {
  const { value } = props;

  return (
    <View style={styles.borderWrapper}>
      <View style={styles.cellValueContainer}>
        {value && <DocumentLinkBadge documentID={value} />}
      </View>
    </View>
  );
}

interface CheckboxFieldProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
}

function CheckboxField(props: CheckboxFieldProps) {
  const { value } = props;

  const { documentID, fieldID } = useDocumentFieldContext();
  const updateDocumentFieldValue =
    useUpdateDocumentFieldValueMutation<BooleanFieldKindValue>();

  const handleToggle = useCallback(async () => {
    const checked = !value;
    await updateDocumentFieldValue(documentID, fieldID, checked);
  }, [updateDocumentFieldValue, documentID, fieldID, value]);

  return (
    <View style={styles.cellValueContainer}>
      <CheckboxAlt value={value} onChange={handleToggle} />
    </View>
  );
}

interface DateFieldProps {
  value: DateFieldValue;
  field: DateField;
}

function DateField(props: DateFieldProps) {
  const { value } = props;
  const handleChange = useFieldValueChangeHandler();

  const handleChangeDate = useCallback(
    async (date: Date) => {
      await handleChange(formatISODate(date));
    },
    [handleChange]
  );

  return (
    <PickerTrigger
      content={
        <DatePicker
          value={value ? parseISODate(value) : null}
          onChange={handleChangeDate}
        />
      }
    >
      <View style={styles.cellValueContainer}>
        {value ? (
          <Text numberOfLines={1} align="right">
            {formatDate(parseISODate(value), getSystemLocale())}
          </Text>
        ) : null}
      </View>
    </PickerTrigger>
  );
}

function useFieldValueChangeHandler() {
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();
  const { documentID, fieldID } = useDocumentFieldContext();

  return useCallback(
    async (nextValue: FieldValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID]
  );
}

interface FieldWrapperProps {
  field: Field;
  children: React.ReactNode;
}

function FieldWrapper(props: FieldWrapperProps) {
  const { field, children } = props;

  return (
    <View style={styles.fieldWrapper}>
      <Row alignItems="center" spacing={4}>
        <Icon name={getFieldIcon(field.type)} size="sm" />
        <Text size="xs">{field.name.toUpperCase()}</Text>
      </Row>
      <Spacer size={4} />
      {children}
    </View>
  );
}

interface InputWrapperProps {
  children: React.ReactNode;
}

function InputWrapper(props: InputWrapperProps) {
  const { children } = props;
  const { onStopEditing } = useDocumentFieldContext();

  return (
    <View>
      {children}
      <View style={styles.inputWrapper}>
        <Button onPress={onStopEditing} title="Done" color="primary" />
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
  const { documentID, fieldID, onStopEditing } = useDocumentFieldContext();
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleClear = useCallback(async () => {
    const nextValue: FieldValue = multi ? [] : null;
    await updateDocumentFieldValue(documentID, fieldID, nextValue);
  }, [updateDocumentFieldValue, documentID, fieldID, multi]);

  return (
    <View>
      {children}
      <Spacer size={16} />
      <View style={styles.inputWrapper}>
        <Button onPress={handleClear} title="Clear all" />
        <Button onPress={onStopEditing} title="Done" color="primary" />
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
  const { editing, onStartEditing, onStopEditing } = useDocumentFieldContext();
  const targetRef = useRef<View>(null);

  return (
    <View>
      <PressableHighlight
        style={styles.borderWrapper}
        ref={targetRef}
        onPress={onStartEditing}
      >
        {children}
      </PressableHighlight>
      <Popover
        targetRef={targetRef}
        onRequestClose={onStopEditing}
        visible={editing}
        content={<PickerWrapper>{content}</PickerWrapper>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  documentDetailsView: {
    padding: 8,
  },
  documentDetailsWrapper: {
    flex: 1,
  },
  documentDetailsHeader: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldWrapper: {
    paddingBottom: 32,
  },
  multiLineTextFocused: {
    padding: 8,
    minHeight: 40,
    maxHeight: 400,
    overflow: "hidden",
  },
  input: {
    height: 40,
    paddingTop: 1,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.neutral.light,
    borderRadius: tokens.border.radius,
  },
  multiline: {
    padding: 9,
  },
  borderWrapper: {
    borderRadius: tokens.border.radius,
    borderColor: theme.neutral.light,
    borderWidth: 1,
  },
  cellValueContainer: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  inputWrapper: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionsWrapper: {
    padding: 8,
    flexDirection: "row",
  },
});
