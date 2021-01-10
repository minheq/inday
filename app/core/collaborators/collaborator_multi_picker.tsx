import React from 'react';

import { CollaboratorID } from '../../../models/collaborators';
import { ListMultiPicker } from '../../components/list_multi_picker';
import { useCollaboratorsQuery } from '../../store/queries';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './collaborator_picker';

interface CollaboratorMultiPickerProps {
  value: CollaboratorID[];
  onChange: (value: CollaboratorID[]) => void;
  onRequestClose: () => void;
}

export function CollaboratorMultiPicker(
  props: CollaboratorMultiPickerProps,
): JSX.Element {
  const { value, onChange, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <ListMultiPicker<CollaboratorID>
      value={value}
      options={options}
      renderLabel={renderCollaborator}
      onChange={onChange}
      onRequestClose={onRequestClose}
    />
  );
}
