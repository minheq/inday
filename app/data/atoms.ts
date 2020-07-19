import { RecoilState } from 'recoil';
import { workspaceState } from './workspace';
import { navigationState } from './navigation';
import { notesState } from './notes';
import { RecoilKey } from './constants';
import { tagsState } from './tag';
import { menuState } from './menu';

export function getAtomWithKey(key: RecoilKey): RecoilState<any> {
  switch (key) {
    case RecoilKey.Workspace:
      return workspaceState;
    case RecoilKey.Navigation:
      return navigationState;
    case RecoilKey.Menu:
      return menuState;
    case RecoilKey.Notes:
      return notesState;
    case RecoilKey.Tags:
      return tagsState;
    default:
      throw new Error('Invalid atom key');
  }
}
