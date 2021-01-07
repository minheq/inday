import React, { useCallback } from 'react';

import { formatISODate, parseISODate } from '../../../lib/date_utils';
import { DocumentID } from '../../../models/documents';
import {
  assertDateField,
  assertDateFieldValue,
  DateFieldValue,
  FieldID,
} from '../../../models/fields';
import { DatePicker } from '../../components/date_picker';
import { PressableHighlightPopover } from '../../components/pressable_highlight_popover';
import { useUpdateDocumentFieldValueMutation } from '../../store/mutations';
import { useDocumentFieldValueQuery, useFieldQuery } from '../../store/queries';
import { DateValueView } from './date_value_view';

interface DateValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
}

export function DateValueEdit(props: DateValueEditProps): JSX.Element {
  const { fieldID, documentID, onRequestClose } = props;
  const field = useFieldQuery(fieldID);
  assertDateField(field);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertDateFieldValue(value);
  const updateDocumentFieldValue = useUpdateDocumentFieldValueMutation();

  const handleChange = useCallback(
    async (nextValue: DateFieldValue) => {
      await updateDocumentFieldValue(documentID, fieldID, nextValue);
    },
    [updateDocumentFieldValue, documentID, fieldID],
  );

  return (
    <PressableHighlightPopover
      onRequestClose={onRequestClose}
      content={<DateValueInput value={value} onChange={handleChange} />}
    >
      <DateValueView field={field} value={value} />
    </PressableHighlightPopover>
  );
}

interface DateValueInputProps {
  value: DateFieldValue;
  onChange: (value: DateFieldValue) => void;
}

export function DateValueInput(props: DateValueInputProps): JSX.Element {
  const { value, onChange } = props;

  const handleChangeDate = useCallback(
    (date: Date) => {
      onChange(formatISODate(date));
    },
    [onChange],
  );

  return (
    <DatePicker
      value={value ? parseISODate(value) : null}
      onChange={handleChangeDate}
    />
  );
}
