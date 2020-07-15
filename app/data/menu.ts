import { atom } from 'recoil';
import { RecoilKey } from './constants';

export type MenuState = {
  listGroupIDs: { [listGroupID: string]: { expanded: boolean } | undefined };
};

export const menuState = atom<MenuState>({
  key: RecoilKey.Menu,
  default: {
    listGroupIDs: {},
  },
});
