import React, { useCallback, useMemo } from 'react';
import { ListPickerOption } from '../components/list_picker';

import {
  SingleCollaboratorField,
  SingleCollaboratorFieldValue,
} from '../data/fields';
import { RecordID } from '../data/records';
import { FieldSingleSelectKindValueEdit } from './field_single_select_kind_value_edit';
import { useGetCollaborators } from '../data/store';
import { CollaboratorBadge } from './collaborator_badge';
import { Collaborator, CollaboratorID } from '../data/collaborators';

interface FieldSingleCollaboratorValueEditProps {
  recordID: RecordID;
  field: SingleCollaboratorField;
  value: SingleCollaboratorFieldValue;
  onDone: () => void;
}

export function FieldSingleCollaboratorValueEdit(
  props: FieldSingleCollaboratorValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <FieldSingleSelectKindValueEdit<SingleCollaboratorFieldValue>
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
