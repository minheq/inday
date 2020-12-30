import React, { useCallback } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SingleDocumentLinkField,
  SingleDocumentLinkFieldValue,
  stringifyFieldValue,
} from '../../data/fields';
import { Document, DocumentID } from '../../data/documents';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import {
  useGetCollectionDocuments,
  useGetDocumentPrimaryFieldValueCallback,
} from '../../data/store';
import { DocumentLinkBadge } from './document_link_badge';

interface SingleDocumentLinkValueEditProps {
  documentID: DocumentID;
  field: SingleDocumentLinkField;
  value: SingleDocumentLinkFieldValue;
  onDone: () => void;
}

export function SingleDocumentLinkValueEdit(
  props: SingleDocumentLinkValueEditProps,
): JSX.Element {
  const { documentID, field, value, onDone } = props;
  const renderDocumentLink = useRenderDocumentLink();
  const documents = useGetCollectionDocuments(field.documentsFromCollectionID);
  const options = useDocumentLinkOptions(documents);

  return (
    <SingleSelectKindValueEdit<SingleDocumentLinkFieldValue>
      documentID={documentID}
      fieldID={field.id}
      renderLabel={renderDocumentLink}
      options={options}
      value={value}
      onDone={onDone}
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
  const getDocumentPrimaryFieldValue = useGetDocumentPrimaryFieldValueCallback();

  return documents.map((document) => {
    const [field, value] = getDocumentPrimaryFieldValue(document.id);

    return {
      value: document.id,
      label: stringifyFieldValue(field, value),
    };
  });
}
