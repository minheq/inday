import React, { useCallback, useMemo } from 'react';

import { ListPickerOption } from '../../components/list_picker';
import {
  SingleCollaboratorField,
  SingleCollaboratorFieldValue,
} from '../../../models/fields';
import { SingleSelectKindPicker } from './single_select_kind_value_edit';
import { useCollaboratorsQuery } from '../../store/queries';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { Collaborator, CollaboratorID } from '../../../models/collaborators';

interface SingleCollaboratorPickerProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
  onChange: (value: SingleCollaboratorFieldValue) => void;
  onRequestClose: () => void;
}

export function SingleCollaboratorPicker(
  props: SingleCollaboratorPickerProps,
): JSX.Element {
  const { value, onChange, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <SingleSelectKindPicker<CollaboratorID>
      value={value}
      onChange={onChange}
      renderLabel={renderCollaborator}
      options={options}
      onRequestClose={onRequestClose}
    />
  );
}

export function useRenderCollaborator(): (
  collaboratorID: CollaboratorID,
) => JSX.Element {
  return useCallback((collaboratorID: CollaboratorID) => {
    return (
      <CollaboratorBadge collaboratorID={collaboratorID} key={collaboratorID} />
    );
  }, []);
}

export function useGetCollaboratorOptions(
  collaborators: Collaborator[],
): ListPickerOption<CollaboratorID>[] {
  return useMemo(() => {
    return collaborators.map((collaborator) => ({
      value: collaborator.id,
      label: collaborator.name,
    }));
  }, [collaborators]);
}
