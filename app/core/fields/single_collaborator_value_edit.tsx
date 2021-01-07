import React, { useCallback, useMemo } from 'react';

import { ListPickerOption } from '../../components/list_picker';
import {
  assertSingleCollaboratorField,
  assertSingleCollaboratorFieldValue,
  FieldID,
  SingleCollaboratorFieldValue,
} from '../../../models/fields';
import { SingleSelectKindValueEdit } from './single_select_kind_value_edit';
import {
  useCollaboratorsQuery,
  useDocumentFieldValueQuery,
  useFieldQuery,
} from '../../store/queries';
import { CollaboratorBadge } from '../collaborators/collaborator_badge';
import { Collaborator, CollaboratorID } from '../../../models/collaborators';
import { SingleCollaboratorValueView } from './single_collaborator_value_view';
import { DocumentID } from '../../../models/documents';

interface SingleCollaboratorValueEditProps {
  fieldID: FieldID;
  documentID: DocumentID;
  onRequestClose: () => void;
}

export function SingleCollaboratorValueEdit(
  props: SingleCollaboratorValueEditProps,
): JSX.Element {
  const { fieldID, documentID, onRequestClose } = props;
  const collaborators = useCollaboratorsQuery();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);
  const value = useDocumentFieldValueQuery(documentID, fieldID);
  assertSingleCollaboratorFieldValue(value);
  const field = useFieldQuery(fieldID);
  assertSingleCollaboratorField(field);

  return (
    <SingleSelectKindValueEdit<CollaboratorID>
      fieldID={fieldID}
      documentID={documentID}
      renderLabel={renderCollaborator}
      options={options}
      onRequestClose={onRequestClose}
    >
      <SingleCollaboratorValueView value={value} field={field} />
    </SingleSelectKindValueEdit>
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
