import { atom, selector } from 'recoil';

import { RecoilKey } from './constants';
import { listsState } from './list';
import { listGroupsState } from './list_group';

type List = {
  id: string;
  type: 'List' | 'ListGroup';
};

export interface Workspace {
  id: string;
  name: string;
  all: string[];
  inbox: string[];
  lists: List[];
  typename: 'Workspace';
}

export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: RecoilKey.Workspace,
  default: null,
});

export const allListsQuery = selector({
  key: RecoilKey.AllLists,
  get: ({ get }) => {
    const lists = get(listsState);
    const listGroups = get(listGroupsState);
    const workspace = get(workspaceState);

    if (workspace === null) {
      throw new Error('Workspace not found');
    }

    return workspace.lists.map((listSource) => {
      if (listSource.type === 'List') {
        const list = lists[listSource.id];
        if (list === undefined) {
          throw new Error('List not found');
        }

        return list;
      }

      const listGroup = listGroups[listSource.id];
      if (listGroup === undefined) {
        throw new Error('ListGroup not found');
      }
      return listGroup;
    });
  },
});
