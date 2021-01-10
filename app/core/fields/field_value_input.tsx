import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../components/text';
import {
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
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
  MultiOptionField,
  MultiOptionFieldValue,
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
  SingleOptionField,
  SingleOptionFieldValue,
  SingleDocumentLinkField,
  SingleDocumentLinkFieldValue,
  URLField,
  URLFieldValue,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { tokens } from '../../components/tokens';
import { useThemeStyles } from '../../components/theme';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Spacer } from '../../components/spacer';
import { Row } from '../../components/row';
import { EmailValueActions } from './email_value_actions';
import { PhoneNumberValueActions } from './phone_number_value_actions';
import { URLValueActions } from './url_value_actions';
import { Icon } from '../../components/icon';
import { getFieldIcon } from '../views/icon_helpers';

interface DocumentFieldValueEditProps {
  field: Field;
  documentID: DocumentID;
  value: FieldValue;
}

export function DocumentFieldValueEdit(
  props: DocumentFieldValueEditProps,
): JSX.Element {
  const { documentID, field, value } = props;

  const renderCell = useCallback((): JSX.Element => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return (
          <CheckboxCell documentID={documentID} field={field} value={value} />
        );
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return (
          <CurrencyCell documentID={documentID} field={field} value={value} />
        );
      case FieldType.Date:
        assertDateFieldValue(value);
        return <DateCell documentID={documentID} field={field} value={value} />;
      case FieldType.Email:
        assertEmailFieldValue(value);
        return (
          <EmailCell documentID={documentID} field={field} value={value} />
        );
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return (
          <MultiCollaboratorCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiDocumentLink:
        assertMultiDocumentLinkFieldValue(value);
        return (
          <MultiDocumentLinkCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return (
          <MultiLineTextCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return (
          <MultiOptionCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.Number:
        assertNumberFieldValue(value);
        return (
          <NumberCell documentID={documentID} field={field} value={value} />
        );
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return (
          <PhoneNumberCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return (
          <SingleCollaboratorCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleDocumentLink:
        assertSingleDocumentLinkFieldValue(value);
        return (
          <SingleDocumentLinkCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return (
          <SingleLineTextCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return (
          <SingleOptionCell
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.URL:
        assertURLFieldValue(value);
        return <URLCell documentID={documentID} field={field} value={value} />;
    }
  }, [field, value, documentID]);

  return <FieldWrapper field={field}>{renderCell()}</FieldWrapper>;
}

interface SingleLineTextCellProps {
  documentID: DocumentID;
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextCell = memo(function SingleLineTextCell(
  props: SingleLineTextCellProps,
) {
  const { value, field, documentID } = props;
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <TextKindValueEdit
        autoFocus
        documentID={documentID}
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
    );
  }

  return (
    <FieldButton onPress={handlePress}>
      <SingleLineTextValueView value={value} field={field} />
    </FieldButton>
  );
});

interface URLCellProps {
  documentID: DocumentID;
  value: URLFieldValue;
  field: URLField;
}

const URLCell = memo(function URLCell(props: URLCellProps) {
  const { value, field, documentID } = props;
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <TextKindValueEdit
        autoFocus
        documentID={documentID}
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
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
  documentID: DocumentID;
  value: EmailFieldValue;
  field: EmailField;
}

const EmailCell = memo(function EmailCell(props: EmailCellProps) {
  const { value, field, documentID } = props;
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <TextKindValueEdit
        autoFocus
        documentID={documentID}
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
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
  documentID: DocumentID;
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

const MultiLineTextCell = memo(function MultiLineTextCell(
  props: MultiLineTextCellProps,
) {
  const { value, field, documentID } = props;
  const themeStyles = useThemeStyles();
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <MultiLineTextValueEdit
        documentID={documentID}
        autoFocus
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
    );
  }

  return (
    <PressableHighlight
      style={[styles.multiLineTextButton, themeStyles.border.default]}
      onPress={handlePress}
    >
      <MultiLineTextValueView value={value} field={field} />
    </PressableHighlight>
  );
});

interface PhoneNumberCellProps {
  documentID: DocumentID;
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

const PhoneNumberCell = memo(function PhoneNumberCell(
  props: PhoneNumberCellProps,
) {
  const { value, field, documentID } = props;
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <TextKindValueEdit
        autoFocus
        documentID={documentID}
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
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
  documentID: DocumentID;
  value: NumberFieldValue;
  field: NumberField;
}

const NumberCell = memo(function NumberCell(props: NumberCellProps) {
  const { value, field, documentID } = props;
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <NumberKindValueEdit
        autoFocus
        documentID={documentID}
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
    );
  }

  return (
    <FieldButton onPress={handlePress}>
      <NumberValueView value={value} field={field} />
    </FieldButton>
  );
});

interface CurrencyCellProps {
  documentID: DocumentID;
  value: CurrencyFieldValue;
  field: CurrencyField;
}

const CurrencyCell = memo(function CurrencyCell(props: CurrencyCellProps) {
  const { value, field, documentID } = props;
  const [editing, setEditing] = useState(false);
  const handlePress = useCallback(() => {
    setEditing(true);
  }, []);
  const handleDone = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing === true) {
    return (
      <NumberKindValueEdit
        autoFocus
        documentID={documentID}
        fieldID={field.id}
        onRequestClose={handleDone}
        onSubmitEditing={handleDone}
      />
    );
  }

  return (
    <FieldButton onPress={handlePress}>
      <CurrencyValueView value={value} field={field} />
    </FieldButton>
  );
});

interface MultiCollaboratorCellProps {
  documentID: DocumentID;
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

const MultiCollaboratorCell = memo(function MultiCollaboratorCell(
  props: MultiCollaboratorCellProps,
) {
  const { field, documentID } = props;

  return (
    <MultiCollaboratorValueEdit documentID={documentID} fieldID={field.id} />
  );
});

interface MultiOptionCellProps {
  documentID: DocumentID;
  value: MultiOptionFieldValue;
  field: MultiOptionField;
}

const MultiOptionCell = memo(function MultiOptionCell(
  props: MultiOptionCellProps,
) {
  const { field, documentID } = props;

  return <MultiOptionValueEdit documentID={documentID} fieldID={field.id} />;
});

interface MultiDocumentLinkCellProps {
  documentID: DocumentID;
  value: MultiDocumentLinkFieldValue;
  field: MultiDocumentLinkField;
}

const MultiDocumentLinkCell = memo(function MultiDocumentLinkCell(
  props: MultiDocumentLinkCellProps,
) {
  const { field, documentID } = props;

  return (
    <MultiDocumentLinkValueEdit
      collectionID={field.documentsFromCollectionID}
      documentID={documentID}
      fieldID={field.id}
    />
  );
});

interface SingleCollaboratorCellProps {
  documentID: DocumentID;
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

const SingleCollaboratorCell = memo(function SingleCollaboratorCell(
  props: SingleCollaboratorCellProps,
) {
  const { field, documentID } = props;

  return (
    <SingleCollaboratorValueEdit documentID={documentID} fieldID={field.id} />
  );
});

interface SingleOptionCellProps {
  documentID: DocumentID;
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

const SingleOptionCell = memo(function SingleOptionCell(
  props: SingleOptionCellProps,
) {
  const { field, documentID } = props;

  return <SingleOptionValueEdit documentID={documentID} fieldID={field.id} />;
});

interface SingleDocumentLinkCellProps {
  documentID: DocumentID;
  value: SingleDocumentLinkFieldValue;
  field: SingleDocumentLinkField;
}

const SingleDocumentLinkCell = memo(function SingleDocumentLinkCell(
  props: SingleDocumentLinkCellProps,
) {
  const { field, documentID } = props;

  return (
    <SingleDocumentLinkValueEdit
      collectionID={field.documentsFromCollectionID}
      documentID={documentID}
      fieldID={field.id}
    />
  );
});

interface CheckboxCellProps {
  documentID: DocumentID;
  value: CheckboxFieldValue;
  field: CheckboxField;
}

const CheckboxCell = memo(function CheckboxCell(props: CheckboxCellProps) {
  const { field, documentID } = props;

  return <CheckboxValueEdit documentID={documentID} fieldID={field.id} />;
});

interface DateCellProps {
  documentID: DocumentID;
  value: DateFieldValue;
  field: DateField;
}

const DateCell = memo(function DateCell(props: DateCellProps) {
  const { field, documentID } = props;

  return <DateValueEdit documentID={documentID} fieldID={field.id} />;
});

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
    <PressableHighlight
      onPress={onPress}
      style={[styles.fieldButton, themeStyles.border.default]}
    >
      {children}
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    paddingBottom: 32,
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
});
