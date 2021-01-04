import React from 'react';

import {
  MultiDocumentLinkField,
  MultiDocumentLinkFieldValue,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import { useCollectionDocumentsQuery } from '../../store/queries';
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

  const documents = useCollectionDocumentsQuery(
    field.documentsFromCollectionID,
  );
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
