export type CollaboratorID = string;

export interface Collaborator {
  id: CollaboratorID;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}
