import { Space } from './spaces';
import { generateID } from '../../lib/id';
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
  NumberField,
  PhoneNumberField,
  SingleCollaboratorField,
  MultiOptionField,
  MultiLineTextField,
  DateField,
  CurrencyField,
  CheckboxField,
  SingleRecordLinkField,
  SingleLineTextField,
  SingleOptionField,
  URLField,
  SelectOption,
} from './fields';
import { BaseView, View } from './views';
import { Collection } from './collections';
import { Record } from './records';
import { Filter, FilterConfig } from './filters';
import { Sort, SortConfig } from './sorts';
import {
  fakeBoolean,
  fakeDate,
  fakeEmail,
  fakeNumber,
  fakePhoneNumber,
  fakeURL,
  fakeWord,
  fakeWords,
} from '../../lib/faker';
import { tokens } from '../components';
import { Workspace } from './workspace';
import { keyedBy, range, sample } from '../../lib/array_utils';
import { isEmpty } from '../../lib/lang_utils';

export function makeSpace(space: Partial<Space>): Space {
  return {
    id: space.id ?? Space.generateID(),
    name: space.name ?? fakeWords(2),
    workspaceID: space.workspaceID ?? Workspace.generateID(),
    updatedAt: space.updatedAt ?? new Date(),
    createdAt: space.createdAt ?? new Date(),
  };
}

export function makeCollaborator(
  collaborator: Partial<Collaborator>,
): Collaborator {
  return {
    id: collaborator.id ?? Collaborator.generateID(),
    userID: collaborator.userID ?? Collaborator.generateID(),
    profileImageID: collaborator.profileImageID ?? 'someID',
    name: collaborator.name ?? fakeWords(2),
    email: collaborator.email ?? fakeEmail(),
    spaceID: collaborator.spaceID ?? Space.generateID(),
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
    id: field.id ?? Field.generateID(),
    name: field.name ?? fakeWord(),
    description: field.description ?? fakeWords(50),
    collectionID: field.collectionID ?? Collection.generateID(),
    updatedAt: field.updatedAt ?? new Date(),
    createdAt: field.createdAt ?? new Date(),
  };
}

