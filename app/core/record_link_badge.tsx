import { RecordID } from '../data/records';
import { useGetCollection, useGetRecord } from '../data/store';
import React from 'react';
import { Badge, tokens } from '../components';
import { assertPrimaryFieldValue } from '../data/fields';

interface RecordLinkBadgeProps {
  recordID: RecordID;
}

export function RecordLinkBadge(props: RecordLinkBadgeProps): JSX.Element {
  const { recordID } = props;
  const record = useGetRecord(recordID);
  const collection = useGetCollection(record.collectionID);
  const primaryFieldValue = record.fields[collection.primaryFieldID];

  assertPrimaryFieldValue(primaryFieldValue);

  return <Badge color={tokens.colors.purple[50]} title={primaryFieldValue} />;
}
