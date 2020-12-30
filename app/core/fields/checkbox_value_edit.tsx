import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '../../components/icon';
import { useThemeStyles } from '../../components/theme';
import { tokens } from '../../components/tokens';
import {
  BooleanFieldKindValue,
  CheckboxField,
  CheckboxFieldValue,
} from '../../data/fields';
import { DocumentID } from '../../data/documents';
import { useUpdateDocumentFieldValue } from '../../data/store';

interface CheckboxValueEditProps {
  documentID: DocumentID;
  field: CheckboxField;
  value: CheckboxFieldValue;
}

export function CheckboxValueEdit(props: CheckboxValueEditProps): JSX.Element {
  const { documentID, value, field } = props;
  const updateDocumentFieldValue = useUpdateDocumentFieldValue<BooleanFieldKindValue>();

  const handleToggle = useCallback(() => {
    const checked = !value;
    updateDocumentFieldValue(documentID, field.id, checked);
  }, [updateDocumentFieldValue, documentID, field, value]);

  return <Checkbox value={value} onChange={handleToggle} />;
}

interface FieldCheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

function Checkbox(props: FieldCheckboxProps): JSX.Element {
  const { value, onChange } = props;
  const themeStyles = useThemeStyles();

  const handlePress = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  return (
    <Pressable
      style={[styles.checkbox, themeStyles.border.default]}
      onPress={handlePress}
    >
      {value === true && <Icon name="CheckThick" color="success" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: tokens.border.radius,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
