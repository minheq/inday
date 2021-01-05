import { generateID, validateID } from '../lib/id';

export const workspaceIDPrefix = 'wrk' as const;
export type WorkspaceID = `${typeof workspaceIDPrefix}${string}`;

export interface Workspace {
  id: WorkspaceID;
  name: string;
  ownerID: string;
}

export function generateWorkspaceID(): WorkspaceID {
  return generateID(workspaceIDPrefix);
}

export function validateWorkspaceID(id: string): void {
  return validateID(workspaceIDPrefix, id);
}
