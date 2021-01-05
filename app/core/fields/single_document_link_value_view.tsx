import React, { Fragment } from 'react';

import {
  SingleDocumentLinkFieldValue,
  SingleDocumentLinkField,
} from '../../../models/fields';
import { DocumentLinkBadge } from './document_link_badge';

interface SingleDocumentLinkValueViewProps {
  field: SingleDocumentLinkField;
  value: SingleDocumentLinkFieldValue;
}

export function SingleDocumentLinkValueView(
  props: SingleDocumentLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <Fragment />;
  }

  return <DocumentLinkBadge documentID={value} />;
}
