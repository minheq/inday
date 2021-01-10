import React, { Fragment } from 'react';

import {
  MultiDocumentLinkField,
  MultiDocumentLinkFieldValue,
} from '../../../models/fields';

interface DocumentLinkMultiPickerProps {
  value: MultiDocumentLinkFieldValue;
  onChange: (value: MultiDocumentLinkFieldValue) => void;
  field: MultiDocumentLinkField;
  onRequestClose: () => void;
}

export function DocumentLinkMultiPicker(
  props: DocumentLinkMultiPickerProps,
): JSX.Element {
  return <Fragment />;
}
