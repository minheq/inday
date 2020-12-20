import React from 'react';

import {
  MultiRecordLinkField,
  MultiRecordLinkFieldValue,
} from '../data/fields';
import { RecordID } from '../data/records';
import { FieldMultiSelectKindValueEdit } from './field_multi_select_kind_value_edit';
import { useGetCollectionRecords } from '../data/store';
import {
  useRecordLinkOptions,
  useRenderRecordLink,
} from './field_single_record_link_value_edit';

interface FieldMultiRecordLinkValueEditProps {
  recordID: RecordID;
  field: MultiRecordLinkField;
  value: MultiRecordLinkFieldValue;
  onDone: () => void;
}

export function FieldMultiRecordLinkValueEdit(
  props: FieldMultiRecordLinkValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const renderRecordLink = useRenderRecordLink();

  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  return (
    <FieldMultiSelectKindValueEdit<RecordID>
      recordID={recordID}
      fieldID={field.id}
      renderLabel={renderRecordLink}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
