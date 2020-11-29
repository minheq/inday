import { generateID, validateID } from '../../lib/id';
import { FieldID } from './fields';
import { SpaceID } from './spaces';

export const collectionIDPrefix = `col` as const;
export type CollectionID = `${typeof collectionIDPrefix}${string}`;

export const Collection = {
  generateID: (): CollectionID => {
    return generateID(collectionIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(collectionIDPrefix, id);
  },
};

export interface Collection {
  id: CollectionID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: SpaceID;
  primaryFieldID: FieldID;
}
