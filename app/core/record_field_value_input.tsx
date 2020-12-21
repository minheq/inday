import React, { memo, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { Text } from '../components/text';
import {
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertMultiRecordLinkFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertSingleRecordLinkFieldValue,
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
  MultiOptionField,
  MultiOptionFieldValue,
  MultiRecordLinkField,
  MultiRecordLinkFieldValue,
  NumberField,
  NumberFieldValue,
  PhoneNumberField,
  PhoneNumberFieldValue,
  SingleCollaboratorField,
  SingleCollaboratorFieldValue,
  SingleLineTextField,
  SingleLineTextFieldValue,
  SingleOptionField,
  SingleOptionFieldValue,
  SingleRecordLinkField,
  SingleRecordLinkFieldValue,
  URLField,
  URLFieldValue,
} from '../data/fields';
import { Record, RecordID } from '../data/records';
import { FieldTextKindValueEdit } from './field_text_kind_value_edit';
import { FieldNumberKindValueEdit } from './field_number_kind_value_edit';
import { FieldCheckboxValueEdit } from './field_checkbox_value_edit';
import { FieldMultiCollaboratorValueEdit } from './field_multi_collaborator_value_edit';
import { FieldMultiOptionValueEdit } from './field_multi_option_value_edit';
import { FieldMultiRecordLinkValueEdit } from './field_multi_record_link_value_edit';
import { FieldSingleCollaboratorValueEdit } from './field_single_collaborator_value_edit';
import { FieldSingleOptionValueEdit } from './field_single_option_value_edit';
import { FieldSingleRecordLinkValueEdit } from './field_single_record_link_value_edit';
import { FieldDateValueEdit } from './field_date_value_edit';
import { PopoverButton } from '../components/popover_button';
import { PopoverCallback } from '../components/popover';
import { tokens } from '../components/tokens';
import { useThemeStyles } from '../components/theme';
import { FieldSingleLineTextValueView } from './field_single_line_text_value_view';
import { FieldURLValueView } from './field_url_value_view';
import { UIKey, WhiteSpaceKey } from '../lib/keyboard';
import { FieldMultiLineTextValueEdit } from './field_multi_line_text_value_edit';
import { FieldPhoneNumberValueView } from './field_phone_number_value_view';
import { FieldMultiLineTextValueView } from './field_multi_line_text_value_view';
import { FieldEmailValueView } from './field_email_value_view';
import { FieldNumberValueView } from './field_number_value_view';
import { FieldCurrencyValueView } from './field_currency_value_view';
import { FieldMultiCollaboratorValueView } from './field_multi_collaborator_value_view';
import { FieldMultiOptionValueView } from './field_multi_option_value_view';
import { FieldMultiRecordLinkValueView } from './field_multi_record_link_value_view';
import { FieldSingleCollaboratorValueView } from './field_single_collaborator_value_view';
import { FieldSingleOptionValueView } from './field_single_option_value_view';
import { FieldSingleRecordLinkValueView } from './field_single_record_link_value_view';
import { FieldDateValueView } from './field_date_value_view';

interface RecordFieldValueEditProps {
  field: Field;
  recordID: RecordID;
  value: FieldValue;
}

export function RecordFieldValueEdit(
  props: RecordFieldValueEditProps,
): JSX.Element {
  const { recordID, field, value } = props;

  const renderCell = useCallback((): JSX.Element => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return <CheckboxCell recordID={recordID} field={field} value={value} />;
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return <CurrencyCell recordID={recordID} field={field} value={value} />;
      case FieldType.Date:
        assertDateFieldValue(value);
        return <DateCell recordID={recordID} field={field} value={value} />;
      case FieldType.Email:
        assertEmailFieldValue(value);
        return <EmailCell recordID={recordID} field={field} value={value} />;
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return (
          <MultiCollaboratorCell
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiRecordLink:
        assertMultiRecordLinkFieldValue(value);
        return (
          <MultiRecordLinkCell
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return (
          <MultiLineTextCell recordID={recordID} field={field} value={value} />
        );
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return (
          <MultiOptionCell recordID={recordID} field={field} value={value} />
        );
      case FieldType.Number:
        assertNumberFieldValue(value);
        return <NumberCell recordID={recordID} field={field} value={value} />;
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return (
          <PhoneNumberCell recordID={recordID} field={field} value={value} />
        );
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return (
          <SingleCollaboratorCell
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleRecordLink:
        assertSingleRecordLinkFieldValue(value);
        return (
          <SingleRecordLinkCell
            recordID={recordID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return (
          <SingleLineTextCell recordID={recordID} field={field} value={value} />
        );
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return (
          <SingleOptionCell recordID={recordID} field={field} value={value} />
        );
      case FieldType.URL:
        assertURLFieldValue(value);
        return <URLCell recordID={recordID} field={field} value={value} />;
    }
  }, [field, value, recordID]);

  return <FieldWrapper field={field}>{renderCell()}</FieldWrapper>;
}

interface SingleLineTextCellProps {
  recordID: RecordID;
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextCell = memo(function SingleLineTextCell(
  props: SingleLineTextCellProps,
) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);
  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldTextKindValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }

  return <FieldSingleLineTextValueView value={value} field={field} />;
});

interface URLCellProps {
  recordID: RecordID;
  value: URLFieldValue;
  field: URLField;
}

const URLCell = memo(function URLCell(props: URLCellProps) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);
  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldTextKindValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }
  return <FieldURLValueView value={value} field={field} />;
});

