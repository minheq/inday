import React, { memo, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { Text } from '../../components/text';
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
} from '../../data/fields';
import { RecordID } from '../../data/records';
import { TextKindValueEdit } from './text_kind_value_edit';
import { NumberKindValueEdit } from './number_kind_value_edit';
import { CheckboxValueEdit } from './checkbox_value_edit';
import { MultiCollaboratorValueEdit } from './multi_collaborator_value_edit';
import { MultiOptionValueEdit } from './multi_option_value_edit';
import { MultiRecordLinkValueEdit } from './multi_record_link_value_edit';
import { SingleCollaboratorValueEdit } from './single_collaborator_value_edit';
import { SingleOptionValueEdit } from './single_option_value_edit';
import { SingleRecordLinkValueEdit } from './single_record_link_value_edit';
import { DateValueEdit } from './date_value_edit';
import { PopoverButton } from '../../components/popover_button';
import { tokens } from '../../components/tokens';
import { useThemeStyles } from '../../components/theme';
import { SingleLineTextValueView } from './single_line_text_value_view';
import { URLValueView } from './url_value_view';
import { UIKey, WhiteSpaceKey } from '../../lib/keyboard';
import { MultiLineTextValueEdit } from './multi_line_text_value_edit';
import { PhoneNumberValueView } from './phone_number_value_view';
import { MultiLineTextValueView } from './multi_line_text_value_view';
import { EmailValueView } from './email_value_view';
import { NumberValueView } from './number_value_view';
import { CurrencyValueView } from './currency_value_view';
import { MultiCollaboratorValueView } from './multi_collaborator_value_view';
import { MultiOptionValueView } from './multi_option_value_view';
import { MultiRecordLinkValueView } from './multi_record_link_value_view';
import { SingleCollaboratorValueView } from './single_collaborator_value_view';
import { SingleOptionValueView } from './single_option_value_view';
import { SingleRecordLinkValueView } from './single_record_link_value_view';
import { DateValueView } from './date_value_view';
import { Button } from '../../components/button';
import { Spacer } from '../../components/spacer';
import { FlatButton } from '../../components/flat_button';
import { Row } from '../../components/row';
import { PopoverCallback } from '../../components/popover';
import { EmailValueActions } from './email_value_actions';
import { PhoneNumberValueActions } from './phone_number_value_actions';
import { URLValueActions } from './url_value_actions';
import { Icon } from '../../components/icon';
import { getFieldIcon } from '../views/icon_helpers';

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
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditWrapper onDone={handleDone}>
        <TextKindValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditWrapper>
    );
  }

  return (
    <FieldButton onPress={handlePress}>
      <SingleLineTextValueView value={value} field={field} />
    </FieldButton>
  );
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
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditWrapper onDone={handleDone}>
        <TextKindValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditWrapper>
    );
  }
  return (
    <View>
      <FieldButton onPress={handlePress}>
        <URLValueView value={value} field={field} />
      </FieldButton>
      <Spacer size={8} />
      <URLValueActions value={value} />
    </View>
  );
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
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditWrapper onDone={handleDone}>
        <TextKindValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditWrapper>
    );
  }

  return (
    <View>
      <FieldButton onPress={handlePress}>
        <EmailValueView value={value} field={field} />
      </FieldButton>
      <Spacer size={8} />
      <EmailValueActions value={value} />
    </View>
  );
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
  const themeStyles = useThemeStyles();
  const [editing, setEditing] = useState(false);
  const onKeyPress = useCellKeyPressHandler(setEditing);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditActions onDone={handleDone}>
        <MultiLineTextValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditActions>
    );
  }

  return (
    <Button
      style={[styles.multiLineTextButton, themeStyles.border.default]}
      onPress={handlePress}
    >
      <MultiLineTextValueView value={value} field={field} />
    </Button>
  );
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
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditWrapper onDone={handleDone}>
        <TextKindValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditWrapper>
    );
  }

  return (
    <View>
      <FieldButton onPress={handlePress}>
        <PhoneNumberValueView value={value} field={field} />
      </FieldButton>
      <Spacer size={8} />
      <PhoneNumberValueActions value={value} />
    </View>
  );
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
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditWrapper onDone={handleDone}>
        <NumberKindValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditWrapper>
    );
  }

  return (
    <FieldButton onPress={handlePress}>
      <NumberValueView value={value} field={field} />
    </FieldButton>
  );
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
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <FieldEditWrapper onDone={handleDone}>
        <NumberKindValueEdit
          recordID={recordID}
          autoFocus
          value={value}
          field={field}
          onKeyPress={onKeyPress}
        />
      </FieldEditWrapper>
    );
  }

  return (
    <FieldButton onPress={handlePress}>
      <CurrencyValueView value={value} field={field} />
    </FieldButton>
  );
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
      content={({ onRequestClose }) => (
        <MultiCollaboratorValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <MultiCollaboratorValueView value={value} field={field} />
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
      content={({ onRequestClose }) => (
        <MultiOptionValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <MultiOptionValueView value={value} field={field} />
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
      content={({ onRequestClose }) => (
        <MultiRecordLinkValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <MultiRecordLinkValueView value={value} field={field} />
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
      content={({ onRequestClose }) => (
        <SingleCollaboratorValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <SingleCollaboratorValueView value={value} field={field} />
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
      content={({ onRequestClose }) => (
        <SingleOptionValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <SingleOptionValueView value={value} field={field} />
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
      content={({ onRequestClose }) => (
        <SingleRecordLinkValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <SingleRecordLinkValueView value={value} field={field} />
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

  return <CheckboxValueEdit recordID={recordID} value={value} field={field} />;
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
      content={({ onRequestClose }) => (
        <DateValueEdit
          recordID={recordID}
          field={field}
          value={value}
          onDone={onRequestClose}
        />
      )}
    >
      <DateValueView value={value} field={field} />
    </PopoverWrapper>
  );
});

interface PopoverWrapperProps {
  children: React.ReactNode;
  content: (callbacks: PopoverCallback) => React.ReactNode;
}

function PopoverWrapper(props: PopoverWrapperProps) {
  const { children, content } = props;
  const themeStyles = useThemeStyles();

  return (
    <PopoverButton
      style={[styles.popoverButton, themeStyles.border.default]}
      content={({ onRequestClose }) => (
        <View>{content({ onRequestClose })}</View>
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
      <Row alignItems="center" spacing={4}>
        <Icon name={getFieldIcon(field.type)} size="sm" />
        <Text size="xs">{field.name.toUpperCase()}</Text>
      </Row>
      <Spacer size={4} />
      {children}
    </View>
  );
}

interface FieldButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

function FieldButton(props: FieldButtonProps) {
  const { onPress, children } = props;
  const themeStyles = useThemeStyles();

  return (
    <Button
      onPress={onPress}
      style={[styles.fieldButton, themeStyles.border.default]}
    >
      {children}
    </Button>
  );
}

interface FieldEditWrapperProps {
  onDone: () => void;
  children: React.ReactNode;
}

function FieldEditWrapper(props: FieldEditWrapperProps) {
  const { children, onDone } = props;
  const themeStyles = useThemeStyles();

  return (
    <FieldEditActions onDone={onDone}>
      <View style={[styles.fieldEditWrapper, themeStyles.border.focused]}>
        {children}
      </View>
    </FieldEditActions>
  );
}

interface FieldEditActionsProps {
  onDone: () => void;
  children: React.ReactNode;
}

function FieldEditActions(props: FieldEditActionsProps) {
  const { children, onDone } = props;

  return (
    <View>
      {children}
      <Spacer size={8} />
      <Row justifyContent="flex-end">
        <FlatButton onPress={onDone} title="Done" color="primary" />
      </Row>
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
  fieldWrapper: {
    paddingBottom: 32,
  },
  fieldEditWrapper: {
    height: 40,
    borderWidth: 2,
    borderRadius: tokens.border.radius,
    alignItems: 'center',
    flexDirection: 'row',
  },
  multiLineTextButton: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: tokens.border.radius,
  },
  fieldButton: {
    height: 40,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    justifyContent: 'center',
  },
  popoverButton: {
    height: 40,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    justifyContent: 'center',
  },
});
