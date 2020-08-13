import { Space } from './spaces';
import faker from 'faker';
import { generateID } from '../../lib/id/id';
import { Collaborator } from './collaborators';
import {
  BaseField,
  Field,
  MultiDocumentLinkField,
  assertSingleCollaboratorField,
  assertMultiOptionField,
  assertSingleOptionField,
  assertMultiCollaboratorField,
} from './fields';
import { FieldType } from './constants';
import { View } from './views';
import { Collection } from './collections';
import { Document, FieldValue } from './documents';
import { groupByID } from '../../lib/data_structures/objects';
import { Filter, FilterConfig } from './filters';

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
        { value: faker.random.word(), color: 'green', order: 1 },
        { value: faker.random.word(), color: 'blue', order: 2 },
        { value: faker.random.word(), color: 'red', order: 3 },
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
        { value: faker.random.word(), color: 'green', order: 1 },
        { value: faker.random.word(), color: 'blue', order: 2 },
        { value: faker.random.word(), color: 'red', order: 3 },
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

interface CollectionWithFields extends Collection {
  fields: Field[];
}

export function makeCollection(collection: Partial<Collection>): Collection {
  return {
    id: collection.id ?? generateID(),
    name: collection.name ?? faker.commerce.department(),
    spaceID: collection.spaceID ?? generateID(),
    updatedAt: collection.updatedAt ?? new Date(),
    createdAt: collection.createdAt ?? new Date(),
  };
}

interface CollectionWithFields extends Collection {
  fields: Field[];
}

export function addFieldsToCollection(
  collection: Collection,
  fields: Field[],
): CollectionWithFields {
  return {
    ...collection,
    fields,
  };
}

export function makeView(
  view: Partial<View>,
  collection: CollectionWithFields,
): View {
  // @ts-ignore: I don't know how to solve this type error
  return {
    fieldsOrder: collection.fields.map((f) => f.id),
    fieldsConfig: groupByID(
      collection.fields.map((f) => ({
        id: f.id,
        visible: true,
        width: 180,
      })),
    ),
    id: view.id ?? generateID(),
    type: view.type ?? 'list',
    name: view.name ?? faker.commerce.department(),
    collectionID: view.collectionID ?? generateID(),
    updatedAt: view.updatedAt ?? new Date(),
    createdAt: view.createdAt ?? new Date(),
  };
}

export function makeDocument(
  document: Partial<Document>,
  collection: CollectionWithFields,
  documentsByFieldID?: {
    [fieldID: string]: Document[];
  },
  collaborators?: Collaborator[],
): Document {
  const fields: { [fieldID: string]: FieldValue } = {};

  for (const field of collection.fields) {
    fields[field.id] = fakeFieldValuesByFieldType[field.type](
      field,
      documentsByFieldID,
      collaborators,
    );
  }
  return {
    id: document.id ?? generateID(),
    fields,
    collectionID: document.collectionID ?? generateID(),
    updatedAt: document.updatedAt ?? new Date(),
    createdAt: document.createdAt ?? new Date(),
  };
}

const fakeFieldValuesByFieldType: {
  [fieldType in FieldType]: (
    field: Field,
    documentsByFieldID?: {
      [fieldID: string]: Document[];
    },
    collaborators?: Collaborator[],
  ) => FieldValue;
} = {
  [FieldType.Checkbox]: () => {
    return faker.random.boolean();
  },
  [FieldType.Currency]: () => {
    return faker.random.number();
  },
  [FieldType.Date]: () => {
    return faker.date.future();
  },
  [FieldType.Email]: () => {
    return faker.internet.email();
  },
  [FieldType.MultiCollaborator]: (field, documentsByFieldID, collaborators) => {
    assertMultiCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    return faker.helpers.randomize(collaborators.map((c) => c.id));
  },
  [FieldType.MultiDocumentLink]: (field, documentsByFieldID) => {
    if (documentsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    return faker.helpers.randomize(
      documentsByFieldID[field.id].map((d) => d.id),
    );
  },
  [FieldType.MultiLineText]: () => {
    return faker.random.words();
  },
  [FieldType.MultiOption]: (field) => {
    assertMultiOptionField(field);

    return faker.helpers.randomize(field.options).value;
  },
  [FieldType.Number]: () => {
    return faker.random.number();
  },
  [FieldType.PhoneNumber]: () => {
    return faker.phone.phoneNumber();
  },
  [FieldType.SingleCollaborator]: (
    field,
    documentsByFieldID,
    collaborators,
  ) => {
    assertSingleCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    return faker.helpers.randomize(collaborators.map((c) => c.id));
  },
  [FieldType.SingleDocumentLink]: (field, documentsByFieldID) => {
    if (documentsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    return faker.helpers.randomize(
      documentsByFieldID[field.id].map((d) => d.id),
    );
  },
  [FieldType.SingleLineText]: () => {
    return faker.random.words();
  },
  [FieldType.SingleOption]: (field) => {
    assertSingleOptionField(field);

    return faker.helpers.randomize(field.options).value;
  },
  [FieldType.URL]: () => {
    return faker.internet.url();
  },
};

export function makeFilter(
  filter: Partial<Filter>,
  config: FilterConfig,
): Filter {
  return {
    id: filter.id ?? generateID(),
    viewID: filter.viewID ?? generateID(),
    group: filter.group || 1,
    ...config,
  };
}
