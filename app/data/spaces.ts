import { atom, selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';
import { collectionsQuery, Collection } from './collections';
import { spacesByIDFixtures } from './fixtures';

export type SpaceID = string;

export interface Space {
  id: SpaceID;
  name: string;
  workspaceID: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SpacesByIDState = { [spaceID: string]: Space | undefined };
export const spacesByIDState = atom<SpacesByIDState>({
  key: RecoilKey.SpacesByID,
  default: spacesByIDFixtures,
  persistence_UNSTABLE: { type: true },
});

export const spaceQuery = selectorFamily<Space | null, SpaceID>({
  key: RecoilKey.Space,
  get: (spaceID: SpaceID) => ({ get }) => {
    const spacesByID = get(spacesByIDState);
    const space = spacesByID[spaceID];

    if (space === undefined) {
      return null;
    }

    return space;
  },
});

export const spaceCollectionsQuery = selectorFamily<Collection[], string>({
  key: RecoilKey.Space,
  get: (spaceID: SpaceID) => ({ get }) => {
    const collections = get(collectionsQuery);

    return collections.filter((c) => c.spaceID === spaceID);
  },
});

export const spacesQuery = selector({
  key: RecoilKey.Spaces,
  get: ({ get }) => {
    const spacesByID = get(spacesByIDState);

    return Object.values(spacesByID) as Space[];
  },
});
