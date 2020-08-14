export type CollectionID = string;

export interface Collection {
  id: CollectionID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}
