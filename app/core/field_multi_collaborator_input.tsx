import React from 'react';
import { CollaboratorID } from '../data/collaborators';

import {
  MultiCollaboratorField,
  MultiCollaboratorFieldValue,
} from '../data/fields';
import { Record } from '../data/records';
import { useGetCollaborators } from '../data/store';
import { FieldMultiSelectKindInput } from './field_multi_select_kind_input';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './field_single_collaborator_input';

interface FieldMultiCollaboratorInputProps {
  record: Record;
  field: MultiCollaboratorField;
  value: MultiCollaboratorFieldValue;
  onDone: () => void;
}

export function FieldMultiCollaboratorInput(
  props: FieldMultiCollaboratorInputProps,
): JSX.Element {
  const { record, field, value, onDone } = props;
  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <FieldMultiSelectKindInput<CollaboratorID>
      recordID={record.id}
      fieldID={field.id}
      renderLabel={renderCollaborator}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
