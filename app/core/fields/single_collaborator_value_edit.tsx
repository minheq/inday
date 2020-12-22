import React, { useCallback, useMemo } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SingleCollaboratorField,
  SingleCollaboratorFieldValue,
} from '../../data/fields';
import { RecordID } from '../../data/records';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import { useGetCollaborators } from '../../data/store';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { Collaborator, CollaboratorID } from '../../data/collaborators';

interface SingleCollaboratorValueEditProps {
  recordID: RecordID;
  field: SingleCollaboratorField;
  value: SingleCollaboratorFieldValue;
  onDone: () => void;
}

export function SingleCollaboratorValueEdit(
  props: SingleCollaboratorValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <SingleSelectKindValueEdit<SingleCollaboratorFieldValue>
      recordID={recordID}
      fieldID={field.id}
      renderLabel={renderCollaborator}
      options={options}
      value={value}
      onDone={onDone}
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
