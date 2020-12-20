import React, { useCallback } from 'react';
import { TextInput } from '../components/text_input';
import { FieldID, TextFieldKindValue } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldTextKindInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: TextFieldKindValue;
}

export function FieldTextKindInput(
  props: FieldTextKindInputProps,
): JSX.Element {
  const { recordID, fieldID, value } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<TextFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, fieldID, nextValue);
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  return <TextInput onChange={handleChange} value={value} />;
}