interface EmailCellProps {
  recordID: RecordID;
  value: EmailFieldValue;
  field: EmailField;
}

const EmailCell = memo(function EmailCell(props: EmailCellProps) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);

  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldTextKindValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }

  return <FieldEmailValueView value={value} field={field} />;
});

interface MultiLineTextCellProps {
  recordID: RecordID;
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

const MultiLineTextCell = memo(function MultiLineTextCell(
  props: MultiLineTextCellProps,
) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);
  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldMultiLineTextValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }

  return <FieldMultiLineTextValueView value={value} field={field} />;
});

interface PhoneNumberCellProps {
  recordID: RecordID;
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

const PhoneNumberCell = memo(function PhoneNumberCell(
  props: PhoneNumberCellProps,
) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);
  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldTextKindValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }

  return <FieldPhoneNumberValueView value={value} field={field} />;
});

interface NumberCellProps {
  recordID: RecordID;
  value: NumberFieldValue;
  field: NumberField;
}

const NumberCell = memo(function NumberCell(props: NumberCellProps) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);
  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldNumberKindValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }

  return <FieldNumberValueView value={value} field={field} />;
});

interface CurrencyCellProps {
  recordID: RecordID;
  value: CurrencyFieldValue;
  field: CurrencyField;
}

const CurrencyCell = memo(function CurrencyCell(props: CurrencyCellProps) {
  const { value, field, recordID } = props;
  const [editing, setEditing] = useState(false);

  const onKeyPress = useCellKeyPressHandler(setEditing);

  if (editing === true) {
    return (
      <FieldNumberKindValueEdit
        recordID={recordID}
        autoFocus
        value={value}
        field={field}
        onKeyPress={onKeyPress}
      />
    );
  }

  return <FieldCurrencyValueView value={value} field={field} />;
});

interface MultiCollaboratorCellProps {
  recordID: RecordID;
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

const MultiCollaboratorCell = memo(function MultiCollaboratorCell(
  props: MultiCollaboratorCellProps,
) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldMultiCollaboratorValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldMultiCollaboratorValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface MultiOptionCellProps {
  recordID: RecordID;
  value: MultiOptionFieldValue;
  field: MultiOptionField;
}

const MultiOptionCell = memo(function MultiOptionCell(
  props: MultiOptionCellProps,
) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldMultiOptionValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldMultiOptionValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface MultiRecordLinkCellProps {
  recordID: RecordID;
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
}

const MultiRecordLinkCell = memo(function MultiRecordLinkCell(
  props: MultiRecordLinkCellProps,
) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldMultiRecordLinkValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldMultiRecordLinkValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface SingleCollaboratorCellProps {
  recordID: RecordID;
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

const SingleCollaboratorCell = memo(function SingleCollaboratorCell(
  props: SingleCollaboratorCellProps,
) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldSingleCollaboratorValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldSingleCollaboratorValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface SingleOptionCellProps {
  recordID: RecordID;
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

const SingleOptionCell = memo(function SingleOptionCell(
  props: SingleOptionCellProps,
) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldSingleOptionValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldSingleOptionValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface SingleRecordLinkCellProps {
  recordID: RecordID;
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
}

const SingleRecordLinkCell = memo(function SingleRecordLinkCell(
  props: SingleRecordLinkCellProps,
) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldSingleRecordLinkValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldSingleRecordLinkValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface CheckboxCellProps {
  recordID: RecordID;
  value: CheckboxFieldValue;
  field: CheckboxField;
}

const CheckboxCell = memo(function CheckboxCell(props: CheckboxCellProps) {
  const { value, field, recordID } = props;

  return (
    <FieldCheckboxValueEdit recordID={recordID} value={value} field={field} />
  );
});

interface DateCellProps {
  recordID: RecordID;
  value: DateFieldValue;
  field: DateField;
}

const DateCell = memo(function DateCell(props: DateCellProps) {
  const { value, field, recordID } = props;

  return (
    <PopoverWrapper
      contentHeight={400}
      content={({ onRequestClose }) => (
        <FieldDateValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <FieldDateValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface PopoverWrapperProps {
  children: React.ReactNode;
  content: (callbacks: PopoverCallback) => React.ReactNode;
  contentHeight: number;
}

function PopoverWrapper(props: PopoverWrapperProps) {
  const { children, content, contentHeight } = props;
  const themeStyles = useThemeStyles();

  return (
    <PopoverButton
      contentHeight={contentHeight}
      content={({ onRequestClose }) => (
        <View style={[styles.popoverContainer, themeStyles.background.content]}>
          {content({ onRequestClose })}
        </View>
      )}
    >
      {children}
    </PopoverButton>
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
      <Text size="xs">{field.name.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function useCellKeyPressHandler(
  setEditing: (editing: boolean) => void,
): (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void {
  return useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (key === UIKey.Escape) {
        setEditing(false);
      }
      if (key === WhiteSpaceKey.Enter) {
        setEditing(false);
      }
    },
    [setEditing],
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {},
  popoverContainer: {
    padding: 8,
    borderRadius: tokens.border.radius,
  },
});
