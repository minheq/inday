import React from 'react';

import {
  MultiDocumentLinkField,
  MultiDocumentLinkFieldValue,
} from '../../data/fields';
import { DocumentID } from '../../data/documents';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import { useGetCollectionDocuments } from '../../data/store';
import {
  useDocumentLinkOptions,
  useRenderDocumentLink,
} from './single_document_link_value_edit';

interface MultiDocumentLinkValueEditProps {
  documentID: DocumentID;
  field: MultiDocumentLinkField;
  value: MultiDocumentLinkFieldValue;
  onDone: () => void;
}

export function MultiDocumentLinkValueEdit(
  props: MultiDocumentLinkValueEditProps,
): JSX.Element {
  const { documentID, field, value, onDone } = props;
  const renderDocumentLink = useRenderDocumentLink();

  const documents = useGetCollectionDocuments(field.documentsFromCollectionID);
  const options = useDocumentLinkOptions(documents);

  return (
    <MultiSelectKindValueEdit<DocumentID>
      documentID={documentID}
      fieldID={field.id}
      renderLabel={renderDocumentLink}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
