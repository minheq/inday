import React from 'react';
import { CollaboratorID } from '../../../models/collaborators';

import {
  MultiCollaboratorField,
  MultiCollaboratorFieldValue,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { useCollaboratorsQuery } from '../../store/queries';
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
  const collaborators = useCollaboratorsQuery();
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
