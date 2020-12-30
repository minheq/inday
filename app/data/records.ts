import { generateID, validateID } from '../../lib/id';
import { CollectionID } from './collections';
import { FieldValue } from './fields';

export const recordIDPrefix = 'rec' as const;
export type RecordID = `${typeof recordIDPrefix}${string}`;

export const Record = {
  generateID: (): RecordID => {
    return generateID(recordIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(recordIDPrefix, id);
  },
};

export interface Record {
  id: RecordID;
  createdAt: Date;
  updatedAt: Date;
  fields: RecordFieldValues;
  collectionID: CollectionID;
}

export interface RecordFieldValues {
  [fieldID: string]: FieldValue;
}
