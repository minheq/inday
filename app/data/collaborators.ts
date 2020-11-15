export type CollaboratorID = string;

export interface Collaborator {
  id: CollaboratorID;
  profileImageID: string | null;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}
