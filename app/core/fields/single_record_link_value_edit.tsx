import React, { useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SingleRecordLinkField,
  SingleRecordLinkFieldValue,
  stringifyFieldValue,
} from '../../data/fields';
import { Record, RecordID } from '../../data/records';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import {
  useGetCollectionRecords,
  useGetRecordPrimaryFieldValueCallback,
} from '../../data/store';
import { RecordLinkBadge } from './record_link_badge';

interface SingleRecordLinkValueEditProps {
  recordID: RecordID;
  field: SingleRecordLinkField;
  value: SingleRecordLinkFieldValue;
  onDone: () => void;
}

export function SingleRecordLinkValueEdit(
  props: SingleRecordLinkValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const renderRecordLink = useRenderRecordLink();
  const records = useGetCollectionRecords(field.recordsFromCollectionID);
  const options = useRecordLinkOptions(records);

  return (
    <SingleSelectKindValueEdit<SingleRecordLinkFieldValue>
      recordID={recordID}
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
