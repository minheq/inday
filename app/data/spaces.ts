export type SpaceID = string;

export interface Space {
  id: SpaceID;
  name: string;
  workspaceID: string;
  createdAt: Date;
  updatedAt: Date;
}
