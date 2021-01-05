import { generateID, validateID } from '../lib/id';
import { FieldID } from './fields';
import { SpaceID } from './spaces';

export const collectionIDPrefix = `col` as const;
export type CollectionID = `${typeof collectionIDPrefix}${string}`;

export interface Collection {
  id: CollectionID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: SpaceID;
  primaryFieldID: FieldID;
}

export function generateCollectionID(): CollectionID {
  return generateID(collectionIDPrefix);
}

export function validateCollectionID(id: string): void {
  return validateID(collectionIDPrefix, id);
}
