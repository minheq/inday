import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { atom, useRecoilValue, useRecoilState } from 'recoil';
import { StorageKey } from './constants';

export const NavigationAtomKey = 'Navigation';

export enum Location {
  All = 'All',
  Inbox = 'Inbox',
  Daily = 'Daily',
  List = 'List',
}

export const navigationState = atom<NavigationState>({
  key: NavigationAtomKey,
  default: { location: Location.Inbox, noteID: '' },
});

export type NavigationState =
  | { location: Location.All; noteID: string }
  | { location: Location.Inbox; noteID: string }
  | { location: Location.Daily; noteID: string }
  | {
      location: Location.List;
      listID: string;
      noteID: string;
    };

export function useNavigation() {
  return useRecoilValue(navigationState);
}

export function useViewListID() {
  const [navigation, setNavigation] = useRecoilState(navigationState);

  const viewListID = React.useCallback(
    (location: Location) => {
      let newNavigation: NavigationState = { ...navigation };

      switch (location) {
        case Location.All:
          newNavigation = { location, noteID: '' };
          break;
        case Location.Inbox:
          newNavigation = { location, noteID: '' };
          break;
        case Location.Daily:
          newNavigation = { location, noteID: '' };
          break;
        case Location.List:
          newNavigation = { location, listID: '', noteID: '' };
          break;

        default:
          throw new Error('Invalid location');
      }

      setNavigation(newNavigation);

      AsyncStorage.setItem(
        StorageKey.Navigation,
        JSON.stringify(newNavigation),
      );
    },
    [navigation, setNavigation],
  );

  return viewListID;
}

export function useViewNoteID() {
  const [navigation, setNavigation] = useRecoilState(navigationState);

  const viewNoteID = React.useCallback(
    (noteID: string) => {
      const newNavigation: NavigationState = {
        ...navigation,
        noteID,
      };
      setNavigation(newNavigation);
      AsyncStorage.setItem(
        StorageKey.Navigation,
        JSON.stringify(newNavigation),
      );
    },
    [navigation, setNavigation],
  );

  return viewNoteID;
}
