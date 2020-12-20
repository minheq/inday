import React, { useCallback } from 'react';
import { ListPickerOption } from '../components/list_picker';

import {
  SingleRecordLinkField,
  SingleRecordLinkFieldValue,
  stringifyFieldValue,
} from '../data/fields';
import { Record, RecordID } from '../data/records';
import { FieldSingleSelectKindInput } from './field_single_select_kind_input';
import {
  useGetCollectionRecords,
  useGetRecordPrimaryFieldValueCallback,
} from '../data/store';
import { RecordLinkBadge } from './record_link_badge';

interface FieldSingleRecordLinkInputProps {
  record: Record;
  field: SingleRecordLinkField;
  value: SingleRecordLinkFieldValue;
  onDone: () => void;
}

export function FieldSingleRecordLinkInput(
  props: FieldSingleRecordLinkInputProps,
): JSX.Element {
  const { record, field, value, onDone } = props;
  const renderRecordLink = useRenderRecordLink();
  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  return (
    <FieldSingleSelectKindInput<SingleRecordLinkFieldValue>
      recordID={record.id}
      fieldID={field.id}
      renderLabel={renderRecordLink}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}

export function useRenderRecordLink(): (recordID: RecordID) => JSX.Element {
  return useCallback((recordID: RecordID) => {
    return <RecordLinkBadge recordID={recordID} key={recordID} />;
  }, []);
}

export function useRecordLinkOptions(
  records: Record[],
): ListPickerOption<RecordID>[] {
  const getRecordPrimaryFieldValue = useGetRecordPrimaryFieldValueCallback();

  return records.map((record) => {
    const [field, value] = getRecordPrimaryFieldValue(record.id);

    return {
      value: record.id,
      label: stringifyFieldValue(field, value),
    };
  });
}
