import { UserID } from './user';

export interface Collaborator {
  id: UserID;
  profileImageID: string | null;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  spaceID: string;
}
