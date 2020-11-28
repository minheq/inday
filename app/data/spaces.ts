import { generateID } from '../../lib/id';

export const spaceIDPrefix = 'spc' as const;
export type SpaceID = string;
// export type SpaceID = `${typeof spaceIDPrefix}${string}`;
export function SpaceID(): SpaceID {
  return generateID(spaceIDPrefix);
}

export interface Space {
  id: SpaceID;
  name: string;
  workspaceID: string;
  createdAt: Date;
  updatedAt: Date;
}
