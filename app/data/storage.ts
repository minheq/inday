import AsyncStorage from '@react-native-community/async-storage';

import { StorageKeyPrefix, StorageKey } from './constants';
import { Workspace } from './workspace';
import { Note } from './notes';
import { List } from './list';
import { ListGroup } from './list_group';
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

async function saveList(list: List) {
  await AsyncStorage.setItem(
    `${StorageKeyPrefix.List}:${list.id}`,
    JSON.stringify(list),
  );
}

async function removeList(list: List) {
  await AsyncStorage.removeItem(`${StorageKeyPrefix.List}:${list.id}`);
}

async function saveListGroup(listGroup: ListGroup) {
  await AsyncStorage.setItem(
    `${StorageKeyPrefix.ListGroup}:${listGroup.id}`,
    JSON.stringify(listGroup),
  );
}

async function removeListGroup(listGroup: ListGroup) {
  await AsyncStorage.removeItem(
    `${StorageKeyPrefix.ListGroup}:${listGroup.id}`,
  );
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
    saveList,
    removeList,
    saveListGroup,
    removeListGroup,
    saveNavigationState,
    saveMenuState,
  };
}
