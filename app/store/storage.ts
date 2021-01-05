import AsyncStorage from '@react-native-community/async-storage';
import { Workspace } from '../../models/workspace';

// eslint-disable-next-line no-shadow
export enum StorageKey {
  WorkspaceID = 'WorkspaceID',
  Navigation = 'Navigation',
  Menu = 'Menu',
}

export async function saveWorkspaceID(workspace: Workspace): Promise<void> {
  await AsyncStorage.setItem(StorageKey.WorkspaceID, workspace.id);
}
