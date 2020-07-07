import { RecoilState } from 'recoil';
import { workspaceState } from './workspace';
import { navigationState } from './navigation';
import { notesState } from './notes';
import { RecoilKey } from './constants';
import { listsState } from './list';
import { listGroupsState } from './list_group';

export function getAtomWithKey(key: RecoilKey): RecoilState<any> {
  switch (key) {
    case RecoilKey.Workspace:
      return workspaceState;
    case RecoilKey.Navigation:
      return navigationState;
    case RecoilKey.Notes:
      return notesState;
    case RecoilKey.Lists:
      return listsState;
    case RecoilKey.ListGroups:
      return listGroupsState;
    default:
      throw new Error('Invalid atom key');
  }
}
