import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';

import { navigationState, NavigationState } from './atoms';
import { useGetNotes } from './api';
import { StorageKey } from './storage';
import { ListID } from './types';

export function useNavigation() {
  return useRecoilValue(navigationState);
}

export function useViewListID() {
  const [navigation, setNavigation] = useRecoilState(navigationState);
  const notes = useGetNotes({ id: navigation.listID });

  const viewListID = React.useCallback(
    (listID: ListID) => {
      const newNavigation: NavigationState = {
        listID,
        noteID: notes.length > 0 ? notes[0].id : '',
      };
      setNavigation(newNavigation);
      Promise.all([
        AsyncStorage.setItem(StorageKey.LastListID, newNavigation.listID),
        AsyncStorage.setItem(StorageKey.LastNoteID, newNavigation.noteID),
      ]);
    },
    [notes, setNavigation],
  );

  return viewListID;
}

export function useViewNoteID() {
  const [navigation, setNavigation] = useRecoilState(navigationState);

  const viewNoteID = React.useCallback(
    (noteID: string) => {
      const newNavigation: NavigationState = {
        listID: navigation.listID,
        noteID,
      };
      setNavigation(newNavigation);
      Promise.all([
        AsyncStorage.setItem(StorageKey.LastListID, newNavigation.listID),
        AsyncStorage.setItem(StorageKey.LastNoteID, newNavigation.noteID),
      ]);
    },
    [navigation, setNavigation],
  );

  return viewNoteID;
}
