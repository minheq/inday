import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { StorageKey } from './constants';

export const NavigationAtomKey = 'Navigation';

export enum Location {
  All = 'All',
  Inbox = 'Inbox',
  Today = 'Today',
  List = 'List',
}

export const navigationState = atom<NavigationState>({
  key: NavigationAtomKey,
  default: { location: Location.Inbox, noteID: '' },
});

export type NavigationState =
  | { location: Location.All; noteID: string }
  | { location: Location.Inbox; noteID: string }
  | { location: Location.Today; noteID: string }
  | {
      location: Location.List;
      listID: string;
      noteID: string;
    };

export function useNavigation() {
  const [navigation, setNavigation] = useRecoilState(navigationState);

  const handleNavigate = React.useCallback(
    (newState: NavigationState) => {
      setNavigation(newState);
      AsyncStorage.setItem(StorageKey.Navigation, JSON.stringify(newState));
    },
    [setNavigation],
  );

  return {
    state: navigation,
    navigate: handleNavigate,
  };
}
