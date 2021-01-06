import React from 'react';

import { MultiDocumentLinkFieldValue } from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import { useCollectionDocumentsQuery } from '../../store/queries';
import {
  useDocumentLinkOptions,
  useRenderDocumentLink,
} from './single_document_link_value_edit';
import { CollectionID } from '../../../models/collections';

interface MultiDocumentLinkValueEditProps {
  collectionID: CollectionID;
  value: MultiDocumentLinkFieldValue;
  onChange: (value: MultiDocumentLinkFieldValue) => void;
  onRequestClose: () => void;
}

export function MultiDocumentLinkValueEdit(
  props: MultiDocumentLinkValueEditProps,
): JSX.Element {
  const { value, collectionID, onChange, onRequestClose } = props;
  const renderDocumentLink = useRenderDocumentLink();

  const documents = useCollectionDocumentsQuery(collectionID);
  const options = useDocumentLinkOptions(documents);

  return (
    <MultiSelectKindValueEdit<DocumentID>
      onChange={onChange}
      renderLabel={renderDocumentLink}
      options={options}
      value={value}
      onRequestClose={onRequestClose}
    />
  );
}
