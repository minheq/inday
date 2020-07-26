import { atom } from 'recoil';

import { RecoilKey } from './constants';

export interface Workspace {
  id: string;
  name: string;
  ownerID: string;
}

export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: RecoilKey.Workspace,
  default: null,
});
