import { RecoilState } from 'recoil';
import { workspaceState } from './workspace';
import { navigationState } from './navigation';
import { notesState } from './notes';
import { RecoilKey } from './constants';

export function getAtomWithKey(key: RecoilKey): RecoilState<any> {
  switch (key) {
    case RecoilKey.Workspace:
      return workspaceState;
    case RecoilKey.Navigation:
      return navigationState;
    case RecoilKey.NotesByID:
      return notesState;
    default:
      throw new Error('Invalid atom key');
  }
}
