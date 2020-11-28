import AsyncStorage from '@react-native-community/async-storage';

export enum StorageKey {
  WorkspaceID = 'WorkspaceID',
  Navigation = 'Navigation',
  Menu = 'Menu',
}

import { Workspace } from './workspace';

async function saveWorkspaceID(workspace: Workspace): Promise<void> {
  await AsyncStorage.setItem(StorageKey.WorkspaceID, workspace.id);
}

export const Storage = {
  saveWorkspaceID,
};
