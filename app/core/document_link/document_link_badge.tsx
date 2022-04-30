import { DocumentID } from "../../../models/documents";
import { useCollectionQuery, useDocumentQuery } from "../../store/queries";
import React from "react";
import { Badge } from "../../components/badge";
import { assertPrimaryFieldValue } from "../../../models/fields";
import { palette } from "../../components/palette";

interface DocumentLinkBadgeProps {
  documentID: DocumentID;
}

export function DocumentLinkBadge(props: DocumentLinkBadgeProps): JSX.Element {
  const { documentID } = props;
  const document = useDocumentQuery(documentID);
  const collection = useCollectionQuery(document.collectionID);
  const primaryFieldValue = document.fields[collection.primaryFieldID];

  assertPrimaryFieldValue(primaryFieldValue);

  return <Badge color={palette.purple[50]} title={primaryFieldValue} />;
}