const makeFieldByType: {
  [fieldType in FieldType]: (field: Partial<Field>) => Field;
} = {
  [FieldType.Checkbox]: (field): CheckboxField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Checkbox,
      ...base,
    };
  },
  [FieldType.Currency]: (field): CurrencyField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Currency,
      currency: 'USD',
      ...base,
    };
  },
  [FieldType.Date]: (field): DateField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Date,
      format: 'yyyy-MM-dd',
      hourCycle: 'h24',
      timezone: true,
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
        Collection.generateID(),
      ...base,
    };
  },
  [FieldType.MultiLineText]: (field): MultiLineTextField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.MultiLineText,
      richText: false,
      ...base,
    };
  },
  [FieldType.MultiOption]: (field): MultiOptionField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.MultiOption,
      options: [
        {
          id: SelectOption.generateID(),
          label: fakeWord(),
          color: tokens.colors.green[100],
          order: 1,
        },
        {
          id: SelectOption.generateID(),
          label: fakeWord(),
          color: tokens.colors.blue[100],
          order: 2,
        },
        {
          id: SelectOption.generateID(),
          label: fakeWord(),
          color: tokens.colors.red[100],
          order: 3,
        },
      ],
      ...base,
    };
  },
  [FieldType.Number]: (field): NumberField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.Number,
      style: 'decimal',
      default: null,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...base,
    };
  },
  [FieldType.PhoneNumber]: (field): PhoneNumberField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.PhoneNumber,
      ...base,
    };
  },
  [FieldType.SingleCollaborator]: (field): SingleCollaboratorField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleCollaborator,
      ...base,
    };
  },
  [FieldType.SingleRecordLink]: (field): SingleRecordLinkField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleRecordLink,
      recordsFromCollectionID:
        (field as Partial<MultiRecordLinkField>).recordsFromCollectionID ??
        Collection.generateID(),
      ...base,
    };
  },
  [FieldType.SingleLineText]: (field): SingleLineTextField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleLineText,
      default: '',
      ...base,
    };
  },
  [FieldType.SingleOption]: (field): SingleOptionField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleOption,
      options: [
        {
          id: SelectOption.generateID(),
          label: fakeWord(),
          color: tokens.colors.green[100],
          order: 1,
        },
        {
          id: SelectOption.generateID(),
          label: fakeWord(),
          color: tokens.colors.blue[100],
          order: 2,
        },
        {
          id: SelectOption.generateID(),
          label: fakeWord(),
          color: tokens.colors.red[100],
          order: 3,
        },
      ],
      ...base,
    };
  },
  [FieldType.URL]: (field): URLField => {
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
    id: collection.id ?? Collection.generateID(),
    name: collection.name ?? fakeWords(2),
    spaceID: collection.spaceID ?? Space.generateID(),
    updatedAt: collection.updatedAt ?? new Date(),
    createdAt: collection.createdAt ?? new Date(),
    primaryFieldID: collection.primaryFieldID ?? Field.generateID(),
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
    id: view.id ?? View.generateID(),
    name: view.name ?? fakeWords(2),
    collectionID: view.collectionID ?? Collection.generateID(),
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
      (field) => field.id,
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
): Record[] {
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
    id: record.id ?? Record.generateID(),
    fields,
    collectionID:
      record.collectionID ?? collection?.id ?? Collection.generateID(),
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
    return fakeBoolean();
  },
  [FieldType.Currency]: () => {
    return fakeNumber();
  },
  [FieldType.Date]: () => {
    return fakeDate();
  },
  [FieldType.Email]: () => {
    return fakeEmail();
  },
  [FieldType.MultiCollaborator]: (field, _recordsByFieldID, collaborators) => {
    assertMultiCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(collaborators)) {
      return [];
    }

    return [sample(collaborators).id];
  },
  [FieldType.MultiRecordLink]: (field, recordsByFieldID) => {
    if (recordsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(recordsByFieldID[field.id])) {
      return [];
    }

    return [sample(recordsByFieldID[field.id]).id];
  },
  [FieldType.MultiLineText]: () => {
    return fakeWords(50);
  },
  [FieldType.MultiOption]: (field) => {
    assertMultiOptionField(field);

    return [sample(field.options).id];
  },
  [FieldType.Number]: () => {
    return fakeNumber();
  },
  [FieldType.PhoneNumber]: () => {
    return fakePhoneNumber();
  },
  [FieldType.SingleCollaborator]: (field, recordsByFieldID, collaborators) => {
    assertSingleCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(collaborators)) {
      return null;
    }

    return sample(collaborators).id;
  },
  [FieldType.SingleRecordLink]: (field, recordsByFieldID) => {
    if (recordsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(recordsByFieldID[field.id])) {
      return null;
    }

    return sample(recordsByFieldID[field.id]).id;
  },
  [FieldType.SingleLineText]: () => {
    return fakeWords(2);
  },
  [FieldType.SingleOption]: (field) => {
    assertSingleOptionField(field);

    return sample(field.options).id;
  },
  [FieldType.URL]: () => {
    return fakeURL();
  },
};

export function makeFilter(
  filter: Partial<Filter>,
  config: FilterConfig,
): Filter {
  return {
    id: filter.id ?? Filter.generateID(),
    viewID: filter.viewID ?? View.generateID(),
    group: filter.group || 1,
    ...config,
  };
}

export function makeSort(sort: Partial<Sort>, config: SortConfig): Sort {
  return {
    id: sort.id ?? Sort.generateID(),
    viewID: sort.viewID ?? View.generateID(),
    sequence: sort.sequence || 1,
    ...config,
  };
}
