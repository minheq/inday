import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useRecoilState } from 'recoil';
import { useAsync } from '../hooks/use_async';
import { StorageKey } from './storage';
import { navigationState, NavigationState } from './atoms';
import { useGetNotes } from './api';

function useInitNavigation() {
  const [navigation, setNavigation] = useRecoilState(navigationState);
  const notes = useGetNotes({ id: 'all' });

  const init = React.useCallback(async () => {
    if (navigation.listID === '') {
      const newNavigation: NavigationState = {
        listID: 'all',
        noteID: notes.length > 0 ? notes[0].id : '',
      };

      setNavigation(newNavigation);

      Promise.all([
        AsyncStorage.setItem(StorageKey.LastListID, newNavigation.listID),
        AsyncStorage.setItem(StorageKey.LastNoteID, newNavigation.noteID),
      ]);
    }
  }, [navigation, setNavigation, notes]);

  useAsync('initNavigation', init);
}

export function InitNavigation() {
  useInitNavigation();
  return null;
}
