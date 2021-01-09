import React from 'react';

import {
  MultiDocumentLinkField,
  MultiDocumentLinkFieldValue,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { MultiSelectKindPicker } from './multi_select_kind_value_edit';
import { useCollectionDocumentsQuery } from '../../store/queries';
import {
  useDocumentLinkOptions,
  useRenderDocumentLink,
} from './single_document_link_value_edit';

interface MultiDocumentLinkPickerProps {
  value: MultiDocumentLinkFieldValue;
  onChange: (value: MultiDocumentLinkFieldValue) => void;
  field: MultiDocumentLinkField;
  onRequestClose: () => void;
}

export function MultiDocumentLinkPicker(
  props: MultiDocumentLinkPickerProps,
): JSX.Element {
  const { value, onChange, field, onRequestClose } = props;
  const renderDocumentLink = useRenderDocumentLink();
  const documents = useCollectionDocumentsQuery(
    field.documentsFromCollectionID,
  );
  const options = useDocumentLinkOptions(documents);

  return (
    <MultiSelectKindPicker<DocumentID>
      onChange={onChange}
      value={value}
      renderLabel={renderDocumentLink}
      options={options}
      onRequestClose={onRequestClose}
    />
  );
}
