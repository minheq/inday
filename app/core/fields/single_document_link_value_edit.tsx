import React, { useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import { SingleDocumentLinkFieldValue } from '../../../models/fields';
import { Document, DocumentID } from '../../../models/documents';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import { useCollectionDocumentsQuery } from '../../store/queries';
import { DocumentLinkBadge } from './document_link_badge';
import { CollectionID } from '../../../models/collections';

interface SingleDocumentLinkValueEditProps {
  value: SingleDocumentLinkFieldValue;
  onChange: (value: SingleDocumentLinkFieldValue) => void;
  onRequestClose: () => void;
  collectionID: CollectionID;
}

export function SingleDocumentLinkValueEdit(
  props: SingleDocumentLinkValueEditProps,
): JSX.Element {
  const { onRequestClose, value, onChange, collectionID } = props;
  const renderDocumentLink = useRenderDocumentLink();
  const documents = useCollectionDocumentsQuery(collectionID);
  const options = useDocumentLinkOptions(documents);

  return (
    <SingleSelectKindValueEdit<SingleDocumentLinkFieldValue>
      renderLabel={renderDocumentLink}
      options={options}
      value={value}
      onChange={onChange}
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
