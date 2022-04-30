import { generateID, validateID } from "../lib/id";
import { CollectionID } from "./collections";
import { FieldValue } from "./fields";

export interface Document {
  id: DocumentID;
  createdAt: Date;
  updatedAt: Date;
  fields: DocumentFieldValues;
  collectionID: CollectionID;
}

export const documentIDPrefix = "doc" as const;
export type DocumentID = `${typeof documentIDPrefix}${string}`;

export type DocumentFieldValues = {
  [fieldID: string]: FieldValue;
};
// export type DocumentFieldValues = Record<FieldID, FieldValue>;

export function generateDocumentID(): DocumentID {
  return generateID(documentIDPrefix);
}

export function validateDocumentID(id: string): void {
  return validateID(documentIDPrefix, id);
}
