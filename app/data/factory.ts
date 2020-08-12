import { Space } from './spaces';
import faker from 'faker';
import { generateID } from '../../lib/id/id';
import { Collaborator } from './collaborators';
import { BaseField, Field, MultiDocumentLinkField } from './fields';
import { FieldType } from './constants';
import { View } from './views';

export function makeSpace(space: Partial<Space>): Space {
  return {
    id: space.id ?? generateID(),
    name: space.name ?? faker.commerce.department(),
    workspaceID: space.workspaceID ?? generateID(),
    updatedAt: space.updatedAt ?? new Date(),
    createdAt: space.createdAt ?? new Date(),
  };
}

export function makeCollaborator(
  collaborator: Partial<Collaborator>,
): Collaborator {
  return {
    id: collaborator.id ?? generateID(),
    name: collaborator.name ?? faker.name.lastName(),
    email: collaborator.email ?? faker.internet.email(),
    spaceID: collaborator.spaceID ?? generateID(),
    updatedAt: collaborator.updatedAt ?? new Date(),
    createdAt: collaborator.createdAt ?? new Date(),
  };
}

export function makeField(field: Partial<Field>): Field {
  if (field.type !== undefined) {
    return makeFieldByType[field.type](field);
  }

  return makeFieldByType[FieldType.SingleLineText](field);
}

export function makeBaseField(field: Partial<Field>): BaseField {
  return {
    id: field.id ?? generateID(),
    name: field.name ?? faker.name.lastName(),
    description: field.description ?? faker.random.words(),
    collectionID: field.collectionID ?? generateID(),
    updatedAt: field.updatedAt ?? new Date(),
    createdAt: field.createdAt ?? new Date(),
  };
}

const makeFieldByType: {
  [fieldType in FieldType]: (field: Partial<Field>) => Field;
} = {
  [FieldType.Checkbox]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Checkbox,
      emoji: '',
      ...base,
    };
  },
  [FieldType.Currency]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Currency,
      currency: '$',
      precision: 2,
      allowNegative: false,
      ...base,
    };
  },
  [FieldType.Date]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Date,
      format: 'yyyy-MM-dd',
      includeTime: false,
      timeFormat: '12hour',
      ...base,
    };
  },
  [FieldType.Email]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Email,
      ...base,
    };
  },
  [FieldType.MultiCollaborator]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.MultiCollaborator,
      ...base,
    };
  },
  [FieldType.MultiDocumentLink]: (field) => {
    const base = makeBaseField(field);

    return {
      type: FieldType.MultiDocumentLink,
      documentsFromCollectionID:
        (field as Partial<MultiDocumentLinkField>).documentsFromCollectionID ??
        generateID(),
      ...base,
    };
  },
  [FieldType.MultiLineText]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.MultiLineText,
      richText: false,
      ...base,
    };
  },
  [FieldType.MultiOption]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.MultiOption,
      options: [
        { value: 'Qualification', color: 'black', order: 1 },
        { value: 'Proposal', color: 'black', order: 2 },
        { value: 'Evaluation', color: 'black', order: 3 },
      ],
      ...base,
    };
  },
  [FieldType.Number]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Number,
      default: null,
      format: 'integer',
      ...base,
    };
  },
  [FieldType.PhoneNumber]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.PhoneNumber,
      ...base,
    };
  },
  [FieldType.SingleCollaborator]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleCollaborator,
      ...base,
    };
  },
  [FieldType.SingleDocumentLink]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleDocumentLink,
      documentsFromCollectionID:
        (field as Partial<MultiDocumentLinkField>).documentsFromCollectionID ??
        generateID(),
      ...base,
    };
  },
  [FieldType.SingleLineText]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleLineText,
      default: '',
      ...base,
    };
  },
  [FieldType.SingleOption]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleOption,
      options: [
        { value: 'Qualification', color: 'black', order: 1 },
        { value: 'Proposal', color: 'black', order: 2 },
        { value: 'Evaluation', color: 'black', order: 3 },
      ],
      ...base,
    };
  },
  [FieldType.URL]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.URL,
      ...base,
    };
  },
};

export function makeView(view: Partial<View>): View {}
