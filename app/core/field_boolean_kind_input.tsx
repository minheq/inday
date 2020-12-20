import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '../components/icon';
import { tokens } from '../components/tokens';
import { BooleanFieldKindValue, FieldID } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldBooleanKindInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: BooleanFieldKindValue;
}

export function FieldBooleanKindInput(
  props: FieldBooleanKindInputProps,
): JSX.Element {
  const { recordID, value, fieldID } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<BooleanFieldKindValue>();

  const handleToggle = useCallback(() => {
    const checked = !value;
    updateRecordFieldValue(recordID, fieldID, checked);
  }, [updateRecordFieldValue, recordID, fieldID, value]);

  return <Checkbox value={value} onChange={handleToggle} />;
}

interface FieldCheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

function Checkbox(props: FieldCheckboxProps): JSX.Element {
  const { value, onChange } = props;

  const handlePress = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  return (
    <Pressable style={styles.checkbox} onPress={handlePress}>
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
    borderColor: tokens.colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
