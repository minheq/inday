import { generateID, validateID } from '../../lib/id';
import { CollectionID } from './collections';
import { FieldID, FieldValue } from './fields';

export const documentIDPrefix = 'doc' as const;
export type DocumentID = `${typeof documentIDPrefix}${string}`;

export const Document = {
  generateID: (): DocumentID => {
    return generateID(documentIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(documentIDPrefix, id);
  },
};

export interface Document {
  id: DocumentID;
  createdAt: Date;
  updatedAt: Date;
  fields: DocumentFieldValues;
  collectionID: CollectionID;
}

export type DocumentFieldValues = {
  [fieldID: string]: FieldValue;
};
// export type DocumentFieldValues = Record<FieldID, FieldValue>;
