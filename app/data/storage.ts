import AsyncStorage from '@react-native-community/async-storage';

import { StorageKeyPrefix } from './constants';
import { Workspace } from './workspace';
import { Note } from './notes';
import { List } from './list';
import { ListGroup } from './list_group';

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

export function useStorage() {
  return {
    saveWorkspace,
    removeWorkspace,
    saveNote,
    removeNote,
    saveList,
    removeList,
    saveListGroup,
    removeListGroup,
  };
}
