import { generateID } from '../../lib/id';
import { FieldID } from './fields';
import { SpaceID } from './spaces';

export const collectionIDPrefix = `col` as const;
export type CollectionID = string;
// export type CollectionID = `${typeof collectionIDPrefix}${string}`;
export function CollectionID(): CollectionID {
  return generateID(collectionIDPrefix);
}

export interface Collection {
  id: CollectionID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: SpaceID;
  primaryFieldID: FieldID;
}
