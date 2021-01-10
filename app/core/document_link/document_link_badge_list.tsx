import React, { Fragment } from 'react';

import { isEmpty } from '../../../lib/lang_utils';
import { Row } from '../../components/row';
import { DocumentLinkBadge } from './document_link_badge';
import { DocumentID } from '../../../models/documents';

interface DocumentLinkBadgeListProps {
  documentIDs: DocumentID[];
}

export function DocumentLinkBadgeList(
  props: DocumentLinkBadgeListProps,
): JSX.Element {
  const { documentIDs } = props;

  if (isEmpty(documentIDs)) {
    return <Fragment />;
  }

  return (
    <Row spacing={8}>
      {documentIDs.map((documentID) => (
        <DocumentLinkBadge documentID={documentID} key={documentID} />
      ))}
    </Row>
  );
}
