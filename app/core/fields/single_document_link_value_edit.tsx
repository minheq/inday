import React, { useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  assertSingleDocumentLinkField,
  assertSingleDocumentLinkFieldValue,
  FieldID,
} from '../../../models/fields';
import { Document, DocumentID } from '../../../models/documents';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import {
  useCollectionDocumentsQuery,
  useDocumentFieldValueQuery,
  useFieldQuery,
} from '../../store/queries';
import { DocumentLinkBadge } from './document_link_badge';
import { CollectionID } from '../../../models/collections';
import { SingleDocumentLinkValueView } from './single_document_link_value_view';

interface SingleDocumentLinkValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
  collectionID: CollectionID;
}

export function SingleDocumentLinkValueEdit(
  props: SingleDocumentLinkValueEditProps,
): JSX.Element {
  const { onRequestClose, fieldID, documentID, collectionID } = props;
  const renderDocumentLink = useRenderDocumentLink();
  const documents = useCollectionDocumentsQuery(collectionID);
  const options = useDocumentLinkOptions(documents);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertSingleDocumentLinkFieldValue(value);
  const field = useFieldQuery(fieldID);
  assertSingleDocumentLinkField(field);

  return (
    <SingleSelectKindValueEdit<DocumentID>
      fieldID={fieldID}
      documentID={documentID}
      renderLabel={renderDocumentLink}
      options={options}
      onRequestClose={onRequestClose}
    >
      <SingleDocumentLinkValueView value={value} field={field} />
    </SingleSelectKindValueEdit>
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
