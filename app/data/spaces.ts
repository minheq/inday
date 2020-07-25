import { atom, selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';

export interface Space {
  id: string;
  name: string;
  workspaceID: string;
  typename: 'Space';
}

export const Space = {
  getCollection: () => {},
};

export type SpacesState = { [id: string]: Space | undefined };
export const spacesState = atom<SpacesState>({
  key: RecoilKey.Spaces,
  default: {},
});

export const spaceQuery = selectorFamily<Space | null, string>({
  key: RecoilKey.Spaces,
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
  key: RecoilKey.Spaces,
  get: ({ get }) => {
    const spaces = get(spacesState);

    return Object.values(spaces) as Space[];
  },
});
