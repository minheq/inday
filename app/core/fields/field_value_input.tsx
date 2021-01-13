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
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { tokens } from '../../components/tokens';
import { useThemeStyles } from '../../components/theme';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Spacer } from '../../components/spacer';
import { Row } from '../../components/row';
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

  const renderField = useCallback((): JSX.Element => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return (
          <CheckboxField documentID={documentID} field={field} value={value} />
        );
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return (
          <CurrencyField documentID={documentID} field={field} value={value} />
        );
      case FieldType.Date:
        assertDateFieldValue(value);
        return (
          <DateField documentID={documentID} field={field} value={value} />
        );
      case FieldType.Email:
        assertEmailFieldValue(value);
        return (
          <EmailField documentID={documentID} field={field} value={value} />
        );
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return (
          <MultiCollaboratorField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiDocumentLink:
        assertMultiDocumentLinkFieldValue(value);
        return (
          <MultiDocumentLinkField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return (
          <MultiLineTextField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.MultiSelect:
        assertMultiSelectFieldValue(value);
        return (
          <MultiSelectField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.Number:
        assertNumberFieldValue(value);
        return (
          <NumberField documentID={documentID} field={field} value={value} />
        );
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return (
          <PhoneNumberField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return (
          <SingleCollaboratorField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleDocumentLink:
        assertSingleDocumentLinkFieldValue(value);
        return (
          <SingleDocumentLinkField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return (
          <SingleLineTextField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.SingleSelect:
        assertSingleSelectFieldValue(value);
        return (
          <SingleSelectField
            documentID={documentID}
            field={field}
            value={value}
          />
        );
      case FieldType.URL:
        assertURLFieldValue(value);
        return <URLField documentID={documentID} field={field} value={value} />;
    }
  }, [field, value, documentID]);

  return <FieldWrapper field={field}>{renderField()}</FieldWrapper>;
}

interface SingleLineTextFieldProps {
  documentID: DocumentID;
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

const SingleLineTextField = memo(function SingleLineTextField(
  props: SingleLineTextFieldProps,
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

interface URLFieldProps {
  documentID: DocumentID;
  value: URLFieldValue;
  field: URLField;
}

const URLField = memo(function URLField(props: URLFieldProps) {
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

interface EmailFieldProps {
  documentID: DocumentID;
  value: EmailFieldValue;
  field: EmailField;
}

const EmailField = memo(function EmailField(props: EmailFieldProps) {
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

interface MultiLineTextFieldProps {
  documentID: DocumentID;
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

const MultiLineTextField = memo(function MultiLineTextField(
  props: MultiLineTextFieldProps,
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

interface PhoneNumberFieldProps {
  documentID: DocumentID;
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

const PhoneNumberField = memo(function PhoneNumberField(
  props: PhoneNumberFieldProps,
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

interface NumberFieldProps {
  documentID: DocumentID;
  value: NumberFieldValue;
  field: NumberField;
}

const NumberField = memo(function NumberField(props: NumberFieldProps) {
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

interface CurrencyFieldProps {
  documentID: DocumentID;
  value: CurrencyFieldValue;
  field: CurrencyField;
}

const CurrencyField = memo(function CurrencyField(props: CurrencyFieldProps) {
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

interface MultiCollaboratorFieldProps {
  documentID: DocumentID;
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

const MultiCollaboratorField = memo(function MultiCollaboratorField(
  props: MultiCollaboratorFieldProps,
) {
  const { field, documentID } = props;

  return (
    <MultiCollaboratorValueEdit documentID={documentID} fieldID={field.id} />
  );
});

interface MultiSelectFieldProps {
  documentID: DocumentID;
  value: MultiSelectFieldValue;
  field: MultiSelectField;
}

const MultiSelectField = memo(function MultiSelectField(
  props: MultiSelectFieldProps,
) {
  const { field, documentID } = props;

  return <MultiSelectValueEdit documentID={documentID} fieldID={field.id} />;
});

interface MultiDocumentLinkFieldProps {
  documentID: DocumentID;
  value: MultiDocumentLinkFieldValue;
  field: MultiDocumentLinkField;
}

const MultiDocumentLinkField = memo(function MultiDocumentLinkField(
  props: MultiDocumentLinkFieldProps,
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

interface SingleCollaboratorFieldProps {
  documentID: DocumentID;
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

const SingleCollaboratorField = memo(function SingleCollaboratorField(
  props: SingleCollaboratorFieldProps,
) {
  const { field, documentID } = props;

  return (
    <SingleCollaboratorValueEdit documentID={documentID} fieldID={field.id} />
  );
});

interface SingleSelectFieldProps {
  documentID: DocumentID;
  value: SingleSelectFieldValue;
  field: SingleSelectField;
}

const SingleSelectField = memo(function SingleSelectField(
  props: SingleSelectFieldProps,
) {
  const { field, documentID } = props;

  return <SingleSelectValueEdit documentID={documentID} fieldID={field.id} />;
});

interface SingleDocumentLinkFieldProps {
  documentID: DocumentID;
  value: SingleDocumentLinkFieldValue;
  field: SingleDocumentLinkField;
}

const SingleDocumentLinkField = memo(function SingleDocumentLinkField(
  props: SingleDocumentLinkFieldProps,
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

interface CheckboxFieldProps {
  documentID: DocumentID;
  value: CheckboxFieldValue;
  field: CheckboxField;
}

const CheckboxField = memo(function CheckboxField(props: CheckboxFieldProps) {
  const { field, documentID } = props;

  return <CheckboxValueEdit documentID={documentID} fieldID={field.id} />;
});

interface DateFieldProps {
  documentID: DocumentID;
  value: DateFieldValue;
  field: DateField;
}

const DateField = memo(function DateField(props: DateFieldProps) {
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
