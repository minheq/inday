import { atom, selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';
import { collectionListQuery, Collection } from './collections';
import { space1 } from './fake_data';

export type SpaceID = string;

export interface Space {
  id: SpaceID;
  name: string;
  workspaceID: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SpacesState = { [spaceID: string]: Space | undefined };
export const spacesState = atom<SpacesState>({
  key: RecoilKey.Spaces,
  default: {
    [space1.id]: space1,
  },
});

export const spaceQuery = selectorFamily<Space | null, SpaceID>({
  key: RecoilKey.Space,
  get: (spaceID: SpaceID) => ({ get }) => {
    const spaces = get(spacesState);
    const space = spaces[spaceID];

    if (space === undefined) {
      return null;
    }

    return space;
  },
});

export const spaceCollectionListQuery = selectorFamily<Collection[], string>({
  key: RecoilKey.Space,
  get: (spaceID: SpaceID) => ({ get }) => {
    const collectionList = get(collectionListQuery);

    return collectionList.filter((c) => c.spaceID === spaceID);
  },
});

export const spaceListQuery = selector({
  key: RecoilKey.SpaceList,
  get: ({ get }) => {
    const spaces = get(spacesState);

    return Object.values(spaces) as Space[];
  },
});
