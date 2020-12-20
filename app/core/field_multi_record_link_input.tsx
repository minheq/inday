import React from 'react';

import {
  assertMultiRecordLinkField,
  FieldID,
  MultiRecordLinkFieldValue,
} from '../data/fields';
import { RecordID } from '../data/records';
import { FieldMultiSelectKindInput } from './field_multi_select_kind_input';
import { useGetCollectionRecords, useGetField } from '../data/store';
import {
  useRecordLinkOptions,
  useRenderRecordLink,
} from './field_single_record_link_input';

interface FieldMultiRecordLinkInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: MultiRecordLinkFieldValue;
  onDone: () => void;
}

export function FieldMultiRecordLinkInput(
  props: FieldMultiRecordLinkInputProps,
): JSX.Element {
  const { recordID, fieldID, value, onDone } = props;
  const renderRecordLink = useRenderRecordLink();
  const field = useGetField(fieldID);
  assertMultiRecordLinkField(field);
  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  return (
    <FieldMultiSelectKindInput<RecordID>
      recordID={recordID}
      fieldID={fieldID}
      renderLabel={renderRecordLink}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
