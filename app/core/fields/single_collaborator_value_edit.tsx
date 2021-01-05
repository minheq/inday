import React, { useCallback, useMemo } from 'react';
import { ListPickerOption } from '../../components/list_picker';

import {
  SingleCollaboratorField,
  SingleCollaboratorFieldValue,
} from '../../../models/fields';
import { DocumentID } from '../../../models/documents';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import { useCollaboratorsQuery } from '../../store/queries';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { Collaborator, CollaboratorID } from '../../../models/collaborators';

interface SingleCollaboratorValueEditProps {
  documentID: DocumentID;
  field: SingleCollaboratorField;
  value: SingleCollaboratorFieldValue;
  onDone: () => void;
}

export function SingleCollaboratorValueEdit(
  props: SingleCollaboratorValueEditProps,
): JSX.Element {
  const { documentID, field, value, onDone } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <SingleSelectKindValueEdit<SingleCollaboratorFieldValue>
      documentID={documentID}
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
