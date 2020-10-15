import { FieldValue } from './fields';

export type RecordID = string;

export interface Record {
  id: RecordID;
  createdAt: Date;
  updatedAt: Date;
  fields: {
    [fieldID: string]: FieldValue;
  };
  collectionID: string;
}
