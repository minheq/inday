import React from 'react';
import { CollaboratorID } from '../data/collaborators';

import { FieldID, MultiCollaboratorFieldValue } from '../data/fields';
import { RecordID } from '../data/records';
import { useGetCollaborators } from '../data/store';
import { FieldMultiSelectKindInput } from './field_multi_select_kind_input';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './field_single_collaborator_input';

interface FieldMultiCollaboratorInputProps {
  recordID: RecordID;
  fieldID: FieldID;
  value: MultiCollaboratorFieldValue;
  onDone: () => void;
}

export function FieldMultiCollaboratorInput(
  props: FieldMultiCollaboratorInputProps,
): JSX.Element {
  const { recordID, fieldID, value, onDone } = props;
  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <FieldMultiSelectKindInput<CollaboratorID>
      recordID={recordID}
      fieldID={fieldID}
      renderLabel={renderCollaborator}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
