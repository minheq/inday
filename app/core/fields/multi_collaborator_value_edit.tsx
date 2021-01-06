import React from 'react';
import { CollaboratorID } from '../../../models/collaborators';

import { MultiCollaboratorFieldValue } from '../../../models/fields';
import { useCollaboratorsQuery } from '../../store/queries';
import { MultiSelectKindValueEdit } from './multi_select_kind_value_edit';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './single_collaborator_value_edit';

interface MultiCollaboratorValueEditProps {
  value: MultiCollaboratorFieldValue;
  onChange: (value: MultiCollaboratorFieldValue) => void;
  onRequestClose: () => void;
}

export function MultiCollaboratorValueEdit(
  props: MultiCollaboratorValueEditProps,
): JSX.Element {
  const { value, onChange, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <MultiSelectKindValueEdit<CollaboratorID>
      onChange={onChange}
      renderLabel={renderCollaborator}
      options={options}
      value={value}
      onRequestClose={onRequestClose}
    />
  );
}
