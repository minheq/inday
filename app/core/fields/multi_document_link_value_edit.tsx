import React from 'react';

import {
  assertMultiDocumentLinkField,
  assertMultiDocumentLinkFieldValue,
  FieldID,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useCollectionDocumentsQuery,
  useDocumentFieldValueQuery,
  useFieldQuery,
} from '../../store/queries';
import {
  useDocumentLinkOptions,
  useRenderDocumentLink,
} from './single_document_link_value_edit';
import { CollectionID } from '../../../models/collections';
import { MultiDocumentLinkValueView } from './multi_document_link_value_view';

interface MultiDocumentLinkValueEditProps {
  collectionID: CollectionID;
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
}

export function MultiDocumentLinkValueEdit(
  props: MultiDocumentLinkValueEditProps,
): JSX.Element {
  const { fieldID, documentID, collectionID, onRequestClose } = props;
  const renderDocumentLink = useRenderDocumentLink();
  const documents = useCollectionDocumentsQuery(collectionID);
  const options = useDocumentLinkOptions(documents);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertMultiDocumentLinkFieldValue(value);
  const field = useFieldQuery(fieldID);
  assertMultiDocumentLinkField(field);

  return (
    <MultiSelectKindValueEdit<DocumentID>
      fieldID={fieldID}
      documentID={documentID}
      renderLabel={renderDocumentLink}
      options={options}
      onRequestClose={onRequestClose}
    >
      <MultiDocumentLinkValueView value={value} field={field} />
    </MultiSelectKindValueEdit>
  );
}
