import { generateID, validateID } from "../lib/id";

export const spaceIDPrefix = "spc" as const;
export type SpaceID = `${typeof spaceIDPrefix}${string}`;

export function generateSpaceID(): SpaceID {
  return generateID(spaceIDPrefix);
}

export function validateSpaceID(id: string): void {
  return validateID(spaceIDPrefix, id);
}

export interface Space {
  id: SpaceID;
  name: string;
  workspaceID: string;
  createdAt: Date;
  updatedAt: Date;
}
