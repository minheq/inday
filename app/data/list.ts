import { atom } from 'recoil';
import { RecoilKey } from './constants';

export interface List {
  id: string;
  name: string;
  workspaceID: string;
  typename: 'List';
}

export type ListsState = { [id: string]: List | undefined };
export const listsState = atom<ListsState>({
  key: RecoilKey.Lists,
  default: {},
});
