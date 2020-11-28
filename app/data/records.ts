import { generateID } from '../../lib/id';
import { FieldValue } from './fields';

export const recordIDPrefix = 'rec' as const;
export type RecordID = string;
// export type RecordID = `${typeof recordIDPrefix}${string}`;
export function RecordID(): RecordID {
  return generateID(recordIDPrefix);
}

export interface Record {
  id: RecordID;
  createdAt: Date;
  updatedAt: Date;
  fields: {
    [fieldID: string]: FieldValue;
  };
  collectionID: string;
}
