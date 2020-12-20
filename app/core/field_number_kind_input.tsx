import React, { useCallback } from 'react';
import { toNumber } from '../../lib/number_utils';
import { TextInput } from '../components/text_input';
import { FieldID, NumberFieldKindValue } from '../data/fields';
import { RecordID } from '../data/records';
import { useUpdateRecordFieldValue } from '../data/store';

interface FieldNumberKindInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: NumberFieldKindValue;
}

export function FieldNumberKindInput(
  props: FieldNumberKindInputProps,
): JSX.Element {
  const { recordID, fieldID, value } = props;
  const updateRecordFieldValue = useUpdateRecordFieldValue<NumberFieldKindValue>();

  const handleChange = useCallback(
    (nextValue: string) => {
      updateRecordFieldValue(recordID, fieldID, toNumber(nextValue));
    },
    [updateRecordFieldValue, recordID, fieldID],
  );

  return (
    <TextInput onChange={handleChange} value={value ? value.toString() : ''} />
  );
}
