import { generateSpaceID, Space } from './spaces';
import { Collaborator, generateCollaboratorID } from './collaborators';
import {
  FieldType,
  FieldValue,
  BaseField,
  Field,
  MultiDocumentLinkField,
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
  SingleDocumentLinkField,
  SingleLineTextField,
  SingleOptionField,
  URLField,
  SelectOption,
  generateFieldID,
  generateSelectOptionID,
} from './fields';
import { BaseView, generateViewID, View } from './views';
import { Collection, generateCollectionID } from './collections';
import { Document, generateDocumentID } from './documents';
import { Filter, FilterConfig, generateFilterID } from './filters';
import { generateSortID, Sort, SortConfig } from './sorts';
import {
  fakeBoolean,
  fakeDate,
  fakeEmail,
  fakeNumber,
  fakePhoneNumber,
  fakeURL,
  fakeWord,
  fakeWords,
} from '../lib/faker';
import { generateWorkspaceID, Workspace } from './workspace';
import { keyedBy, range, sample } from '../lib/array_utils';
import { isEmpty } from '../lib/lang_utils';
import { formatISODate } from '../lib/date_utils';
import { palette } from '../app/components/palette';
import { generateGroupID, Group } from './groups';

export function makeSpace(space: Partial<Space>): Space {
  return {
    id: space.id ?? generateSpaceID(),
    name: space.name ?? fakeWords(2),
    workspaceID: space.workspaceID ?? generateWorkspaceID(),
    updatedAt: space.updatedAt ?? new Date(),
    createdAt: space.createdAt ?? new Date(),
  };
}

export function makeCollaborator(
  collaborator: Partial<Collaborator>,
): Collaborator {
  return {
    id: collaborator.id ?? generateCollaboratorID(),
    userID: collaborator.userID ?? generateCollaboratorID(),
    profileImageID: collaborator.profileImageID ?? 'someID',
    name: collaborator.name ?? fakeWords(2),
    email: collaborator.email ?? fakeEmail(),
    spaceID: collaborator.spaceID ?? generateSpaceID(),
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
    id: field.id ?? generateFieldID(),
    name: field.name ?? fakeWord(),
    description: field.description ?? fakeWords(50),
    collectionID: field.collectionID ?? generateCollectionID(),
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
      includeTime: false,
      format: {
        day: 'numeric',
        year: 'numeric',
        month: 'numeric',
      },
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
        generateCollectionID(),
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
          id: generateSelectOptionID(),
          label: fakeWord(),
          color: palette.green[100],
          order: 1,
        },
        {
          id: generateSelectOptionID(),
          label: fakeWord(),
          color: palette.blue[100],
          order: 2,
        },
        {
          id: generateSelectOptionID(),
          label: fakeWord(),
          color: palette.red[100],
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
  [FieldType.SingleDocumentLink]: (field): SingleDocumentLinkField => {
    const base = makeBaseField(field);
    return {
      type: FieldType.SingleDocumentLink,
      documentsFromCollectionID:
        (field as Partial<MultiDocumentLinkField>).documentsFromCollectionID ??
        generateCollectionID(),
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
          id: generateSelectOptionID(),
          label: fakeWord(),
          color: palette.green[100],
          order: 1,
        },
        {
          id: generateSelectOptionID(),
          label: fakeWord(),
          color: palette.blue[100],
          order: 2,
        },
        {
          id: generateSelectOptionID(),
          label: fakeWord(),
          color: palette.red[100],
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
    id: collection.id ?? generateCollectionID(),
    name: collection.name ?? fakeWords(2),
    spaceID: collection.spaceID ?? generateSpaceID(),
    updatedAt: collection.updatedAt ?? new Date(),
    createdAt: collection.createdAt ?? new Date(),
    primaryFieldID: collection.primaryFieldID ?? generateFieldID(),
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
    id: view.id ?? generateViewID(),
    name: view.name ?? fakeWords(2),
    collectionID: view.collectionID ?? generateCollectionID(),
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
        width: i === 0 ? 240 : 180,
        order: i,
      })),
      (field) => field.id,
    ),
  };
}

export function makeManyDocuments(
  count: number,
  collection: CollectionWithFields,
  documentsByFieldID?: {
    [fieldID: string]: Document[];
  },
  collaborators?: Collaborator[],
): Document[] {
  return range(0, count).map(() => {
    return makeDocument({}, collection, documentsByFieldID, collaborators);
  });
}

export function makeDocument(
  document: Partial<Document>,
  collection?: CollectionWithFields,
  documentsByFieldID?: {
    [fieldID: string]: Document[];
  },
  collaborators?: Collaborator[],
): Document {
  const fields: { [fieldID: string]: FieldValue } = {
    ...document.fields,
  };

  if (collection) {
    for (const field of collection.fields) {
      if (document.fields?.[field.id] !== undefined) {
        continue;
      }

      fields[field.id] = fakeFieldValuesByFieldType[field.type](
        field,
        documentsByFieldID,
        collaborators,
      );
    }
  }

  return {
    id: document.id ?? generateDocumentID(),
    fields,
    collectionID:
      document.collectionID ?? collection?.id ?? generateCollectionID(),
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
    return fakeBoolean();
  },
  [FieldType.Currency]: () => {
    return fakeNumber();
  },
  [FieldType.Date]: () => {
    return formatISODate(fakeDate());
  },
  [FieldType.Email]: () => {
    return fakeEmail();
  },
  [FieldType.MultiCollaborator]: (
    field,
    _documentsByFieldID,
    collaborators,
  ) => {
    assertMultiCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(collaborators)) {
      return [];
    }

    return [sample(collaborators).id];
  },
  [FieldType.MultiDocumentLink]: (field, documentsByFieldID) => {
    if (documentsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(documentsByFieldID[field.id])) {
      return [];
    }

    return [sample(documentsByFieldID[field.id]).id];
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
  [FieldType.SingleCollaborator]: (
    field,
    documentsByFieldID,
    collaborators,
  ) => {
    assertSingleCollaboratorField(field);

    if (collaborators === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(collaborators)) {
      return null;
    }

    return sample(collaborators).id;
  },
  [FieldType.SingleDocumentLink]: (field, documentsByFieldID) => {
    if (documentsByFieldID === undefined) {
      throw new Error('Expected collaborators list to be passed in');
    }

    if (isEmpty(documentsByFieldID[field.id])) {
      return null;
    }

    return sample(documentsByFieldID[field.id]).id;
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
    id: filter.id ?? generateFilterID(),
    viewID: filter.viewID ?? generateViewID(),
    group: filter.group || 1,
    ...config,
  };
}

export function makeSort(sort: Partial<Sort>, config: SortConfig): Sort {
  return {
    id: sort.id ?? generateSortID(),
    viewID: sort.viewID ?? generateViewID(),
    sequence: sort.sequence || 1,
    ...config,
  };
}

export function makeGroup(group: Partial<Group>, config: SortConfig): Group {
  return {
    id: group.id ?? generateGroupID(),
    viewID: group.viewID ?? generateViewID(),
    sequence: group.sequence || 1,
    ...config,
  };
}
