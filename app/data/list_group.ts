import { atom, selectorFamily } from 'recoil';
import { RecoilKey } from './constants';
import { listsState } from './list';

export interface ListGroup {
  id: string;
  name: string;
  listIDs: string[];
  workspaceID: string;
  typename: 'ListGroup';
}

export type ListGroupsState = { [id: string]: ListGroup | undefined };
export const listGroupsState = atom<ListGroupsState>({
  key: RecoilKey.ListGroups,
  default: {},
});

export const listGroupQuery = selectorFamily({
  key: RecoilKey.ListGroup,
  get: (listGroupID: string) => ({ get }) => {
    const lists = get(listsState);
    const listGroups = get(listGroupsState);
    const listGroup = listGroups[listGroupID];

    if (listGroup === undefined) {
      throw new Error('ListGroup not found');
    }

    return listGroup.listIDs.map((listID) => {
      const list = lists[listID];

      if (list === undefined) {
        throw new Error('List not found');
      }

      return list;
    });
  },
});
