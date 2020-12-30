import { DocumentID } from '../../data/documents';
import { useGetCollection, useGetDocument } from '../../data/store';
import React from 'react';
import { Badge } from '../../components/badge';
import { assertPrimaryFieldValue } from '../../data/fields';
import { useTheme } from '../../components/theme';
import { palette } from '../../components/palette';

interface DocumentLinkBadgeProps {
  documentID: DocumentID;
}

export function DocumentLinkBadge(props: DocumentLinkBadgeProps): JSX.Element {
  const { documentID } = props;
  const theme = useTheme();
  const document = useGetDocument(documentID);
  const collection = useGetCollection(document.collectionID);
  const primaryFieldValue = document.fields[collection.primaryFieldID];

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
