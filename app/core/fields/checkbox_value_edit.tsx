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
import { RecordID } from '../../data/records';
import { useUpdateRecordFieldValue } from '../../data/store';

interface CheckboxValueEditProps {
  recordID: RecordID;
  field: CheckboxField;
  value: CheckboxFieldValue;
}

export function CheckboxValueEdit(props: CheckboxValueEditProps): JSX.Element {
  const { recordID, value, field } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<BooleanFieldKindValue>();

  const handleToggle = useCallback(() => {
    const checked = !value;
    updateRecordFieldValue(recordID, field.id, checked);
  }, [updateRecordFieldValue, recordID, field, value]);

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
