import AsyncStorage from '@react-native-community/async-storage';

import { StorageKeyPrefix, StorageKey } from './constants';
import { Workspace } from './workspace';
import { Note } from './notes';
import { Tag } from './tag';
import { NavigationState } from './navigation';
import { MenuState } from './menu';

async function saveWorkspaceID(workspace: Workspace) {
  await AsyncStorage.setItem(StorageKey.WorkspaceID, workspace.id);
}

async function saveWorkspace(workspace: Workspace) {
  await AsyncStorage.setItem(
    `${StorageKeyPrefix.Workspace}:${workspace.id}`,
    JSON.stringify(workspace),
  );
}

async function removeWorkspace(workspace: Workspace) {
  await AsyncStorage.removeItem(
    `${StorageKeyPrefix.Workspace}:${workspace.id}`,
  );
}

async function saveNote(note: Note) {
  await AsyncStorage.setItem(
    `${StorageKeyPrefix.Note}:${note.id}`,
    JSON.stringify(note),
  );
}

async function removeNote(note: Note) {
  await AsyncStorage.removeItem(`${StorageKeyPrefix.Note}:${note.id}`);
}

async function saveTag(tag: Tag) {
  await AsyncStorage.setItem(
    `${StorageKeyPrefix.Tag}:${tag.id}`,
    JSON.stringify(tag),
  );
}

async function removeTag(tag: Tag) {
  await AsyncStorage.removeItem(`${StorageKeyPrefix.Tag}:${tag.id}`);
}

async function saveNavigationState(navigationState: NavigationState) {
  await AsyncStorage.setItem(
    StorageKey.Navigation,
    JSON.stringify(navigationState),
  );
}

async function saveMenuState(menuState: MenuState) {
  await AsyncStorage.setItem(StorageKey.Menu, JSON.stringify(menuState));
}

export function useStorage() {
  return {
    saveWorkspaceID,
    saveWorkspace,
    removeWorkspace,
    saveNote,
    removeNote,
    saveTag,
    removeTag,
    saveNavigationState,
    saveMenuState,
  };
}
