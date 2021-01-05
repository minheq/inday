import { DocumentID } from '../../../models/documents';
import { useCollectionQuery, useDocumentQuery } from '../../store/queries';
import React from 'react';
import { Badge } from '../../components/badge';
import { assertPrimaryFieldValue } from '../../../models/fields';
import { useTheme } from '../../components/theme';
import { palette } from '../../components/palette';

interface DocumentLinkBadgeProps {
  documentID: DocumentID;
}

export function DocumentLinkBadge(props: DocumentLinkBadgeProps): JSX.Element {
  const { documentID } = props;
  const theme = useTheme();
  const document = useDocumentQuery(documentID);
  const collection = useCollectionQuery(document.collectionID);
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
