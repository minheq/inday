import React, { useCallback, useMemo } from 'react';

import { ListPickerOption } from '../../components/list_picker';
import { SingleCollaboratorFieldValue } from '../../../models/fields';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import { useCollaboratorsQuery } from '../../store/queries';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { Collaborator, CollaboratorID } from '../../../models/collaborators';

interface SingleCollaboratorValueEditProps {
  onChange: (value: SingleCollaboratorFieldValue) => void;
  value: SingleCollaboratorFieldValue;
  onRequestClose: () => void;
}

export function SingleCollaboratorValueEdit(
  props: SingleCollaboratorValueEditProps,
): JSX.Element {
  const { value, onChange, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <SingleSelectKindValueEdit<SingleCollaboratorFieldValue>
      renderLabel={renderCollaborator}
      options={options}
      value={value}
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
  return useMemo(() => {
    return collaborators.map((collaborator) => ({
      value: collaborator.id,
      label: collaborator.name,
    }));
  }, [collaborators]);
}
