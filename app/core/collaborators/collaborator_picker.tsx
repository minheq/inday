import React, { useCallback, useMemo } from 'react';

import { ListPicker, ListPickerOption } from '../../components/list_picker';
import { useCollaboratorsQuery } from '../../store/queries';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { Collaborator, CollaboratorID } from '../../../models/collaborators';

interface CollaboratorPickerProps {
  value: CollaboratorID | null;
  onChange: (value: CollaboratorID) => void;
  onRequestClose: () => void;
}

export function CollaboratorPicker(
  props: CollaboratorPickerProps,
): JSX.Element {
  const { value, onChange, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <ListPicker<CollaboratorID>
      value={value}
      options={options}
      renderLabel={renderCollaborator}
      onChange={onChange}
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
  return useMemo(
    () =>
      collaborators.map((collaborator) => ({
        value: collaborator.id,
        label: collaborator.name,
      })),
    [collaborators],
  );
}
