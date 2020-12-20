import React from 'react';
import { CollaboratorID } from '../data/collaborators';

import {
  MultiCollaboratorField,
  MultiCollaboratorFieldValue,
} from '../data/fields';
import { RecordID } from '../data/records';
import { useGetCollaborators } from '../data/store';
import { FieldMultiSelectKindValueEdit } from './field_multi_select_kind_value_edit';
import {
  useGetCollaboratorOptions,
  useRenderCollaborator,
} from './field_single_collaborator_value_edit';

interface FieldMultiCollaboratorValueEditProps {
  recordID: RecordID;
  field: MultiCollaboratorField;
  value: MultiCollaboratorFieldValue;
  onDone: () => void;
}

export function FieldMultiCollaboratorValueEdit(
  props: FieldMultiCollaboratorValueEditProps,
): JSX.Element {
  const { recordID, field, value, onDone } = props;
  const collaborators = useGetCollaborators();
  const renderCollaborator = useRenderCollaborator();
  const options = useGetCollaboratorOptions(collaborators);

  return (
    <FieldMultiSelectKindValueEdit<CollaboratorID>
      recordID={recordID}
      fieldID={field.id}
      renderLabel={renderCollaborator}
      options={options}
      value={value}
      onDone={onDone}
    />
  );
}
