import React from 'react';

import {
  MultiRecordLinkField,
  MultiRecordLinkFieldValue,
} from '../data/fields';
import { Record, RecordID } from '../data/records';
import { FieldMultiSelectKindInput } from './field_multi_select_kind_input';
import { useGetCollectionRecords } from '../data/store';
import {
  useRecordLinkOptions,
  useRenderRecordLink,
} from './field_single_record_link_input';

interface FieldMultiRecordLinkInputProps {
  record: Record;
  field: MultiRecordLinkField;
  value: MultiRecordLinkFieldValue;
  onDone: () => void;
}

export function FieldMultiRecordLinkInput(
  props: FieldMultiRecordLinkInputProps,
): JSX.Element {
  const { record, field, value, onDone } = props;
  const renderRecordLink = useRenderRecordLink();
  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  return (
    <FieldMultiSelectKindInput<RecordID>
      recordID={record.id}
      fieldID={field.id}
      renderLabel={renderRecordLink}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
