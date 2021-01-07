import React from 'react';
import { CollaboratorID } from '../../../models/collaborators';
import { DocumentID } from '../../../models/documents';

import {
  assertMultiCollaboratorField,
  assertMultiCollaboratorFieldValue,
  FieldID,
} from '../../../models/fields';
import {
  useCollaboratorsQuery,
  useDocumentFieldValueQuery,
  useFieldQuery,
} from '../../store/queries';
import { MultiCollaboratorValueView } from './multi_collaborator_value_view';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './single_collaborator_value_edit';

interface MultiCollaboratorValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
}

export function MultiCollaboratorValueEdit(
  props: MultiCollaboratorValueEditProps,
): JSX.Element {
  const { fieldID, documentID } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertMultiCollaboratorFieldValue(value);
  const field = useFieldQuery(fieldID);
  assertMultiCollaboratorField(field);

  return (
    <MultiSelectKindValueEdit<CollaboratorID>
      fieldID={fieldID}
      documentID={documentID}
      renderLabel={renderCollaborator}
      options={options}
    >
      <MultiCollaboratorValueView value={value} field={field} />
    </MultiSelectKindValueEdit>
  );
}
