import React, { useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SingleDocumentLinkField,
  SingleDocumentLinkFieldValue,
} from '../../../models/fields';
import { Document, DocumentID } from '../../../models/documents';
import { SingleSelectKindPicker } from './single_select_kind_value_edit';
import { useCollectionDocumentsQuery } from '../../store/queries';
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
  const { value, onChange, field, onRequestClose } = props;
  const renderDocumentLink = useRenderDocumentLink();
  const documents = useCollectionDocumentsQuery(
    field.documentsFromCollectionID,
  );
  const options = useDocumentLinkOptions(documents);

  return (
    <SingleSelectKindPicker<DocumentID>
      onChange={onChange}
      value={value}
      renderLabel={renderDocumentLink}
      options={options}
      onRequestClose={onRequestClose}
    />
  );
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
