import React from 'react';
import { CollaboratorID } from '../../data/collaborators';

import {
  MultiCollaboratorField,
  MultiCollaboratorFieldValue,
} from '../../data/fields';
import { DocumentID } from '../../data/documents';
import { useGetCollaborators } from '../../data/store';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './single_collaborator_value_edit';

interface MultiCollaboratorValueEditProps {
  documentID: DocumentID;
  field: MultiCollaboratorField;
  value: MultiCollaboratorFieldValue;
  onDone: () => void;
}

export function MultiCollaboratorValueEdit(
  props: MultiCollaboratorValueEditProps,
): JSX.Element {
  const { documentID, field, value, onDone } = props;
  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <MultiSelectKindValueEdit<CollaboratorID>
      documentID={documentID}
      fieldID={field.id}
      renderLabel={renderCollaborator}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
