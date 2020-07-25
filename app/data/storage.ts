import AsyncStorage from '@react-native-community/async-storage';

import { StorageKey } from './constants';
import { Workspace } from './workspace';

async function saveWorkspaceID(workspace: Workspace) {
  await AsyncStorage.setItem(StorageKey.WorkspaceID, workspace.id);
}

export function useStorage() {
  return {
    saveWorkspaceID,
  };
}
