import { generateID, validateID } from '../../lib/id';

export const spaceIDPrefix = 'spc' as const;
export type SpaceID = `${typeof spaceIDPrefix}${string}`;

export const Space = {
  generateID: (): SpaceID => {
    return generateID(spaceIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(spaceIDPrefix, id);
  },
};

export interface Space {
  id: SpaceID;
  name: string;
  workspaceID: string;
  createdAt: Date;
  updatedAt: Date;
}
