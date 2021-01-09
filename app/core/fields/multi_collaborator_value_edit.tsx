import React from 'react';
import { CollaboratorID } from '../../../models/collaborators';

import {
  MultiCollaboratorField,
  MultiCollaboratorFieldValue,
} from '../../../models/fields';
import { useCollaboratorsQuery } from '../../store/queries';
import { MultiSelectKindPicker } from './multi_select_kind_value_edit';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './single_collaborator_value_edit';

interface MultiCollaboratorPickerProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
  onChange: (value: MultiCollaboratorFieldValue) => void;
  onRequestClose: () => void;
}

export function MultiCollaboratorPicker(
  props: MultiCollaboratorPickerProps,
): JSX.Element {
  const { value, onChange, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <MultiSelectKindPicker<CollaboratorID>
      value={value}
      onChange={onChange}
      renderLabel={renderCollaborator}
      options={options}
      onRequestClose={onRequestClose}
    />
  );
}
