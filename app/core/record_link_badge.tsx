import { RecordID } from '../data/records';
import { useGetCollection, useGetRecord } from '../data/store';
import React from 'react';
import { Badge } from '../components/badge';
import { assertPrimaryFieldValue } from '../data/fields';
import { useTheme } from '../components/theme';
import { palette } from '../components/palette';

interface RecordLinkBadgeProps {
  recordID: RecordID;
}

export function RecordLinkBadge(props: RecordLinkBadgeProps): JSX.Element {
  const { recordID } = props;
  const theme = useTheme();
  const record = useGetRecord(recordID);
  const collection = useGetCollection(record.collectionID);
  const primaryFieldValue = record.fields[collection.primaryFieldID];

  assertPrimaryFieldValue(primaryFieldValue);

  return (
    <Badge
      color={
        theme.colorScheme === 'dark' ? palette.purple[900] : palette.purple[50]
      }
      title={primaryFieldValue}
    />
  );
}
