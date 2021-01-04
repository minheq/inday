import { generateID, validateID } from '../lib/id';
import { UserID } from './user';

export interface Collaborator {
  id: CollaboratorID;
  userID: UserID;
  profileImageID: string | null;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}

export const collaboratorIDPrefix = 'clb' as const;
export type CollaboratorID = `${typeof collaboratorIDPrefix}${string}`;

export function generateCollaboratorID(): CollaboratorID {
  return generateID(collaboratorIDPrefix);
}

export function validateCollaboratorID(id: string): void {
  return validateID(collaboratorIDPrefix, id);
}
