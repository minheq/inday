import React, { Fragment } from 'react';

import { isEmpty } from '../../../lib/lang_utils';
import { Row } from '../../components/row';

import {
  MultiDocumentLinkFieldValue,
  MultiDocumentLinkField,
} from '../../data/fields';
import { DocumentLinkBadge } from './document_link_badge';

interface MultiDocumentLinkValueViewProps {
  field: MultiDocumentLinkField;
  value: MultiDocumentLinkFieldValue;
}

export function MultiDocumentLinkValueView(
  props: MultiDocumentLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (isEmpty(value)) {
    return <Fragment />;
  }

  return (
    <Row spacing={8}>
      {value.map((documentID) => (
        <DocumentLinkBadge documentID={documentID} key={documentID} />
      ))}
    </Row>
  );
}
