import { RecordID } from 'app/data/records';
import { useGetCollection, useGetRecord } from 'app/data/store';
import React from 'react';
import { Badge } from '../components';
import { palette } from '../components/palette';

interface RecordLinkBadgeProps {
  recordID: RecordID;
}

export function RecordLinkBadge(props: RecordLinkBadgeProps): JSX.Element {
  const { recordID } = props;
  const record = useGetRecord(recordID);
  const collection = useGetCollection(record.collectionID);
  const primaryFieldText = record.fields[collection.primaryFieldID];

  if (typeof primaryFieldText !== 'string') {
    throw new Error('Main field expected to be string');
  }

  return <Badge color={palette.purple[50]} title={primaryFieldText} />;
}
