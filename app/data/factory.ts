import { Space } from './spaces';
import faker from 'faker';
import { generateID } from '../../lib/id/id';
import { Collaborator } from './collaborators';
import {
  FieldType,
  FieldValue,
  BaseField,
  Field,
  MultiRecordLinkField,
  assertSingleCollaboratorField,
  assertMultiOptionField,
  assertSingleOptionField,
  assertMultiCollaboratorField,
} from './fields';
import { BaseView, View } from './views';
import { Collection } from './collections';
import { Record } from './records';
import { Filter, FilterConfig } from './filters';
import { keyedBy, range, isEmpty } from '../../lib/data_structures';
import { Sort, SortConfig } from './sorts';

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
  [FieldType.MultiRecordLink]: (field) => {
    const base = makeBaseField(field);

    return {
      type: FieldType.MultiRecordLink,
      recordsFromCollectionID:
        (field as Partial<MultiRecordLinkField>).recordsFromCollectionID ??
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
  [FieldType.SingleRecordLink]: (field) => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleRecordLink,
      recordsFromCollectionID:
        (field as Partial<MultiRecordLinkField>).recordsFromCollectionID ??
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
    mainFieldID: collection.mainFieldID ?? generateID(),
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
  const baseView: BaseView = {
    id: view.id ?? generateID(),
    name: view.name ?? faker.commerce.department(),
    collectionID: view.collectionID ?? generateID(),
    updatedAt: view.updatedAt ?? new Date(),
    createdAt: view.createdAt ?? new Date(),
  };

  if (view.type === 'board') {
    return {
      ...baseView,
      type: 'board',
      stackedByFieldID: collection.fields[0].id,
    };
  }

  return {
    ...baseView,
    type: 'list',
    fixedFieldCount: 1,
    fieldsConfig: keyedBy(
      collection.fields.map((f, i) => ({
        id: f.id,
        visible: true,
        width: 180,
        order: i,
      })),
      'id',
    ),
  };
}

export function makeManyRecords(
  count: number,
  collection: CollectionWithFields,
  recordsByFieldID?: {
    [fieldID: string]: Record[];
  },
  collaborators?: Collaborator[],
) {
  return range(0, count).map(() => {
    return makeRecord({}, collection, recordsByFieldID, collaborators);
  });
}

export function makeRecord(
  record: Partial<Record>,
  collection?: CollectionWithFields,
  recordsByFieldID?: {
    [fieldID: string]: Record[];
  },
  collaborators?: Collaborator[],
): Record {
  const fields: { [fieldID: string]: FieldValue } = {
    ...record.fields,
  };

  if (collection) {
    for (const field of collection.fields) {
      if (record.fields?.[field.id] !== undefined) {
        continue;
      }

      fields[field.id] = fakeFieldValuesByFieldType[field.type](
        field,
        recordsByFieldID,
        collaborators,
      );
    }
  }

  return {
    id: record.id ?? generateID(),
    fields,
    collectionID: record.collectionID ?? collection?.id ?? generateID(),
    updatedAt: record.updatedAt ?? new Date(),
    createdAt: record.createdAt ?? new Date(),
  };
}

const fakeFieldValuesByFieldType: {
  [fieldType in FieldType]: (
    field: Field,
    recordsByFieldID?: {
      [fieldID: string]: Record[];
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
  [FieldType.MultiCollaborator]: (field, recordsByFieldID, collaborators) => {
    assertMultiCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(collaborators)) {
      return [];
    }

    return [faker.helpers.randomize(collaborators.map((c) => c.id))];
  },
  [FieldType.MultiRecordLink]: (field, recordsByFieldID) => {
    if (recordsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(recordsByFieldID[field.id])) {
      return [];
    }

    return [
      faker.helpers.randomize(recordsByFieldID[field.id].map((d) => d.id)),
    ];
  },
  [FieldType.MultiLineText]: () => {
    return faker.random.words();
  },
  [FieldType.MultiOption]: (field) => {
    assertMultiOptionField(field);

    return [faker.helpers.randomize(field.options).value];
  },
  [FieldType.Number]: () => {
    return faker.random.number();
  },
  [FieldType.PhoneNumber]: () => {
    return faker.phone.phoneNumber();
  },
  [FieldType.SingleCollaborator]: (field, recordsByFieldID, collaborators) => {
    assertSingleCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(collaborators)) {
      return null;
    }

    return faker.helpers.randomize(collaborators.map((c) => c.id));
  },
  [FieldType.SingleRecordLink]: (field, recordsByFieldID) => {
    if (recordsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(recordsByFieldID[field.id])) {
      return null;
    }

    return faker.helpers.randomize(recordsByFieldID[field.id].map((d) => d.id));
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

export function makeSort(sort: Partial<Sort>, config: SortConfig): Sort {
  return {
    id: sort.id ?? generateID(),
    viewID: sort.viewID ?? generateID(),
    sequence: sort.sequence || 1,
    ...config,
  };
}
