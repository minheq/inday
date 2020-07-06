import { atom } from 'recoil';

import { Workspace } from './types';
import { RecoilKey } from './constants';

export type WorkspaceState = Workspace | null;
export const workspaceState = atom<WorkspaceState>({
  key: RecoilKey.Workspace,
  default: null,
});
