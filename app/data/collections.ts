import { FieldID } from './fields';
import { SpaceID } from './spaces';

export type CollectionID = string;

export interface Collection {
  id: CollectionID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: SpaceID;
  mainFieldID: FieldID;
}
