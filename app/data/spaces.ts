import { atom, selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';

export interface Space {
  id: string;
  name: string;
  workspaceID: string;
  typename: 'Space';
}

export type SpacesState = { [id: string]: Space | undefined };
export const spacesState = atom<SpacesState>({
  key: RecoilKey.Spaces,
  default: {},
});

export const spaceQuery = selectorFamily<Space | null, string>({
  key: RecoilKey.Space,
  get: (spaceID: string) => ({ get }) => {
    const spaces = get(spacesState);
    const space = spaces[spaceID];

    if (space === undefined) {
      return null;
    }

    return space;
  },
});

export const spaceListQuery = selector({
  key: RecoilKey.SpaceList,
  get: ({ get }) => {
    const spaces = get(spacesState);

    return Object.values(spaces) as Space[];
  },
});
