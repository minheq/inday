import { atom } from 'recoil';

import { RecoilKey } from './constants';

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
