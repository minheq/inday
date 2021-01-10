import React, { Fragment, useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SingleDocumentLinkField,
  SingleDocumentLinkFieldValue,
} from '../../../models/fields';
import { Document, DocumentID } from '../../../models/documents';
import { DocumentLinkBadge } from './document_link_badge';

interface SingleDocumentLinkPickerProps {
  value: SingleDocumentLinkFieldValue;
  onChange: (value: SingleDocumentLinkFieldValue) => void;
  field: SingleDocumentLinkField;
  onRequestClose: () => void;
}

export function SingleDocumentLinkPicker(
  props: SingleDocumentLinkPickerProps,
): JSX.Element {
  return <Fragment />;
}

export function useRenderDocumentLink(): (
  documentID: DocumentID,
) => JSX.Element {
  return useCallback((documentID: DocumentID) => {
    return <DocumentLinkBadge documentID={documentID} key={documentID} />;
  }, []);
}

export function useDocumentLinkOptions(
  documents: Document[],
): ListPickerOption<DocumentID>[] {
  // TODO
  return [];
}
